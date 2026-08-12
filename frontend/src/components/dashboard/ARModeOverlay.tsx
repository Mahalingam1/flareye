import React from 'react';
import { ArrowRight, Flame, Compass } from 'lucide-react';

export const ARModeOverlay: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">📱 AR-STYLE MOBILE FIELD EVACUATION GUIDANCE</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              FIELD HUD
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-time camera view overlay for hospital response staff & emergency teams</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400">
          <Compass className="w-4 h-4 animate-spin" />
          <span>AR COMPASS ACTIVE</span>
        </div>
      </div>

      {/* Simulated AR Camera Viewfinder HUD */}
      <div className="relative w-full h-[450px] bg-slate-950 rounded-2xl border-4 border-emerald-500/50 overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* AR Camera HUD Overlay Elements */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-white z-10">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>AR TRACKING: FLOOR 2 ICU CORRIDOR</span>
          </div>
          <div className="bg-emerald-600 px-3 py-1.5 rounded-xl font-extrabold shadow">
            GPS / UWB PRECISION: 0.2m
          </div>
        </div>

        {/* Floating Directional Arrows */}
        <div className="text-center space-y-4 z-10">
          
          {/* Giant Animated Green Arrow pointing EAST */}
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-emerald-500/30 border-4 border-emerald-400 text-emerald-400 animate-pulse shadow-2xl shadow-emerald-500/50">
            <ArrowRight className="w-16 h-16 stroke-[3]" />
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md border-2 border-emerald-400 px-6 py-3 rounded-2xl max-w-md mx-auto space-y-1 shadow-2xl">
            <div className="text-xl sm:text-2xl font-black text-white">
              🟢 PROCEED EAST → 84 METERS
            </div>
            <p className="text-xs font-bold text-emerald-300">
              East Ramp Emergency Exit is SAFE & Clear of Smoke
            </p>
          </div>

        </div>

        {/* Hazard Callout Box in Background */}
        <div className="absolute bottom-6 left-6 bg-red-950/90 border-2 border-red-500 p-3 rounded-xl text-xs font-bold text-white space-y-1 shadow-2xl z-10">
          <div className="flex items-center gap-1.5 text-red-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>HAZARD ALERT: NORTH CORRIDOR</span>
          </div>
          <div className="text-red-300">🔴 DO NOT ENTER NORTH EXIT &bull; VISIBILITY BLOCKED</div>
        </div>

      </div>

    </div>
  );
};
