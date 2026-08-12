import React from 'react';
import { Camera, FileText, ShieldCheck } from 'lucide-react';

export const EvidenceVault: React.FC = () => {
  const evidenceItems = [
    {
      id: 101,
      cam: "CAM-201",
      location: "Floor 2 — ICU Room 204 Corridor",
      time: "2026-08-11 14:32:10",
      confidence: 96.4,
      labels: ["SMOKE_DENSE (94%)", "FLAME_CORE (96%)", "OBSTRUCTED_EXIT (91%)"],
      temp: "68.4°C",
      smoke: "320 ppm"
    },
    {
      id: 102,
      cam: "CAM-202",
      location: "Floor 2 — ICU Central Station",
      time: "2026-08-11 14:32:14",
      confidence: 94.2,
      labels: ["FLAME_SPECTRUM (94%)"],
      temp: "62.1°C",
      smoke: "280 ppm"
    }
  ];

  const handleDownloadPDF = () => {
    window.open('/api/reports/html/INC-2026-0811-01', '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      
      {/* Header & Report Export CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">📦 EVIDENCE VAULT & REPORT GENERATOR</h2>
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30">
              TAMPER-PROOF STORAGE
            </span>
          </div>
          <p className="text-xs text-slate-400">Automated multi-camera evidence capture with verified digital signature</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 hover:scale-105 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>📄 GENERATE OFFICIAL PDF REPORT</span>
        </button>
      </div>

      {/* Evidence Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {evidenceItems.map((item) => (
          <div key={item.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> {item.cam} ({item.location.split('—')[1]})
              </span>
              <span className="text-[11px] font-mono text-slate-400">{item.time}</span>
            </div>

            {/* Simulated Vision Snapshot Frame */}
            <div className="relative w-full h-[180px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              <div className="text-center space-y-1">
                <div className="text-xs font-bold text-red-400 uppercase">CAMERA SNAPSHOT CAPTURED</div>
                <div className="text-[11px] text-slate-300 font-medium">Confidence: {item.confidence}%</div>
              </div>

              {/* Bounding box annotations */}
              <div className="absolute top-4 left-4 border-2 border-red-500 bg-red-500/10 px-2 py-1 rounded text-[10px] font-bold text-white">
                {item.labels[0]}
              </div>
            </div>

            {/* Detected AI Labels */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase">AI COMPUTER VISION DETECTIONS:</div>
              <div className="flex flex-wrap gap-1.5">
                {item.labels.map((lbl, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-extrabold text-xs border border-red-500/30">
                    {lbl}
                  </span>
                ))}
              </div>
            </div>

            {/* Telemetry Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-bold text-slate-300">
              <span>Temp: <strong className="text-amber-400">{item.temp}</strong></span>
              <span>Smoke: <strong className="text-red-400">{item.smoke}</strong></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
