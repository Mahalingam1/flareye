import React from 'react';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import { Play, SkipForward, RotateCcw, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoRunning, demoStep, demoSteps, startDemo, nextDemoStep, resetDemo } = useSafetyBrain();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-red-950/60 to-slate-900 border-b border-red-500/30 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 font-extrabold text-xs tracking-widest border border-red-500/30 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            HACKATHON DEMO MODE
          </span>
          {isDemoRunning ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Step {demoStep} / {demoSteps.length}:
              </span>
              <span className="text-sm font-semibold text-amber-300">
                {demoSteps[demoStep - 1]?.title}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-300 font-medium">
              Click Start Demo to trigger the 14-step end-to-end hackathon emergency story.
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isDemoRunning ? (
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>▶ START DEMO</span>
            </button>
          ) : (
            <>
              <button
                onClick={nextDemoStep}
                disabled={demoStep >= demoSteps.length}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>NEXT STEP</span>
                <SkipForward className="w-4 h-4" />
              </button>
              
              <button
                onClick={resetDemo}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
