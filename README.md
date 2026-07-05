# Design System Extractor

**AI-powered visual tokenization — turn any UI screenshot into a structured, reusable design system.**

Built for the *AI Agents: Intensive Vibe Coding Capstone Project* (Freestyle track), using Google AI Studio and Gemini 3.5 Flash.

---

## The Problem

Manually extracting a design system from a reference screenshot — picking out hex codes, measuring spacing, guessing font sizes and component styles — is slow, error-prone, and something I've done by hand repeatedly during freelance UI/UX work (design system extraction from client reference screenshots, matching existing brand palettes for new builds).

This agent automates that process: upload a screenshot, get back a structured, exportable design system in seconds.

## What It Does

1. **Upload** any UI screenshot (PNG/JPG)
2. **Extraction agent** analyzes the image using Gemini's vision capabilities and identifies:
   - **Colors** — hex codes labeled by role (primary, secondary, accent, background, text)
   - **Typography** — distinct text styles with size, weight, and font category
   - **Spacing** — base spacing unit, padding patterns, grid/layout notes
   - **Components** — buttons, cards, badges, etc. with border-radius and fill style
3. **Export** the result in three formats:
   - Raw JSON (custom schema)
   - CSS Variables (`:root` block, ready to drop into a stylesheet)
   - Figma-compatible Design Tokens (W3C Design Tokens format, works with Tokens Studio and similar plugins)

## Architecture

This is a multi-step agent pipeline, not a single prompt call:

```
Screenshot → Extraction Agent → Structured JSON → Export Layer
                                                  ├─ Raw JSON
                                                  ├─ CSS Variables
                                                  └─ Figma Design Tokens
```

- The **extraction agent** uses a strict system prompt that forces JSON-only output across four fixed categories (colors, typography, spacing, components), with an explicit instruction to output `"uncertain"` rather than guess when a value genuinely can't be determined from the image.
- The **export layer** transforms the same underlying token data into three different downstream formats, so the output isn't just a display — it's usable in real design/dev tooling.

## Features

- Dark/light mode toggle
- Preset playground with sample images for instant testing (no upload required)
- Tabbed results view: Full Spec, Colors, Typography, Components, Spacing, Raw JSON, CSS Variables, Figma Tokens
- Copy-to-clipboard and download options for all export formats

## What I Learned (Testing & Limitations)

I tested the extractor against three categories of screenshots: a real banking/dashboard app, a minimalist sparse UI, and a deliberately difficult hand-lettered/ligature-font design — to stress-test the "uncertain" handling.

**Finding:** the model reliably separates and labels colors, typography, and components across normal UI screenshots. But on the hand-lettered font test, it labeled a decorative ligature script as `"serif"` rather than `"uncertain"` — because my schema only allowed `serif`/`sans-serif` as font categories. There was no correct bucket for a script/display font, so the model picked the nearest available option instead of flagging the mismatch.

This was a **schema design limitation**, not just a prompt-following failure — the fix isn't just a stricter prompt, it's expanding the allowed `font_category` values to include `script`, `display`, and `handwritten`, giving the model an honest option to choose.

Elsewhere, the "uncertain" instruction does work correctly in later tests — component border-radius, spacing base-unit, and ambiguous font categories were all correctly marked `"uncertain"` once the schema and prompt were tightened.

**A second, more interesting finding came from testing the reviewer agent.** I added a second-pass reviewer agent whose job is to re-check the extraction against the original image and flag inaccuracies. When tested against the same hand-lettered-font image, the reviewer agent *approved* the same `"serif"` mislabel the extractor had made, explicitly noting "correctly identify the serif category" in its review notes.

This revealed that a second-pass review isn't automatically more reliable — **both agents were built on the same model with the same schema constraints, so the reviewer inherited the exact same blind spot rather than independently catching it.** The reviewer agent did prove useful for catching *missing or uncertain* fields, just not for catching *category-level* mismatches baked into the schema itself. This is a more nuanced and honest finding than either "the reviewer works" or "it doesn't" — it works for some failure modes and not others, and understanding why (shared constraints, not independent judgment) is more valuable than the fix itself.

**Other known limitations:**
- Exact font family matching is inherently approximate from a static image alone (no way to verify against actual font files)
- The CSS/Figma export formats are not yet validated against a live Figma Tokens Studio import — done in principle per the W3C spec, but not confirmed end-to-end
- The reviewer agent uses the same underlying schema as the extractor, so it cannot catch mismatches the schema itself doesn't have room for (see above) — a true independent review would need either a different model or a deliberately different, broader schema for the review pass

## Tech Stack

- Google AI Studio (Build mode)
- Gemini 3.5 Flash (vision + JSON generation)
- Server-side API integration (API key not exposed client-side)

## Try It

**Live app:** https://design-system-extractor-903161402522.asia-southeast1.run.app

Use the Preset Playground to test instantly with sample images, or upload your own UI screenshot.
