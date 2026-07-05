import { useState } from "react";
import { DesignSystem } from "../types";
import { FileJson, Copy, Check, Download } from "lucide-react";

interface RawJsonExportProps {
  data: DesignSystem;
  onSwitchTab?: (tab: string) => void;
  theme?: "dark" | "light";
}

export default function RawJsonExport({ data, onSwitchTab, theme = "dark" }: RawJsonExportProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedFigma, setCopiedFigma] = useState(false);
  const isLight = theme === "light";

  const jsonString = JSON.stringify(data, null, 2);

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCss = () => {
    const colorsList = data.colors
      .map((c) => {
        const slug = slugify(c.role);
        return `  --color-${slug || "color"}: ${c.hex};`;
      })
      .join("\n");

    const typographyList = data.typography
      .map((t) => {
        const slug = slugify(t.style);
        return `  --font-${slug}-size: ${t.size};\n  --font-${slug}-weight: ${t.weight};`;
      })
      .join("\n");

    const spacingBase = data.spacing?.base_unit
      ? `  --spacing-base-unit: ${data.spacing.base_unit};`
      : "  --spacing-base-unit: 8px;";

    const cssString = `:root {
  /* Colors */
${colorsList}

  /* Typography */
${typographyList}

  /* Spacing */
${spacingBase}
}`;

    navigator.clipboard.writeText(cssString);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
    if (onSwitchTab) {
      onSwitchTab("css");
    }
  };

  const handleExportFigma = () => {
    const colorObj: Record<string, any> = {};
    data.colors.forEach((c) => {
      const slug = slugify(c.role);
      colorObj[slug || "color"] = {
        $value: c.hex,
        $type: "color",
      };
    });

    const typographyObj: Record<string, any> = {};
    data.typography.forEach((t) => {
      const slug = slugify(t.style);
      typographyObj[slug || "typography"] = {
        $value: {
          fontSize: t.size,
          fontWeight: t.weight,
        },
        $type: "typography",
      };
    });

    const spacingObj: Record<string, any> = {
      base: {
        $value: data.spacing?.base_unit || "8px",
        $type: "dimension",
      },
    };

    const figmaFormat = {
      color: colorObj,
      typography: typographyObj,
      spacing: spacingObj,
    };

    const figmaString = JSON.stringify(figmaFormat, null, 2);
    navigator.clipboard.writeText(figmaString);
    setCopiedFigma(true);
    setTimeout(() => setCopiedFigma(false), 2000);
    if (onSwitchTab) {
      onSwitchTab("figma");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Find a primary color or some attribute as part of the slug if possible, or fallback
    const fallbackName = data.colors?.[0]?.hex || "design-tokens";
    const slug = fallbackName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
      
    link.href = url;
    link.download = `extracted-tokens-${slug}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-900" : "bg-[#0a0a0a] border-white/5 text-white"
      }`} 
      id="raw-json-panel"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isLight ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
          }`}>
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest mb-0.5 flex items-center gap-1.5 ${
              isLight ? "text-blue-600" : "text-blue-400/80"
            }`}>
              <span className={`w-1 h-1 rounded-full ${isLight ? "bg-blue-600" : "bg-blue-400"}`}></span> Raw Token Dictionary
            </h3>
            <p className={`text-xs ${isLight ? "text-neutral-500" : "text-white/40"}`}>Export the generated tokens as standard design token schema.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono transition-all ${
              isLight 
                ? "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:text-neutral-900" 
                : "bg-black hover:bg-white/5 border-white/5 text-white/80 hover:text-white hover:border-white/10"
            }`}
            title="Copy JSON string to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className={`w-3.5 h-3.5 ${isLight ? "text-neutral-400" : "text-white/40"}`} />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          {/* Export to CSS Variables */}
          <button
            onClick={handleExportCss}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono transition-all ${
              isLight 
                ? "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:text-neutral-900" 
                : "bg-black hover:bg-white/5 border-white/5 text-white/80 hover:text-white hover:border-white/10"
            }`}
            title="Convert to CSS root properties and copy"
          >
            {copiedCss ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">CSS Copied!</span>
              </>
            ) : (
              <>
                <Copy className={`w-3.5 h-3.5 ${isLight ? "text-neutral-400" : "text-white/40"}`} />
                <span>Export to CSS Variables</span>
              </>
            )}
          </button>

          {/* Copy for Figma */}
          <button
            onClick={handleExportFigma}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono transition-all ${
              isLight 
                ? "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:text-neutral-900" 
                : "bg-black hover:bg-white/5 border-white/5 text-white/80 hover:text-white hover:border-white/10"
            }`}
            title="Convert to W3C Design Token format for Figma and copy"
          >
            {copiedFigma ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold font-mono">Figma Copied!</span>
              </>
            ) : (
              <>
                <Copy className={`w-3.5 h-3.5 ${isLight ? "text-neutral-400" : "text-white/40"}`} />
                <span>Copy for Figma</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold font-mono transition-all shadow-md shadow-blue-600/10"
            title="Download JSON token dictionary file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Structured Code Block Panel */}
      <div className={`relative rounded-lg border overflow-hidden ${
        isLight ? "bg-neutral-50 border-neutral-200" : "bg-black border-white/5"
      }`}>
        <div className={`absolute top-2 right-2 text-[10px] font-mono font-semibold uppercase select-none ${
          isLight ? "text-neutral-400" : "text-white/30"
        }`}>
          JSON Schema
        </div>
        <pre className={`p-4 overflow-x-auto max-h-[400px] text-xs font-mono leading-relaxed scrollbar-thin ${
          isLight ? "text-blue-700" : "text-blue-300"
        }`}>
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
}
