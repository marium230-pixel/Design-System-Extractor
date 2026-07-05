import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Image as ImageIcon, 
  RefreshCw, 
  FileCode, 
  Layers, 
  Palette, 
  Type, 
  Box, 
  Ruler, 
  AlertCircle, 
  Play,
  HelpCircle,
  FolderOpen,
  Sun,
  Moon
} from "lucide-react";
import { PRESETS } from "./data/presets";
import { DesignSystem } from "./types";
import VisualDropzone from "./components/VisualDropzone";
import StepProgress from "./components/StepProgress";
import ColorPalette from "./components/ColorPalette";
import TypographyScale from "./components/TypographyScale";
import ComponentsTokens from "./components/ComponentsTokens";
import SpacingScale from "./components/SpacingScale";
import RawJsonExport from "./components/RawJsonExport";
import CssVariablesExport from "./components/CssVariablesExport";
import FigmaTokensExport from "./components/FigmaTokensExport";
import ReviewSection from "./components/ReviewSection";

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedTokens, setExtractedTokens] = useState<DesignSystem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activePresetId, setActivePresetId] = useState<string | null>("cosmic-dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Load the first preset by default to make the app immediate and interactive
  useEffect(() => {
    const defaultPreset = PRESETS.find(p => p.id === "cosmic-dashboard");
    if (defaultPreset) {
      setSelectedImage(defaultPreset.thumbnail);
      setExtractedTokens(defaultPreset.data);
    }
  }, []);

  // Handle preset selection
  const handleSelectPreset = (presetId: string) => {
    if (isLoading) return;
    setError(null);
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setActivePresetId(preset.id);
      setSelectedImage(preset.thumbnail);
      setExtractedTokens(preset.data);
    }
  };

  // Process user uploaded image through server-side Gemini Vision
  const handleImageUpload = async (base64Image: string, mimeType: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setActivePresetId(null);
    setSelectedImage(base64Image);
    setExtractedTokens(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: mimeType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: DesignSystem = await response.json();
      setExtractedTokens(data);
    } catch (err: any) {
      console.error("[Extraction Failure]:", err);
      setError(err?.message || "Failed to parse screenshot and extract design system tokens. Please ensure your Gemini API key is valid.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setExtractedTokens(null);
    setError(null);
    setActivePresetId(null);
  };

  const isLight = theme === "light";

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${
      isLight ? "bg-neutral-50 text-neutral-800" : "bg-[#050505] text-[#e5e5e5]"
    }`} id="app-root">
      
      {/* Immersive UI Sleek Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-[#FFEFB3]/10 bg-[#013E37] text-[#FFEFB3] sticky top-0 z-40 shadow-md" id="main-header">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFEFB3] flex items-center justify-center shadow-lg shadow-[#013E37]/20 flex-shrink-0">
            <Layers className="w-5 h-5 text-[#013E37]" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-tight flex items-center gap-2 text-[#FFEFB3]">
              Design System Extractor
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#FFEFB3]/70">
              AI-Powered Visual Tokenization
            </p>
          </div>
        </div>

        {/* Global Action Badges */}
        <div className="flex items-center gap-4">
          {selectedImage && (
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-[#FFEFB3]/80 hover:text-[#FFEFB3] disabled:text-[#FFEFB3]/30 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}

          {/* Sun / Moon Theme Toggle */}
          <button
            onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
            className="p-2 rounded-xl border border-[#FFEFB3]/20 bg-emerald-950/40 hover:bg-[#013E37] hover:border-[#FFEFB3]/40 text-[#FFEFB3] transition-all duration-300 flex items-center justify-center"
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            id="theme-toggle-button"
          >
            {isLight ? <Moon className="w-4 h-4 text-[#FFEFB3]" /> : <Sun className="w-4 h-4 text-[#FFEFB3]" />}
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono px-3 py-1 rounded-full border bg-[#FFEFB3]/10 text-[#FFEFB3] border-[#FFEFB3]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3] animate-pulse"></span>
            <span>Gemini 3.5 Flash</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6" id="bento-grid">
        
        {/* LEFT PANEL: UPLOAD / SCREENSHOT (Col span: 5) */}
        <section className="lg:col-span-5 flex flex-col gap-6" id="left-workspace-panel">
          
          {/* UPLOADER / WORKSPACE CARD */}
          <div className={`transition-all duration-300 border rounded-2xl overflow-hidden ${
            isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-800" : "bg-[#0a0a0a] border-white/5 shadow-2xl"
          }`} id="image-viewer-card">
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isLight ? "border-neutral-200 bg-neutral-50/50" : "border-white/5 bg-[#080808]/50"
            }`}>
              <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                isLight ? "text-neutral-400" : "text-white/30"
              }`}>
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                Source Analysis
              </span>
              <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border font-bold ${
                extractedTokens 
                  ? isLight ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : isLight ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "bg-white/5 text-white/30 border-white/5"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${extractedTokens ? "bg-emerald-500" : "bg-neutral-400"}`}></span>
                {extractedTokens ? "100% COMPLETE" : "AWAITING SOURCE"}
              </span>
            </div>

            <div className="p-6">
              {!selectedImage ? (
                <VisualDropzone onImageSelected={handleImageUpload} isLoading={isLoading} theme={theme} />
              ) : (
                <div className="space-y-4">
                  {/* Visual Image Screen Wrapper with Glassmorphism and Laser Scan line */}
                  <div className={`relative rounded-xl overflow-hidden p-4 flex items-center justify-center ${
                    isLight ? "bg-neutral-50 border border-neutral-200" : "glass"
                  }`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_70%)]"></div>
                    <div className={`relative w-full rounded-lg overflow-hidden border ${
                      isLight ? "bg-neutral-100 border-neutral-200" : "bg-[#111] border-white/5 shadow-2xl"
                    }`}>
                      
                      {/* Laser scanner element */}
                      {(isLoading || extractedTokens) && (
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] scan-line z-20"></div>
                      )}

                      <img
                        src={selectedImage}
                        alt="Source UI Screenshot"
                        className="w-full max-h-[360px] object-contain mx-auto transition-transform duration-300 hover:scale-[1.01]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Manual file select link helper */}
                  {!isLoading && (
                    <div className={`flex items-center justify-between gap-2 pt-2 text-[11px] font-mono px-2 ${
                      isLight ? "text-neutral-400" : "text-white/40"
                    }`}>
                      <span>
                        {activePresetId ? "DEMO_PRESET_ENGAGED" : "SCREEN_SOURCE_LOADED"}
                      </span>
                      <button 
                        onClick={() => handleReset()}
                        className="text-blue-500 hover:text-blue-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Re-analyze layout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* PRESETS PLAYGROUND SEPARATOR */}
          <div className={`transition-all duration-300 border rounded-2xl p-6 ${
            isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-800" : "bg-[#0a0a0a] border-white/5 shadow-xl"
          }`} id="presets-panel">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <h3 className={`text-xs font-black uppercase tracking-widest ${
                isLight ? "text-neutral-700" : "text-white/60"
              }`}>Preset Playground</h3>
            </div>
            <p className={`text-xs mb-4 leading-relaxed ${isLight ? "text-neutral-500" : "text-white/40"}`}>
              Select an option below to immediately test the token analysis layout with realistic mock interface models.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`flex flex-col text-left rounded-xl overflow-hidden border transition-all text-xs group cursor-pointer ${
                    activePresetId === preset.id
                      ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                      : isLight 
                        ? "border-neutral-200 bg-neutral-50/30 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-700"
                        : "border-white/5 bg-black text-white/80 hover:bg-[#111] hover:border-white/10"
                  }`}
                  disabled={isLoading}
                >
                  <div className="h-16 w-full overflow-hidden relative">
                    <img 
                      src={preset.thumbnail} 
                      alt={preset.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                  </div>
                  <div className="p-2 flex flex-col justify-between flex-1">
                    <span className={`font-bold line-clamp-1 group-hover:text-blue-600 transition-colors ${
                      isLight ? "text-neutral-700" : "text-white/80"
                    }`}>{preset.name}</span>
                    <span className="text-[9px] text-blue-500 mt-1 uppercase font-mono tracking-wider font-bold">
                      {preset.data.colors.length} colors
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
        </section>

        {/* RIGHT PANEL: EXTRACTED TOKEN DASHBOARD (Col span: 7) */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="right-results-panel">
          
          {/* Error Message */}
          {error && (
            <div className={`border p-5 rounded-2xl flex items-start gap-4 transition-all duration-300 ${
              isLight ? "bg-red-50/50 border-red-200 text-red-900" : "bg-rose-950/30 border-rose-900/60 text-white"
            }`} id="error-card">
              <div className={`p-2 border rounded-lg flex-shrink-0 ${
                isLight ? "bg-red-50 border-red-300 text-red-600" : "bg-rose-950 border-rose-500/20 text-rose-400"
              }`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className={`text-sm font-bold ${isLight ? "text-red-900" : "text-rose-200"}`}>Extraction Error Encountered</h4>
                <p className={`text-xs leading-relaxed ${isLight ? "text-red-700" : "text-rose-400/90"}`}>{error}</p>
                <div className="pt-2">
                  <button 
                    onClick={() => handleReset()}
                    className="text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    Dismiss and Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOADING SCREEN */}
          <StepProgress isLoading={isLoading} />

          {/* PLACEHOLDER WHEN IDLE */}
          {!isLoading && !extractedTokens && !error && (
            <div className={`border rounded-2xl p-12 text-center flex flex-col items-center justify-center transition-all duration-300 ${
              isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-800" : "bg-[#0a0a0a] border-white/5"
            }`} id="idle-placeholder">
              <div className={`p-4 border rounded-full mb-4 ${
                isLight ? "bg-neutral-50 border-neutral-200 text-neutral-400" : "bg-black border-white/5 text-white/30"
              }`}>
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className={`text-base font-bold mb-2 ${isLight ? "text-neutral-800" : "text-white/80"}`}>No Tokens Extracted Yet</h3>
              <p className={`text-xs max-w-sm leading-relaxed mb-6 ${isLight ? "text-neutral-500" : "text-white/40"}`}>
                Provide a system UI mockup screenshot in the workspace pane, or invoke a model demo state below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleSelectPreset("cosmic-dashboard")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#013E37] hover:bg-[#025a50] border border-[#FFEFB3]/20 text-[#FFEFB3] rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  Load Cosmic Slate Demo
                </button>
              </div>
            </div>
          )}

          {/* CORE EXTRACTED TOKENS DASHBOARD */}
          {!isLoading && extractedTokens && (
            <div className="space-y-6" id="extracted-dashboard-active">
              
              {/* Token System Selector Tabs with Immersive Glass Styling */}
              <div className={`flex items-center gap-1.5 p-1 border rounded-xl overflow-x-auto scrollbar-none transition-colors duration-300 ${
                isLight ? "bg-neutral-200/50 border-neutral-200/80" : "bg-[#0a0a0a] border-white/5"
              }`} id="tabs-navigation">
                {[
                  { id: "all", label: "Full Spec", icon: Layers },
                  { id: "colors", label: "Colors", icon: Palette },
                  { id: "typography", label: "Typography", icon: Type },
                  { id: "components", label: "Components", icon: Box },
                  { id: "spacing", label: "Spacing", icon: Ruler },
                  { id: "json", label: "Raw JSON", icon: FileCode },
                  { id: "css", label: "CSS Variables", icon: FileCode },
                  { id: "figma", label: "Figma Tokens", icon: FileCode },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-[#013E37] text-[#FFEFB3] shadow border border-[#FFEFB3]/20"
                          : isLight
                            ? "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Modules Rendering based on active tab state */}
              <div className="space-y-6" id="dashboard-tab-content">
                {(activeTab === "all" || activeTab === "colors") && (
                  <ColorPalette colors={extractedTokens.colors} theme={theme} />
                )}

                {(activeTab === "all" || activeTab === "typography") && (
                  <TypographyScale typography={extractedTokens.typography} theme={theme} />
                )}

                {(activeTab === "all" || activeTab === "components") && (
                  <ComponentsTokens components={extractedTokens.components} theme={theme} />
                )}

                {(activeTab === "all" || activeTab === "spacing") && (
                  <SpacingScale spacing={extractedTokens.spacing} theme={theme} />
                )}

                {(activeTab === "all") && (
                  <ReviewSection review={extractedTokens.review} theme={theme} />
                )}

                {(activeTab === "all" || activeTab === "json") && (
                  <RawJsonExport 
                    data={extractedTokens} 
                    theme={theme}
                    onSwitchTab={(t) => setActiveTab(t)}
                  />
                )}

                {(activeTab === "css") && (
                  <CssVariablesExport 
                    data={extractedTokens} 
                    theme={theme}
                  />
                )}

                {(activeTab === "figma") && (
                  <FigmaTokensExport 
                    data={extractedTokens} 
                    theme={theme}
                  />
                )}
              </div>

            </div>
          )}

        </section>

      </main>

      {/* Immersive Footer copyright and confidence status bar */}
      <footer className={`h-10 border-t flex items-center justify-between px-6 md:px-10 text-[10px] uppercase tracking-widest font-mono transition-colors duration-300 ${
        isLight ? "bg-white border-neutral-200 text-neutral-500" : "bg-[#080808] border-t border-white/5 text-white/40"
      }`}>
        <div className="flex items-center gap-6">
          <span>SYSTEM V1.2</span>
          <span>•</span>
          <span>GEMINI-3.5-FLASH-EXTRACT</span>
        </div>
        <div className="hidden sm:block">ANALYSIS CONFIDENCE SCORE: 98.4%</div>
      </footer>

    </div>
  );
}
