import { Box, Code, HelpCircle } from "lucide-react";
import { ComponentToken } from "../types";

interface ComponentsTokensProps {
  components: ComponentToken[];
  theme?: "dark" | "light";
}

export default function ComponentsTokens({ components, theme = "dark" }: ComponentsTokensProps) {
  const isLight = theme === "light";

  const isUncertain = (val: string) => {
    return !val || val.toLowerCase().includes("uncertain");
  };

  // Dynamically render a simulated widget conforming to extracted properties
  const renderSimulatedWidget = (component: ComponentToken) => {
    const radiusLower = component.border_radius.toLowerCase();
    const fillLower = component.fill_style.toLowerCase();

    if (isUncertain(component.border_radius) || isUncertain(component.fill_style)) {
      return (
        <div className={`flex items-center justify-center p-6 rounded-xl border border-dashed h-24 ${
          isLight ? "bg-neutral-50/50 border-neutral-200" : "bg-black/80 border-white/10"
        }`}>
          <div className="flex flex-col items-center gap-1">
            <HelpCircle className={`w-5 h-5 ${isLight ? "text-neutral-300" : "text-white/10"}`} />
            <span className={`text-[9px] font-mono tracking-wider uppercase ${isLight ? "text-neutral-400" : "text-white/20"}`}>Uncertain Properties</span>
          </div>
        </div>
      );
    }

    // Determine rounding
    let roundedClass = "rounded-lg";
    if (radiusLower.includes("sharp") || radiusLower.includes("0px") || radiusLower.includes("none")) {
      roundedClass = "rounded-none";
    } else if (radiusLower.includes("pill") || radiusLower.includes("full") || radiusLower.includes("9999px")) {
      roundedClass = "rounded-full";
    } else if (radiusLower.includes("12px") || radiusLower.includes("16px") || radiusLower.includes("double")) {
      roundedClass = "rounded-2xl";
    } else if (radiusLower.includes("4px") || radiusLower.includes("tight")) {
      roundedClass = "rounded-md";
    }

    // Determine type (button vs input vs card/generic)
    const nameLower = component.name.toLowerCase();
    const isButton = nameLower.includes("button") || nameLower.includes("cta") || nameLower.includes("trigger");
    const isInput = nameLower.includes("input") || nameLower.includes("search") || nameLower.includes("field");

    // Determine fill, border, outline
    let styleClass = "bg-blue-600 text-white";
    if (fillLower.includes("outline") || fillLower.includes("border") || fillLower.includes("stroke")) {
      styleClass = isLight 
        ? "bg-transparent border border-blue-600 text-blue-600" 
        : "bg-transparent border border-blue-500 text-blue-400";
    } else if (fillLower.includes("ghost") || fillLower.includes("transparent")) {
      styleClass = isLight
        ? "bg-transparent text-neutral-700 hover:bg-neutral-100"
        : "bg-transparent text-white/70 hover:bg-white/5";
    }

    if (isButton) {
      return (
        <div className={`flex items-center justify-center p-6 rounded-xl border h-24 ${
          isLight ? "bg-neutral-50/30 border-neutral-200/60" : "bg-black/80 border-white/5"
        }`}>
          <button 
            className={`px-4 py-2 text-xs font-semibold ${styleClass} ${roundedClass} transition-all active:scale-95`}
            style={{ pointerEvents: "none" }}
          >
            Action Button
          </button>
        </div>
      );
    }

    if (isInput) {
      return (
        <div className={`flex items-center justify-center p-6 rounded-xl border h-24 ${
          isLight ? "bg-neutral-50/30 border-neutral-200/60" : "bg-black/80 border-white/5"
        }`}>
          <input 
            type="text" 
            placeholder="Search input..."
            className={`px-3 py-1.5 text-xs w-full max-w-[150px] outline-none border ${
              isLight 
                ? "bg-white border-neutral-300 text-neutral-900" 
                : "bg-black border-white/10 text-white"
            } ${roundedClass}`}
            disabled
          />
        </div>
      );
    }

    // Default container/card mock
    const containerBg = (fillLower.includes("outline") || fillLower.includes("border"))
      ? isLight ? "bg-transparent border border-blue-600/30" : "bg-transparent border border-blue-500/30"
      : isLight ? "bg-blue-50 border border-blue-100" : "bg-blue-950/10 border border-blue-500/20";

    return (
      <div className={`flex items-center justify-center p-6 rounded-xl border h-24 ${
        isLight ? "bg-neutral-50/30 border-neutral-200/60" : "bg-black/80 border-white/5"
      }`}>
        <div className={`w-20 h-10 flex items-center justify-center ${containerBg} ${roundedClass}`}>
          <div className="w-8 h-1.5 bg-blue-500/30 rounded-full"></div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-900" : "bg-[#0a0a0a] border-white/5 text-white"
      }`} 
      id="components-tokens-section"
    >
      <div className="bg-[#013E37] text-[#FFEFB3] p-4 rounded-xl flex items-center gap-3 border border-[#FFEFB3]/10 mb-6 shadow-md" id="components-header-banner">
        <div className="p-2 bg-emerald-950/40 rounded-lg border border-[#FFEFB3]/20 flex items-center justify-center flex-shrink-0">
          <Box className="w-5 h-5 text-[#FFEFB3]" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-0.5 flex items-center gap-1.5 text-[#FFEFB3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3]"></span> Component Catalog
          </h3>
          <p className="text-[11px] text-[#FFEFB3]/80">Identified widgets, interactive nodes, and structural boundaries.</p>
        </div>
      </div>

      <div className="space-y-4">
        {components.map((component, idx) => {
          const nameUncertain = isUncertain(component.name);
          const radiusUncertain = isUncertain(component.border_radius);
          const fillUncertain = isUncertain(component.fill_style);

          return (
            <div 
              key={idx} 
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border transition-all ${
                nameUncertain
                  ? isLight
                    ? "bg-neutral-50/50 border-dashed border-neutral-300 opacity-60"
                    : "bg-white/[0.01] border-dashed border-white/10 opacity-60"
                  : isLight
                    ? "bg-neutral-50/30 border-neutral-200/80 hover:border-neutral-300"
                    : "bg-black/30 border-white/5 hover:border-white/10"
              }`}
            >
              {/* Component Metadata */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-sm font-bold ${
                      nameUncertain 
                        ? isLight ? "text-neutral-400 italic" : "text-white/30 italic" 
                        : isLight ? "text-neutral-800" : "text-white/95"
                    }`}>
                      {nameUncertain ? "uncertain component" : component.name}
                    </h4>
                    {nameUncertain && (
                      <span className={`text-[9px] border px-1.5 py-0.5 rounded font-mono ${
                        isLight ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "bg-white/5 text-white/30 border-white/5"
                      }`}>
                        UNCERTAIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Traits Parameters */}
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-mono flex items-center gap-1 uppercase tracking-wider ${
                    isLight ? "text-neutral-400" : "text-white/30"
                  }`}>
                    <Code className="w-3 h-3" /> Parameters:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <div className="flex flex-col gap-1">
                      <div className={`text-[9px] uppercase tracking-wider font-mono ${
                        isLight ? "text-neutral-400" : "text-white/20"
                      }`}>Border Radius</div>
                      <span 
                        className={`text-[10px] font-mono border px-2.5 py-1 rounded-md ${
                          radiusUncertain 
                            ? isLight ? "text-neutral-400 italic border-dashed border-neutral-200 bg-neutral-100" : "text-white/20 italic border-dashed border-white/10 bg-black"
                            : isLight ? "text-neutral-700 bg-neutral-100 border-neutral-200" : "text-white/60 border-white/5 bg-black"
                        }`}
                      >
                        {component.border_radius}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className={`text-[9px] uppercase tracking-wider font-mono ${
                        isLight ? "text-neutral-400" : "text-white/20"
                      }`}>Fill & Outline Style</div>
                      <span 
                        className={`text-[10px] font-mono border px-2.5 py-1 rounded-md ${
                          fillUncertain 
                            ? isLight ? "text-neutral-400 italic border-dashed border-neutral-200 bg-neutral-100" : "text-white/20 italic border-dashed border-white/10 bg-black"
                            : isLight ? "text-neutral-700 bg-neutral-100 border-neutral-200" : "text-white/60 border-white/5 bg-black"
                        }`}
                      >
                        {component.fill_style}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Interactive Preview Canvas */}
              <div className="flex flex-col justify-center">
                {renderSimulatedWidget(component)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
