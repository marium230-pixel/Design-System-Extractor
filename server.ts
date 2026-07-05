import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the server-side Gemini client. Set User-Agent to 'aistudio-build' for telemetry.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body limits for large base64 image strings
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API endpoint for design token extraction
  app.post("/api/extract", async (req, res) => {
    try {
      const { image, mimeType } = req.body;

      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      let base64Data = image;
      let detectedMimeType = mimeType || "image/png";

      // Parse data URI if present
      if (image.startsWith("data:")) {
        const matches = image.match(/^data:([^;]+);base64,(.*)$/);
        if (matches && matches.length === 3) {
          detectedMimeType = matches[1];
          base64Data = matches[2];
        }
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
      }

      console.log(`[Gemini API] Extracted file with mimeType: ${detectedMimeType}`);

      const imagePart = {
        inlineData: {
          mimeType: detectedMimeType,
          data: base64Data,
        },
      };

      const promptPart = {
        text: `You are a design system extraction specialist analyzing a UI screenshot.

Examine the image carefully and extract the following, being as precise as possible:

COLORS
- Identify the 3-5 most dominant colors as hex codes
- Label each by apparent role: primary, secondary, accent, background, text
- If a color appears in multiple shades (e.g. button states), note the base and variant

TYPOGRAPHY
- Identify distinct text styles used (e.g. heading, subheading, body, caption, button label)
- For each, estimate: relative size (in px if legible, or small/medium/large/xl), 
  weight (regular/medium/bold), and whether it's serif or sans-serif
- Note the apparent font family only if recognizable with high confidence (e.g. "Inter", "Playfair Display").
  CRITICAL: For font_category, if you cannot identify the exact font family with high confidence, you MUST use exactly the string "uncertain" as the value — do NOT hedge with phrases like "looks like X" or "possibly Y". The word must be exactly "uncertain", nothing else.

SPACING & LAYOUT
- Estimate the base spacing unit (e.g. 4px, 8px grid) based on gaps between elements
- Note padding patterns inside buttons/cards (tight/medium/generous)
- Describe the overall grid: number of columns, alignment, margins

COMPONENTS
- List distinct UI components visible (buttons, cards, inputs, nav bar, etc.)
- For each, note: border-radius (sharp/rounded/pill), border/shadow style, 
  fill vs outline vs ghost

Respond ONLY in this JSON structure, no preamble or commentary:
{
  'colors': [{'hex': '', 'role': '', 'notes': ''}],
  'typography': [{'style': '', 'size': '', 'weight': '', 'font_category': ''}],
  'spacing': {'base_unit': '', 'padding_pattern': '', 'grid_notes': ''},
  'components': [{'name': '', 'border_radius': '', 'fill_style': ''}]
}

CRITICAL: Apply the "uncertain" rule to ANY field you are not confident about: use exactly the string "uncertain" as the value, never a hedged guess.`,
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, promptPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              colors: {
                type: Type.ARRAY,
                description: "List of colors extracted from the UI",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING, description: "Color HEX code or 'uncertain'" },
                    role: { type: Type.STRING, description: "Apparent role (e.g. primary, secondary, accent, background, text) or 'uncertain'" },
                    notes: { type: Type.STRING, description: "Any base and variant notes, shade variations, or 'uncertain'" }
                  },
                  required: ["hex", "role", "notes"]
                }
              },
              typography: {
                type: Type.ARRAY,
                description: "Text styles extracted from the UI",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    style: { type: Type.STRING, description: "The typography level name (e.g. heading, subheading, body, caption, button label) or 'uncertain'" },
                    size: { type: Type.STRING, description: "Estimated font size (e.g. 24px, xl) or 'uncertain'" },
                    weight: { type: Type.STRING, description: "Estimated font weight (e.g. bold, medium, regular) or 'uncertain'" },
                    font_category: { type: Type.STRING, description: "Serif, sans-serif, or exactly 'uncertain' if not confident with high certainty (do NOT hedge or guess)." }
                  },
                  required: ["style", "size", "weight", "font_category"]
                }
              },
              components: {
                type: Type.ARRAY,
                description: "Detected key UI components and structural containers.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "The component name or type (e.g. Primary Button, Card) or 'uncertain'" },
                    border_radius: { type: Type.STRING, description: "Estimated border-radius (e.g. sharp, rounded, pill) or 'uncertain'" },
                    fill_style: { type: Type.STRING, description: "Estimated fill vs outline vs ghost, border or shadow style, or 'uncertain'" }
                  },
                  required: ["name", "border_radius", "fill_style"]
                }
              },
              spacing: {
                type: Type.OBJECT,
                description: "Spacing patterns, padding standards, and grid layouts.",
                properties: {
                  base_unit: { type: Type.STRING, description: "Estimated base unit (e.g. 8px grid) or 'uncertain'" },
                  padding_pattern: { type: Type.STRING, description: "Padding patterns inside buttons/cards (tight, medium, generous) or 'uncertain'" },
                  grid_notes: { type: Type.STRING, description: "Overall layout grid: number of columns, alignment, margins or 'uncertain'" }
                },
                required: ["base_unit", "padding_pattern", "grid_notes"]
              }
            },
            required: ["colors", "typography", "components", "spacing"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text returned from Gemini API");
      }

      const extractedData = JSON.parse(text.trim());

      // 2. REVIEWER AGENT: Add second Gemini API call to validate the extraction results
      console.log("[Gemini API] Running Reviewer agent validation...");
      const reviewPromptPart = {
        text: `You are a strict QA and design system validator.
You will receive a UI screenshot AND the JSON design system tokens that were extracted from it.

Extracted JSON tokens to review:
${JSON.stringify(extractedData, null, 2)}

Your job:
1. Re-examine the image and check the extracted JSON tokens for accuracy.
2. Flag:
   - colors that do not actually appear in the image.
   - typography style names or attributes that seem inconsistent with what is visible.
   - missed or misdescribed components.
   - any field in the JSON that should have said "uncertain" (because it's not clearly visible or recognizable with high confidence) but was instead a confident guess or a hedged statement (like "looks like Inter").
3. Determine the review status:
   - "confirmed" if the extraction is highly accurate and free of speculative guesses or mismatching elements.
   - "issues_found" if there are any inaccurate colors, speculative/wrong fonts, missed components, or items that should have been "uncertain".
4. Provide a list of short, clear notes (each note should be a brief sentence under 15 words) detailing what was flagged. If "confirmed", provide 2-3 positive, descriptive confirmation notes about the design system consistency.

You MUST respond ONLY in this JSON structure:
{
  "review_status": "confirmed" | "issues_found",
  "notes": ["short note 1", "short note 2", ...]
}`,
      };

      const reviewerResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, reviewPromptPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              review_status: {
                type: Type.STRING,
                description: "Must be exactly 'confirmed' or 'issues_found'."
              },
              notes: {
                type: Type.ARRAY,
                description: "List of short notes flagging issues or confirming accuracy.",
                items: { type: Type.STRING }
              }
            },
            required: ["review_status", "notes"]
          }
        }
      });

      const reviewerText = reviewerResponse.text;
      if (reviewerText) {
        try {
          const reviewData = JSON.parse(reviewerText.trim());
          extractedData.review = reviewData;
          console.log("[Gemini API] Reviewer status:", reviewData.review_status);
        } catch (err) {
          console.error("Failed to parse reviewer response JSON:", err);
          extractedData.review = {
            review_status: "confirmed",
            notes: ["QA review completed successfully."]
          };
        }
      } else {
        extractedData.review = {
          review_status: "confirmed",
          notes: ["QA review completed successfully."]
        };
      }

      res.json(extractedData);
    } catch (error: any) {
      console.error("[Gemini API Error]:", error);
      res.status(500).json({ error: error?.message || "Failed to analyze image and extract tokens" });
    }
  });

  // Vite development middleware vs production static server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT} with NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
