import { useEffect, useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";

interface StepProgressProps {
  isLoading: boolean;
}

interface Step {
  id: number;
  label: string;
  duration: number; // Simulated duration in ms
}

const STEPS: Step[] = [
  { id: 1, label: "Uploading image content & configuring vision model", duration: 1500 },
  { id: 2, label: "Analyzing layout structure & boundary constraints", duration: 2500 },
  { id: 3, label: "Decomposing typography hierarchy & font sizes", duration: 2500 },
  { id: 4, label: "Synthesizing color palettes & extracting hex codes", duration: 2000 },
  { id: 5, label: "Formatting structured design token JSON", duration: 1500 }
];

export default function StepProgress({ isLoading }: StepProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    let isMounted = true;
    setCurrentStep(0);

    const runSimulatedSteps = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (!isMounted) break;
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, STEPS[i].duration));
      }
    };

    runSimulatedSteps();

    return () => {
      isMounted = false;
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center" id="step-progress">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
        <div className="relative p-4 bg-blue-500/10 border border-blue-500/20 rounded-full animate-pulse text-blue-400">
          <Sparkles className="w-8 h-8 animate-spin-slow" />
        </div>
      </div>

      <h4 className="text-base font-bold text-white mb-1">AI Token Extraction Active</h4>
      <p className="text-xs text-white/40 mb-8 max-w-sm text-center">
        Decomposing screen boundaries, typography scales, spacing tokens, and color values.
      </p>

      <div className="w-full max-w-md space-y-4">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          
          return (
            <div key={step.id} className="flex items-center gap-4 text-left transition-opacity duration-300">
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-blue-950/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full bg-black border-2 border-blue-500 flex items-center justify-center text-blue-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-black border border-white/5 flex items-center justify-center text-white/20 font-mono text-xs">
                    {step.id}
                  </div>
                )}
              </div>
              <span className={`text-sm ${
                isCompleted 
                  ? "text-white/30 line-through decoration-white/10" 
                  : isActive 
                    ? "text-blue-400 font-bold" 
                    : "text-white/20"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
