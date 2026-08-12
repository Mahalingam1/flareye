import React, { useState } from 'react';
import { AlertTriangle, QrCode, RefreshCw, BellRing } from 'lucide-react';

export const CompliancePassport: React.FC = () => {
  const [selectedPassport, setSelectedPassport] = useState<string>('EXT-204');

  const passports = [
    { id: "EXT-204", type: "CO2 Fire Extinguisher (4.5kg)", floor: 2, location: "ICU Central Station", inspected: "2026-07-10", next: "2026-09-10", status: "AVAILABLE", accessibility: "CLEAR (100%)", qr: "QR-EXT-204" },
    { id: "DOOR-201", type: "Magnetic Fire Door", floor: 2, location: "North ICU Door", inspected: "2026-06-15", next: "2026-08-15", status: "OPEN (ALARM)", accessibility: "BLOCKED (Trolley)", qr: "QR-DOOR-201" },
    { id: "EXT-301", type: "Water Hose Reel", floor: 3, location: "OT Suite Lobby", inspected: "2026-05-10", next: "2026-07-10", status: "EXPIRED", accessibility: "CLEAR", qr: "QR-EXT-301" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      
      {/* Header & Overall Compliance Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">📋 FIRE SAFETY COMPLIANCE & EQUIPMENT PASSPORT</h2>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
              AUDIT PASSPORT
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-time inspection verification & recurring obstruction intelligence</p>
        </div>

        {/* Overall Score Gauge */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">OVERALL AUDIT SCORE</div>
            <div className="text-2xl font-black text-emerald-400 font-heading">91%</div>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-xs text-white">
            A
          </div>
        </div>
      </div>

      {/* Compliance Breakdown Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Extinguishers', pct: 94, color: 'bg-emerald-500' },
          { label: 'Emergency Exits', pct: 88, color: 'bg-amber-500' },
          { label: 'Fire Doors', pct: 91, color: 'bg-emerald-500' },
          { label: 'Corridors', pct: 96, color: 'bg-emerald-500' },
          { label: 'Signage', pct: 87, color: 'bg-amber-500' }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-xs font-bold text-slate-400">{item.label}</div>
            <div className="text-xl font-black text-white font-heading">{item.pct}%</div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Active Violations & Passport Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Active Violation Card & Recurring Intelligence */}
        <div className="md:col-span-7 space-y-4">
          
          <div className="bg-amber-950/40 border border-amber-500/50 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase">
                <AlertTriangle className="w-4 h-4" /> ACTIVE COMPLIANCE WARNING
              </span>
              <span className="text-xs font-bold text-amber-300">18 MIN DURATION</span>
            </div>
            <h3 className="text-lg font-black text-white">⚠️ EXIT CORRIDOR OBSTRUCTED — FLOOR 2</h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Medical trolley improperly parked in North ICU Emergency Corridor. Egress width reduced below standard regulatory limit.
            </p>
            <button 
              onClick={() => alert("Responsible maintenance and nursing team dispatched to clear North Corridor.")}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BellRing className="w-3.5 h-3.5" /> NOTIFY RESPONSIBLE MAINTENANCE TEAM
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-400 uppercase">
              <RefreshCw className="w-4 h-4 animate-spin" /> RECURRING VIOLATION INTELLIGENCE
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              <strong className="text-white">North ICU Exit:</strong> Blocked 8 times this month by mobile equipment.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-bold text-emerald-400">
              💡 AI Recommendation: Re-allocate equipment storage bay to Corridor 3 to eliminate recurring obstruction risk.
            </div>
          </div>

        </div>

        {/* Right: Digital Passport Inspector */}
        <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            FIRE EQUIPMENT DIGITAL PASSPORT
          </div>

          <div className="space-y-2">
            {passports.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPassport(p.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedPassport === p.id
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{p.id} ({p.type.split(' ')[0]})</span>
                  <span className={p.status === 'AVAILABLE' ? 'text-emerald-400' : 'text-red-400'}>{p.status}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{p.location}</div>
              </button>
            ))}
          </div>

          {/* QR Code Passport Display */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">DIGITAL PASSPORT QR</div>
              <div className="text-xs font-bold text-white mt-0.5">{selectedPassport}</div>
              <div className="text-[11px] text-slate-400">Verified Inspection: 2026-07-10</div>
            </div>
            <div className="p-2 rounded-lg bg-white text-slate-950 font-bold text-xs flex items-center gap-1 shadow">
              <QrCode className="w-6 h-6 text-slate-950" />
              <span className="text-[10px]">SCAN</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
