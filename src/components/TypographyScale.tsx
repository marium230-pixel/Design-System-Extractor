import { useState } from "react";
import { TypographyToken } from "../types";
import { Type, Info, HelpCircle } from "lucide-react";

interface TypographyScaleProps {
  typography: TypographyToken[];
  theme?: "dark" | "light";
}

export default function TypographyScale({ typography, theme = "dark" }: TypographyScaleProps) {
  const [previewText, setPreviewText] = useState("Design Token Engine");
  const isLight = theme === "light";

  const isUncertain = (val: string) => {
    return !val || val.toLowerCase().includes("uncertain");
  };

  // Maps estimated sizes (px or text like xl, large) to actual CSS font sizes for the preview
  const parseSize = (size: string) => {
    if (isUncertain(size)) return "16px";
    const cleaned = size.trim().toLowerCase();
    if (cleaned.endsWith("px") || cleaned.endsWith("rem") || cleaned.endsWith("em") || cleaned.endsWith("pt")) {
      return cleaned;
    }
    // Handle relative sizes
    if (cleaned.includes("xxl") || cleaned.includes("2xl") || cleaned.includes("display")) return "36px";
    if (cleaned.includes("xl")) return "24px";
    if (cleaned.includes("large") || cleaned.includes("lg")) return "20px";
    if (cleaned.includes("medium") || cleaned.includes("md") || cleaned.includes("subheading")) return "16px";
    if (cleaned.includes("small") || cleaned.includes("sm") || cleaned.includes("caption")) return "12px";
    return "15px"; // default
  };

  const parseWeight = (weight: string) => {
    if (isUncertain(weight)) return "normal";
    const w = weight.toLowerCase();
    if (w.includes("bold") || w.includes("700") || w.includes("black")) return "700";
    if (w.includes("semibold") || w.includes("600")) return "600";
    if (w.includes("medium") || w.includes("500")) return "500";
    if (w.includes("light") || w.includes("300")) return "300";
    return "400";
  };

  const parseFontFamily = (category: string) => {
    if (isUncertain(category)) return "sans-serif";
    const cat = category.toLowerCase();
    if (cat.includes("mono")) return "monospace";
    if (cat.includes("serif") && !cat.includes("sans")) return "serif";
    return "sans-serif";
  };

  return (
    <div 
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-900" : "bg-[#0a0a0a] border-white/5 text-white"
      }`} 
      id="typography-tokens-section"
    >
      <div className="bg-[#013E37] text-[#FFEFB3] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#FFEFB3]/10 mb-6 shadow-md" id="typography-header-banner">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950/40 rounded-lg border border-[#FFEFB3]/20 flex items-center justify-center flex-shrink-0">
            <Type className="w-5 h-5 text-[#FFEFB3]" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-0.5 flex items-center gap-1.5 text-[#FFEFB3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3]"></span> Typography Hierarchy
            </h3>
            <p className="text-[11px] text-[#FFEFB3]/80">Extracted font styles, estimated sizes, and weights.</p>
          </div>
        </div>

        {/* Live Sandbox Input */}
        <div className="flex-shrink-0">
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value || "Design System")}
            placeholder="Type custom preview text..."
            className="w-full sm:w-48 text-xs rounded-lg px-3 py-1.5 outline-none transition-all bg-emerald-950/60 text-[#FFEFB3] border border-[#FFEFB3]/20 placeholder-[#FFEFB3]/40 focus:border-[#FFEFB3]/40 focus:ring-1 focus:ring-[#FFEFB3]/30"
            title="Type here to update the live preview text below"
          />
        </div>
      </div>

      <div className="space-y-4">
        {typography.map((token, idx) => {
          const styleUncertain = isUncertain(token.style);
          const sizeUncertain = isUncertain(token.size);
          const weightUncertain = isUncertain(token.weight);
          const fontCatUncertain = isUncertain(token.font_category);

          const cssSize = parseSize(token.size);
          const cssWeight = parseWeight(token.weight);
          const cssFamily = parseFontFamily(token.font_category);

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                styleUncertain
                  ? isLight
                    ? "bg-neutral-50/50 border-dashed border-neutral-300 opacity-60"
                    : "bg-white/[0.01] border-dashed border-white/10 opacity-60"
                  : isLight
                    ? "bg-neutral-50/30 border-neutral-200/80 hover:border-neutral-300"
                    : "bg-black/40 border-white/5 hover:border-white/10"
              }`}
            >
              {/* Left Side: Preview of the font styling */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
                      styleUncertain 
                        ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" 
                        : isLight ? "text-neutral-400" : "text-white/40"
                    }`}
                  >
                    {styleUncertain ? "uncertain style" : token.style}
                  </span>
                  {styleUncertain && (
                    <span className={`text-[9px] border px-1.5 py-0.5 rounded font-mono ${
                      isLight ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "bg-white/5 text-white/30 border-white/5"
                    }`}>
                      UNCERTAIN
                    </span>
                  )}
                </div>

                {/* Dynamically Styled Render Node */}
                <div
                  className={`break-words tracking-tight ${
                    styleUncertain 
                      ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" 
                      : isLight ? "text-neutral-900" : "text-white"
                  }`}
                  style={{
                    fontSize: cssSize,
                    fontWeight: cssWeight,
                    fontFamily: cssFamily,
                    lineHeight: "1.4",
                  }}
                >
                  {previewText}
                </div>
              </div>

              {/* Right Side: Technical Token details */}
              <div className={`flex-shrink-0 p-3 rounded-xl border w-full md:w-56 font-mono text-xs space-y-1.5 ${
                isLight ? "bg-neutral-50 border-neutral-200 text-neutral-600" : "bg-black border-white/5 text-white/60"
              }`}>
                <div className="flex justify-between">
                  <span className={isLight ? "text-neutral-400" : "text-white/30"}>style:</span>
                  <span className={styleUncertain ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" : isLight ? "text-neutral-800 font-bold" : "text-white/80"}>
                    {token.style}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? "text-neutral-400" : "text-white/30"}>size:</span>
                  <span className={sizeUncertain ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" : "text-blue-500 font-bold"}>
                    {token.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? "text-neutral-400" : "text-white/30"}>weight:</span>
                  <span className={weightUncertain ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" : isLight ? "text-neutral-800" : "text-white/80"}>
                    {token.weight}
                  </span>
                </div>
                <div className={`flex justify-between pt-1 border-t ${isLight ? "border-neutral-200" : "border-white/5"}`}>
                  <span className={isLight ? "text-neutral-400" : "text-white/30"}>category:</span>
                  <span
                    className={`text-[10px] truncate max-w-[120px] ${
                      fontCatUncertain ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" : isLight ? "text-neutral-800" : "text-white/80"
                    }`}
                    title={token.font_category}
                  >
                    {token.font_category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-4 flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider rounded-xl border ${
        isLight ? "text-neutral-600 bg-neutral-100/75 border-neutral-200" : "text-white/40 bg-black/20 border-white/5"
      }`}>
        <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
        <span>Pre-rendered fonts are modeled using standard fallbacks if specific licenses are unresolvable.</span>
      </div>
    </div>
  );
}
