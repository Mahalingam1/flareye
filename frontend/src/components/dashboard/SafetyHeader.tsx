import React from 'react';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { ShieldCheck, AlertTriangle, Flame, Navigation, Activity } from 'lucide-react';

export const SafetyHeader: React.FC = () => {
  const { safetyStatus, overallRiskScore, evacuationRoute } = useSafetyBrain();
  const { isEasyMode } = useAccessibility();

  const getGaugeColor = (score: number) => {
    if (score >= 75) return 'from-red-600 to-orange-600';
    if (score >= 45) return 'from-amber-500 to-orange-500';
    return 'from-emerald-500 to-teal-500';
  };

  return (
    <div className={`rounded-2xl p-6 transition-all border shadow-2xl ${
      safetyStatus === 'CRITICAL'
        ? 'bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-red-500/50 shadow-red-500/10'
        : safetyStatus === 'WARNING'
        ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border-amber-500/40 shadow-amber-500/10'
        : 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-800 shadow-slate-950/40'
    }`}>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Main Status & Plain Language Explanation */}
        <div className="lg:col-span-8 space-y-3">
          
          <div className="flex flex-wrap items-center gap-3">
            {safetyStatus === 'SAFE' && (
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 font-extrabold text-2xl sm:text-3xl shadow-lg">
                <ShieldCheck className="w-9 h-9 text-emerald-400" />
                <span>🟢 HOSPITAL SAFE</span>
              </div>
            )}

            {safetyStatus === 'WARNING' && (
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 text-amber-400 font-extrabold text-2xl sm:text-3xl shadow-lg">
                <AlertTriangle className="w-9 h-9 text-amber-400 animate-pulse" />
                <span>🟡 SAFETY WARNING</span>
              </div>
            )}

            {safetyStatus === 'CRITICAL' && (
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-600 border-2 border-red-400 text-white font-black text-2xl sm:text-4xl shadow-xl shadow-red-600/40 animate-pulse">
                <Flame className="w-10 h-10 text-yellow-300" />
                <span>🔴 EMERGENCY DETECTED</span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>AI DIGITAL SAFETY BRAIN ACTIVE</span>
            </div>
          </div>

          {/* Plain Language Rationale for Elderly Administrators */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              STATUS RATIONALE (PLAIN LANGUAGE):
            </h3>
            <p className={`font-bold leading-relaxed ${isEasyMode ? 'text-xl' : 'text-base sm:text-lg'} ${
              safetyStatus === 'CRITICAL' ? 'text-red-300' : safetyStatus === 'WARNING' ? 'text-amber-300' : 'text-emerald-300'
            }`}>
              {safetyStatus === 'CRITICAL'
                ? "🔥 HIGH FIRE RISK: Smoke detected near ICU Room 204 + North Emergency Exit blocked."
                : safetyStatus === 'WARNING'
                ? "⚠️ WARNING: Egress corridor obstruction detected. Maintenance team notified."
                : "🟢 Normal operation: All 47 CCTV cameras and 84 IoT sensors report safe ambient parameters."}
            </p>
          </div>

        </div>

        {/* Risk Score Gauge & Safest Exit Overview */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 items-stretch justify-center">
          
          {/* Risk Score Box */}
          <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">SAFETY RISK SCORE</div>
              <div className="text-3xl font-black font-heading text-white mt-1">
                {overallRiskScore.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">
                {overallRiskScore >= 75 ? '🔴 CRITICAL LEVEL' : overallRiskScore >= 45 ? '🟡 HIGH LEVEL' : '🟢 LOW RISK'}
              </div>
            </div>

            {/* Gauge visual bar */}
            <div className="w-24 h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${getGaugeColor(overallRiskScore)} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(5, overallRiskScore))}%` }}
              />
            </div>
          </div>

          {/* Safest Exit Direct Callout */}
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/40 flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">RECOMMENDED SAFEST EXIT</div>
              <div className="text-base font-extrabold text-white mt-0.5">
                {evacuationRoute?.safest_exit || "EAST RAMP EMERGENCY EXIT"}
              </div>
              <div className="text-xs font-semibold text-emerald-300">
                Status: 🟢 SAFE &bull; Distance: {evacuationRoute?.distance_meters || 84}m
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
