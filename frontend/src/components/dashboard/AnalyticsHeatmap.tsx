import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, ShieldCheck } from 'lucide-react';

export const AnalyticsHeatmap: React.FC = () => {
  const floorRiskData = [
    { floor: 'Floor 1 (ER)', risk: 8.0, color: '#10b981' },
    { floor: 'Floor 2 (ICU)', risk: 94.0, color: '#ef4444' },
    { floor: 'Floor 3 (OT)', risk: 15.0, color: '#10b981' },
    { floor: 'Floor 4 (Ward)', risk: 22.0, color: '#f59e0b' }
  ];

  const complianceData = [
    { name: 'Extinguishers', score: 94, fill: '#10b981' },
    { name: 'Exits', score: 88, fill: '#f59e0b' },
    { name: 'Fire Doors', score: 91, fill: '#10b981' },
    { name: 'Corridors', score: 96, fill: '#10b981' },
    { name: 'Signage', score: 87, fill: '#f59e0b' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">📊 HOSPITAL RISK HEATMAP & ANALYTICS</h2>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
              RECHARTS ANALYTICS
            </span>
          </div>
          <p className="text-xs text-slate-400">Multi-floor safety score trends, incident heat distribution, & equipment status</p>
        </div>
      </div>

      {/* Heatmap & Audit Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Floor Risk Heatmap Chart */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-500" />
              <span>FLOOR SAFETY RISK SCORE DISTRIBUTION</span>
            </h3>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="floor" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="risk" radius={[8, 8, 0, 0]}>
                  {floorRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Compliance Bar Chart */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FIRE SAFETY COMPLIANCE AUDIT SCORES</span>
            </h3>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={complianceData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-comp-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
