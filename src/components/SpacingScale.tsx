import { Ruler, Info, HelpCircle } from "lucide-react";
import { SpacingToken } from "../types";

interface SpacingScaleProps {
  spacing: SpacingToken;
  theme?: "dark" | "light";
}

export default function SpacingScale({ spacing, theme = "dark" }: SpacingScaleProps) {
  const isLight = theme === "light";

  const isUncertain = (val: string) => {
    return !val || val.toLowerCase().includes("uncertain");
  };

  const baseUncertain = isUncertain(spacing.base_unit);
  const paddingUncertain = isUncertain(spacing.padding_pattern);
  const gridUncertain = isUncertain(spacing.grid_notes);

  // Helper to extract numeric pixel values from string like "8px" or "4px" for gauge simulation
  const getPixelSize = (val: string) => {
    if (isUncertain(val)) return 0;
    const match = val.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 8;
  };

  const pixelSize = getPixelSize(spacing.base_unit);
  // Calculate relative widths for display gauge (e.g., scale 1px to 4px of visual space)
  const visualWidth = Math.min(Math.max(pixelSize * 4, 4), 200);

  return (
    <div 
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-900" : "bg-[#0a0a0a] border-white/5 text-white"
      }`} 
      id="spacing-tokens-section"
    >
      <div className="bg-[#013E37] text-[#FFEFB3] p-4 rounded-xl flex items-center gap-3 border border-[#FFEFB3]/10 mb-6 shadow-md" id="spacing-header-banner">
        <div className="p-2 bg-emerald-950/40 rounded-lg border border-[#FFEFB3]/20 flex items-center justify-center flex-shrink-0">
          <Ruler className="w-5 h-5 text-[#FFEFB3]" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-0.5 flex items-center gap-1.5 text-[#FFEFB3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3]"></span> Spacing Scale
          </h3>
          <p className="text-[11px] text-[#FFEFB3]/80">Estimated gaps, padding variables, and layout guidelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Module 1: Base Unit */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          baseUncertain 
            ? isLight
              ? "bg-neutral-50/50 border-dashed border-neutral-300 opacity-60"
              : "bg-white/[0.01] border-dashed border-white/10 opacity-60" 
            : isLight
              ? "bg-neutral-50/30 border-neutral-200/80"
              : "bg-black/40 border-white/5"
        }`}>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                isLight ? "text-neutral-400" : "text-white/30"
              }`}>Base Unit Grid</span>
              {baseUncertain && (
                <span className={`text-[9px] border px-1.5 py-0.5 rounded font-mono ${
                  isLight ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "bg-white/5 text-white/30 border-white/5"
                }`}>
                  UNCERTAIN
                </span>
              )}
            </div>
            <h4 className={`text-lg font-black font-mono tracking-tight ${
              baseUncertain 
                ? isLight ? "text-neutral-300 italic" : "text-white/20 italic" 
                : "text-blue-500"
            }`}>
              {spacing.base_unit}
            </h4>
            <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-neutral-500" : "text-white/40"}`}>
              Incremental multiplier value inferred across layout components.
            </p>
          </div>

          {/* Visual Gauge */}
          <div className={`mt-4 pt-4 border-t ${isLight ? "border-neutral-200" : "border-white/5"}`}>
            {baseUncertain ? (
              <div className={`h-6 rounded-lg border flex items-center justify-center text-[10px] font-mono uppercase ${
                isLight ? "bg-neutral-100 border-neutral-200 text-neutral-400" : "bg-black/60 border-white/5 text-white/20"
              }`}>
                Gauge unavailable
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono ${isLight ? "text-neutral-400" : "text-white/30"}`}>
                  {pixelSize}px gauge
                </span>
                <div className={`relative h-6 rounded-lg border flex items-center px-2 flex-1 max-w-[140px] justify-end ${
                  isLight ? "bg-neutral-100 border-neutral-200" : "bg-black/60 border-white/5"
                }`}>
                  <div 
                    className="h-2.5 bg-blue-500/60 hover:bg-blue-500 rounded transition-colors"
                    style={{ width: `${visualWidth}px` }}
                    title={`Spacer block represents ${pixelSize}px relative scaling`}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: Padding Patterns */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          paddingUncertain 
            ? isLight
              ? "bg-neutral-50/50 border-dashed border-neutral-300 opacity-60"
              : "bg-white/[0.01] border-dashed border-white/10 opacity-60" 
            : isLight
              ? "bg-neutral-50/30 border-neutral-200/80"
              : "bg-black/40 border-white/5"
        }`}>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                isLight ? "text-neutral-400" : "text-white/30"
              }`}>Padding Patterns</span>
              {paddingUncertain && (
                <span className={`text-[9px] border px-1.5 py-0.5 rounded font-mono ${
                  isLight ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "bg-white/5 text-white/30 border-white/5"
                }`}>
                  UNCERTAIN
                </span>
              )}
            </div>
            <h4 className={`text-base font-bold capitalize ${
              paddingUncertain 
                ? isLight ? "text-neutral-300 italic" : "text-white/20 italic" 
                : isLight ? "text-neutral-800" : "text-white"
            }`}>
              {spacing.padding_pattern}
            </h4>
            <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-neutral-500" : "text-white/40"}`}>
              Standard margin depths embedded inside modular cards and clickable buttons.
            </p>
          </div>

          {/* Visual Padding Simulation */}
          <div className={`mt-4 pt-4 border-t flex justify-center ${isLight ? "border-neutral-200" : "border-white/5"}`}>
            {paddingUncertain ? (
              <div className={`w-full h-10 rounded-lg border flex items-center justify-center text-[10px] font-mono uppercase ${
                isLight ? "bg-neutral-100 border-neutral-200 text-neutral-400" : "bg-black/60 border-white/5 text-white/20"
              }`}>
                Preview unavailable
              </div>
            ) : (
              <div className={`w-full h-10 rounded-lg border flex items-center justify-center relative p-1 overflow-hidden ${
                isLight ? "bg-neutral-100/50 border-neutral-200" : "bg-black/40 border-white/5"
              }`}>
                <div className={`w-full h-full bg-blue-500/10 border border-dashed border-blue-500/30 flex items-center justify-center rounded-md ${
                  spacing.padding_pattern.toLowerCase().includes("generous") ? "p-3" :
                  spacing.padding_pattern.toLowerCase().includes("tight") ? "p-1" : "p-2"
                }`}>
                  <div className="w-full h-full bg-blue-500/30 rounded"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 3: Grid Notes */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          gridUncertain 
            ? isLight
              ? "bg-neutral-50/50 border-dashed border-neutral-300 opacity-60"
              : "bg-white/[0.01] border-dashed border-white/10 opacity-60" 
            : isLight
              ? "bg-neutral-50/30 border-neutral-200/80"
              : "bg-black/40 border-white/5"
        }`}>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                isLight ? "text-neutral-400" : "text-white/30"
              }`}>Layout Grid Notes</span>
              {gridUncertain && (
                <span className={`text-[9px] border px-1.5 py-0.5 rounded font-mono ${
                  isLight ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "bg-white/5 text-white/30 border-white/5"
                }`}>
                  UNCERTAIN
                </span>
              )}
            </div>
            <p className={`text-xs leading-relaxed ${
              gridUncertain 
                ? isLight ? "text-neutral-400 italic" : "text-white/20 italic" 
                : isLight ? "text-neutral-700" : "text-white/80"
            }`}>
              {spacing.grid_notes}
            </p>
          </div>

          {/* Visual Grid Lines Simulation */}
          <div className={`mt-4 pt-4 border-t ${isLight ? "border-neutral-200" : "border-white/5"}`}>
            {gridUncertain ? (
              <div className={`h-6 rounded-lg border flex items-center justify-center text-[10px] font-mono uppercase ${
                isLight ? "bg-neutral-100 border-neutral-200 text-neutral-400" : "bg-black/60 border-white/5 text-white/20"
              }`}>
                Grid unavailable
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 h-6">
                <div className={`border border-dashed rounded ${isLight ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-500/10 border-blue-500/20"}`}></div>
                <div className={`border border-dashed rounded ${isLight ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-500/10 border-blue-500/20"}`}></div>
                <div className={`border border-dashed rounded ${isLight ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-500/10 border-blue-500/20"}`}></div>
                <div className={`border border-dashed rounded ${isLight ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-500/10 border-blue-500/20"}`}></div>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className={`mt-4 flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider rounded-xl border ${
        isLight ? "text-neutral-600 bg-neutral-100/75 border-neutral-200" : "text-white/40 bg-black/20 border-white/5"
      }`}>
        <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
        <span>Layout ratios are measured across horizontal margins and vertical grid gutters.</span>
      </div>
    </div>
  );
}
