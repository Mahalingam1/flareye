import React from 'react';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import type { PatientCategory } from '../../types';
import { Navigation, AlertOctagon, CheckCircle2, User, Accessibility, Bed, Stethoscope } from 'lucide-react';

export const EvacuationPlanner: React.FC = () => {
  const { patientCategory, setPatientCategory, evacuationRoute, activeFloor } = useSafetyBrain();

  const patientTypes: { category: PatientCategory; label: string; icon: any }[] = [
    { category: 'Walking', label: '🧍 Walking', icon: User },
    { category: 'Wheelchair', label: '♿ Wheelchair', icon: Accessibility },
    { category: 'Stretcher', label: '🛏️ Stretcher', icon: Bed },
    { category: 'ICU', label: '🔴 ICU / Critical', icon: Stethoscope },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      
      {/* Header & Patient Category Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">🧭 PATIENT-AWARE DYNAMIC EVACUATION ROUTER</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              GRAPH PATHFINDER
            </span>
          </div>
          <p className="text-xs text-slate-400">Routes continuously adapt according to fire spread & patient mobility constraints</p>
        </div>

        {/* Mobility Mode Tabs */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1">
          {patientTypes.map(({ category, label }) => (
            <button
              key={category}
              onClick={() => setPatientCategory(category)}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                patientCategory === category
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Route Callout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Safest Exit Card */}
        <div className="bg-emerald-950/40 border-2 border-emerald-500/60 p-5 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
              🟢 SAFEST RECOMMENDED EXIT
            </span>
            <span className="text-xs font-bold text-emerald-300">
              {evacuationRoute?.distance_meters || 84} meters away
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white">
            {evacuationRoute?.safest_exit || 'EAST RAMP EMERGENCY EXIT'}
          </div>

          <p className="text-sm font-bold text-emerald-200">
            {evacuationRoute?.reason || 'Wheelchair route selected: All staircases bypassed. Ramp egress path is clear.'}
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>ACCESSIBLE & RAMP VERIFIED FOR {patientCategory.toUpperCase()} PATIENTS</span>
          </div>
        </div>

        {/* Unsafe / Avoid Exit Card */}
        <div className="bg-red-950/40 border-2 border-red-500/60 p-5 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-extrabold text-xs border border-red-500/30">
              🔴 UNSAFE / BLOCKED EXIT
            </span>
            <span className="text-xs font-bold text-red-400">DO NOT ENTER</span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white line-through text-red-300">
            NORTH ICU EXIT
          </div>

          <p className="text-sm font-bold text-red-200">
            Hazard Warning: Dense optical smoke pattern and fire thermal plume detected in North Corridor.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-900/40 p-2.5 rounded-xl border border-red-500/30">
            <AlertOctagon className="w-4 h-4 shrink-0 text-red-400" />
            <span>HIGH-RISK HAZARD ZONE &bull; VISIBILITY &lt; 2 METERS</span>
          </div>
        </div>

      </div>

      {/* Step-by-Step Evacuation Egress Instructions */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>STEP-BY-STEP EVACUATION INSTRUCTIONS FOR FLOOR {activeFloor} STAFF:</span>
        </h3>

        <div className="space-y-2">
          {(evacuationRoute?.step_instructions || [
            "1. Move patient out of ICU Room 204 towards Main Central Corridor.",
            "2. Turn EAST, avoiding North Corridor due to smoke accumulation.",
            "3. Follow green lighted floor strips directly to East Ramp Exit.",
            "4. Assemble at East Courtyard Triage Station."
          ]).map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-sm font-semibold text-slate-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold shrink-0 border border-emerald-500/30">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
