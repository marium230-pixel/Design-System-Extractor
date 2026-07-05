import { useState } from "react";
import { ColorToken } from "../types";
import { Copy, Check, Palette, HelpCircle } from "lucide-react";

interface ColorPaletteProps {
  colors: ColorToken[];
  theme?: "dark" | "light";
}

export default function ColorPalette({ colors, theme = "dark" }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isLight = theme === "light";

  const copyToClipboard = (text: string, idx: number) => {
    if (text.toLowerCase() === "uncertain") return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const isUncertain = (val: string) => {
    return !val || val.toLowerCase().includes("uncertain");
  };

  return (
    <div 
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-900" : "bg-[#0a0a0a] border-white/5 text-white"
      }`} 
      id="colors-tokens-section"
    >
      <div className="bg-[#013E37] text-[#FFEFB3] p-4 rounded-xl flex items-center gap-3 border border-[#FFEFB3]/10 mb-6 shadow-md" id="colors-header-banner">
        <div className="p-2 bg-emerald-950/40 rounded-lg border border-[#FFEFB3]/20 flex items-center justify-center flex-shrink-0">
          <Palette className="w-5 h-5 text-[#FFEFB3]" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-0.5 flex items-center gap-1.5 text-[#FFEFB3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3]"></span> Color Palette
          </h3>
          <p className="text-[11px] text-[#FFEFB3]/80">Extracted color swatches with hex values and system roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colors.map((color, idx) => {
          const hexUncertain = isUncertain(color.hex);
          const roleUncertain = isUncertain(color.role);
          const notesUncertain = isUncertain(color.notes);

          return (
            <div
              key={idx}
              onClick={() => copyToClipboard(color.hex, idx)}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all relative ${
                hexUncertain
                  ? isLight
                    ? "bg-neutral-50/50 border-dashed border-neutral-300 opacity-60 cursor-not-allowed"
                    : "bg-white/[0.01] border-dashed border-white/10 opacity-60 cursor-not-allowed"
                  : isLight
                    ? "bg-neutral-50/50 hover:bg-neutral-100/70 border-neutral-200/80 hover:border-neutral-300 cursor-pointer group"
                    : "bg-black hover:bg-white/5 border-white/5 hover:border-white/10 cursor-pointer group"
              }`}
              title={hexUncertain ? "Uncertain color value" : `Click to copy ${color.hex}`}
            >
              {/* Visual Swatch */}
              {hexUncertain ? (
                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                  isLight ? "bg-neutral-100 border-neutral-200 text-neutral-400" : "bg-neutral-900 border-white/10 text-white/30"
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-lg shadow-inner border border-black/10 flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              {/* Metadata */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold font-mono tracking-wide ${
                      hexUncertain 
                        ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" 
                        : isLight ? "text-neutral-800" : "text-white"
                    }`}
                  >
                    {hexUncertain ? "uncertain" : color.hex}
                  </span>
                  {hexUncertain && (
                    <span className={`text-[9px] border px-1.5 py-0.5 rounded font-mono ${
                      isLight ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "bg-white/5 text-white/30 border-white/5"
                    }`}>
                      UNCERTAIN
                    </span>
                  )}
                </div>

                <div
                  className={`text-xs mt-1 truncate font-medium ${
                    roleUncertain 
                      ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" 
                      : isLight ? "text-neutral-600" : "text-white/70"
                  }`}
                >
                  {color.role}
                </div>

                {color.notes && !notesUncertain && (
                  <div className={`text-[10px] mt-0.5 leading-relaxed truncate ${
                    isLight ? "text-neutral-400" : "text-white/40"
                  }`}>
                    {color.notes}
                  </div>
                )}
                {notesUncertain && color.notes && (
                  <div className={`text-[10px] italic mt-0.5 leading-relaxed truncate ${
                    isLight ? "text-neutral-400/60" : "text-white/20"
                  }`}>
                    {color.notes}
                  </div>
                )}
              </div>

              {/* Copy Indicator */}
              {!hexUncertain && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className={`w-4 h-4 ${isLight ? "text-neutral-400 hover:text-neutral-700" : "text-white/30 hover:text-white"}`} />
                  )}
                </div>
              )}

              {copiedIndex === idx && (
                <span className={`absolute right-3 top-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border animate-pulse ${
                  isLight 
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200" 
                    : "text-emerald-400 bg-emerald-950/40 border-emerald-500/20"
                }`}>
                  Copied!
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
