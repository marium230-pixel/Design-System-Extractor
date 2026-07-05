import { useState } from "react";
import { DesignSystem } from "../types";
import { Copy, Check, FileCode, Info } from "lucide-react";

interface CssVariablesExportProps {
  data: DesignSystem;
  theme?: "dark" | "light";
}

export default function CssVariablesExport({ data, theme = "dark" }: CssVariablesExportProps) {
  const [copied, setCopied] = useState(false);
  const isLight = theme === "light";

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const generateCssVariables = (ds: DesignSystem) => {
    const colorsList = ds.colors
      .map((c) => {
        const slug = slugify(c.role);
        return `  --color-${slug || "color"}: ${c.hex};`;
      })
      .join("\n");

    const typographyList = ds.typography
      .map((t) => {
        const slug = slugify(t.style);
        return `  --font-${slug}-size: ${t.size};\n  --font-${slug}-weight: ${t.weight};`;
      })
      .join("\n");

    const spacingBase = ds.spacing?.base_unit
      ? `  --spacing-base-unit: ${ds.spacing.base_unit};`
      : "  --spacing-base-unit: 8px;";

    return `:root {
  /* Colors */
${colorsList}

  /* Typography */
${typographyList}

  /* Spacing */
${spacingBase}
}`;
  };

  const cssString = generateCssVariables(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(cssString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`border rounded-2xl p-6 transition-all duration-300 ${
        isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-900" : "bg-[#0a0a0a] border-white/5 text-white"
      }`} 
      id="css-variables-panel"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isLight ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
          }`}>
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest mb-0.5 flex items-center gap-1.5 ${
              isLight ? "text-blue-600" : "text-blue-400/80"
            }`}>
              <span className={`w-1 h-1 rounded-full ${isLight ? "bg-blue-600" : "bg-blue-400"}`}></span> CSS Variables Export
            </h3>
            <p className={`text-xs ${isLight ? "text-neutral-500" : "text-white/40"}`}>Convert extracted tokens into standard CSS :root custom properties.</p>
          </div>
        </div>

        <div>
          {/* Copy CSS Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold font-mono transition-all shadow-md shadow-blue-600/10"
            title="Copy CSS block to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy CSS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Styled Pre Code Block */}
      <div className={`relative rounded-lg border overflow-hidden ${
        isLight ? "bg-neutral-50 border-neutral-200" : "bg-black border-white/5"
      }`}>
        <div className={`absolute top-2 right-2 text-[10px] font-mono font-semibold uppercase select-none ${
          isLight ? "text-neutral-400" : "text-white/30"
        }`}>
          css :root
        </div>
        <pre className={`p-4 overflow-x-auto max-h-[400px] text-xs font-mono leading-relaxed scrollbar-thin ${
          isLight ? "text-emerald-700" : "text-emerald-400"
        }`}>
          <code>{cssString}</code>
        </pre>
      </div>

      <div className={`mt-4 flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider rounded-xl border ${
        isLight ? "text-neutral-600 bg-neutral-100/75 border-neutral-200" : "text-white/40 bg-black/20 border-white/5"
      }`}>
        <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        <span>Generated properties are slugified dynamically to maintain W3C syntax standards.</span>
      </div>
    </div>
  );
}
