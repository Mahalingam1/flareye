import React, { useState } from 'react';
import { Play, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('exit_blocked');
  const [simulationResult, setSimulationResult] = useState<any>({
    scenario_name: "What-If: Primary ICU Exit Blocked",
    timeline: [
      { timestamp: "00:00", event: "Obstruction placed at North ICU Emergency Exit door.", risk: 25.0, status: "WARNING" },
      { timestamp: "00:30", event: "AI Compliance system flags blocked exit. Fire door sensor fails.", risk: 48.0, status: "HIGH RISK" },
      { timestamp: "01:00", event: "Simulated heat anomaly in Room 204. Corridor evacuation load increases.", risk: 78.0, status: "CRITICAL" },
      { timestamp: "01:30", event: "North route fully rendered unsafe. System reroutes all flow to East Ramp Exit.", risk: 92.0, status: "CRITICAL" }
    ],
    recommended_route: "EAST RAMP EMERGENCY EXIT (Distance: 84 meters)",
    risk_delta: 67.0
  });

  const runScenario = async (scenario: string) => {
    setSelectedScenario(scenario);
    try {
      const res = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_type: scenario, floor_number: 2 })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (e) {
      // Keep state
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Prominent SIMULATION Watermark Badge */}
      <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
        <Sparkles className="w-3.5 h-3.5" /> SIMULATED WHAT-IF PREDICTION
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white font-heading">🧪 WHAT-IF EMERGENCY SPREAD SIMULATOR</h2>
        </div>
        <p className="text-xs text-slate-400">Simulate fire propagation physics, smoke spread, & alternative evacuation scenarios</p>
      </div>

      {/* Scenario Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'exit_blocked', name: 'What if ICU exit is blocked?' },
          { id: 'electrical_fire', name: 'What if fire starts in electrical room?' },
          { id: 'smoke_spread', name: 'What if smoke spreads to Corridor B?' }
        ].map((sc) => (
          <button
            key={sc.id}
            onClick={() => runScenario(sc.id)}
            className={`p-3.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer text-left space-y-1 ${
              selectedScenario === sc.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{sc.name}</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </button>
        ))}
      </div>

      {/* Simulation Timeline Results */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white uppercase">{simulationResult?.scenario_name}</h3>
          <span className="text-xs font-bold text-red-400">Risk Delta: +{simulationResult?.risk_delta}%</span>
        </div>

        <div className="space-y-3">
          {simulationResult?.timeline?.map((step: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 font-mono font-bold shrink-0 border border-slate-700">
                <Clock className="w-3 h-3 inline mr-1" />
                {step.timestamp}
              </div>
              <div className="flex-1 text-slate-200 font-medium">
                {step.event}
              </div>
              <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] shrink-0 ${
                step.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
              }`}>
                Risk: {step.risk}% &bull; {step.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/40 flex items-center justify-between text-xs">
          <div className="font-bold text-emerald-300">
            SIMULATED AI RECOMMENDED ROUTE: <span className="text-white font-extrabold">{simulationResult?.recommended_route}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

    </div>
  );
};
