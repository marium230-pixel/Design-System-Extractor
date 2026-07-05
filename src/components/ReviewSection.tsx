import { ShieldCheck, ShieldAlert, Check, AlertTriangle, Info } from "lucide-react";

interface ReviewSectionProps {
  review?: {
    review_status: "confirmed" | "issues_found";
    notes: string[];
  };
  theme?: "dark" | "light";
}

export default function ReviewSection({ review, theme = "dark" }: ReviewSectionProps) {
  const isLight = theme === "light";

  if (!review) {
    return (
      <div 
        className={`border rounded-2xl p-6 transition-all duration-300 ${
          isLight ? "bg-white border-neutral-200/80 shadow-sm text-neutral-900" : "bg-[#0a0a0a] border-white/5 text-white"
        }`}
      >
        <div className="flex items-center gap-3 text-sm text-neutral-400">
          <Info className="w-4 h-4 text-[#013E37]" />
          <span>No review data available for this analysis.</span>
        </div>
      </div>
    );
  }

  const isConfirmed = review.review_status === "confirmed";

  return (
    <div 
      className={`border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
        isLight ? "bg-white border-neutral-200/85" : "bg-[#0a0a0a] border-white/10"
      }`} 
      id="review-section-container"
    >
      {/* Deep Green Header Banner with Butter Accents */}
      <div className="bg-[#013E37] text-[#FFEFB3] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFEFB3]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950/40 rounded-lg border border-[#FFEFB3]/20 flex items-center justify-center">
            {isConfirmed ? (
              <ShieldCheck className="w-5 h-5 text-[#FFEFB3]" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-[#FFEFB3]" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 text-[#FFEFB3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3]"></span> Automated QA Review
            </h3>
            <p className="text-[11px] text-[#FFEFB3]/80">Dual-agent validation of extracted design system tokens.</p>
          </div>
        </div>

        {/* Status Badge in Header */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
          isConfirmed 
            ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30" 
            : "bg-amber-950/60 text-amber-400 border-amber-500/30"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? "bg-emerald-400" : "bg-amber-400"}`}></span>
          {isConfirmed ? "EXTRACTION CONFIRMED" : "QA CONCERNS IDENTIFIED"}
        </div>
      </div>

      {/* Main Review Body */}
      <div className="p-6">
        <div className={`flex gap-4 items-start border-b pb-5 mb-5 ${
          isLight ? "border-neutral-200/60" : "border-white/5"
        }`}>
          {/* Large Left Indicator Badge */}
          <div className={`p-4 rounded-2xl flex-shrink-0 flex items-center justify-center ${
            isConfirmed 
              ? isLight ? "bg-emerald-50 text-emerald-600" : "bg-emerald-500/10 text-emerald-400"
              : isLight ? "bg-amber-50 text-amber-600" : "bg-amber-500/10 text-amber-400"
          }`}>
            {isConfirmed ? (
              <Check className="w-8 h-8" />
            ) : (
              <AlertTriangle className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <h4 className={`text-sm font-bold ${
              isLight ? "text-neutral-800" : "text-white/90"
            }`}>
              {isConfirmed 
                ? "Heuristics & LLM Alignment Confirmed" 
                : "Manual Verification Required"
              }
            </h4>
            <p className={`text-xs leading-relaxed ${
              isLight ? "text-neutral-500" : "text-white/40"
            }`}>
              {isConfirmed 
                ? "The second-pass verification agent compared the extracted design variables against the source visual layout and found zero contradictions."
                : "The second-pass verification agent found potential discrepancies or highly speculative guesses that warrant review."
              }
            </p>
          </div>
        </div>

        {/* List of QA Notes */}
        <div>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-3 ${
            isLight ? "text-neutral-400" : "text-white/30"
          }`}>
            Validation Report ({review.notes.length} {review.notes.length === 1 ? "Note" : "Notes"})
          </span>

          <ul className="space-y-2.5">
            {review.notes.map((note, idx) => (
              <li 
                key={idx}
                className={`flex gap-3 text-xs p-3 rounded-xl border transition-colors ${
                  isConfirmed
                    ? isLight 
                      ? "bg-emerald-50/20 border-emerald-100/50 text-neutral-700 hover:bg-emerald-50/40" 
                      : "bg-emerald-500/[0.02] border-emerald-500/5 text-white/80 hover:bg-emerald-500/[0.04]"
                    : isLight 
                      ? "bg-amber-50/20 border-amber-100/50 text-neutral-700 hover:bg-amber-50/40" 
                      : "bg-amber-500/[0.02] border-amber-500/5 text-white/80 hover:bg-amber-500/[0.04]"
                }`}
              >
                {/* Check or Warning bullet */}
                <span className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full ${
                  isConfirmed 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-amber-500/10 text-amber-500"
                }`}>
                  {isConfirmed ? <Check className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                </span>
                <span className="leading-normal">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
