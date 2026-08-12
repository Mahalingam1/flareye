import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Camera, ShieldAlert } from 'lucide-react';

export const IncidentTimeMachine: React.FC = () => {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const timelineEvents = [
    { time: "14:31:05", title: "Corridor Obstruction Flagged", desc: "Medical trolley detected blocking North ICU Exit.", status: "WARNING", camera: "CAM-201", temp: "24.5°C", smoke: "15 ppm" },
    { time: "14:32:00", title: "Optical Smoke Pattern Detected", desc: "Camera CAM-201 detected dense optical smoke pattern near Room 204.", status: "WARNING", camera: "CAM-201", temp: "38.2°C", smoke: "180 ppm" },
    { time: "14:32:04", title: "Thermal Flame Verified", desc: "CAM-202 cross-confirmed thermal flame spectrum near Room 204.", status: "HIGH RISK", camera: "CAM-202", temp: "52.0°C", smoke: "240 ppm" },
    { time: "14:32:08", title: "IoT Temp Spike 68.4°C", desc: "Sensor SEN-202 triggered alarm state.", status: "CRITICAL", camera: "CAM-201", temp: "68.4°C", smoke: "320 ppm" },
    { time: "14:32:10", title: "Safety Risk Score: 94 / 100", desc: "AI Multi-Modal Fusion Engine confirmed high-risk fire event.", status: "CRITICAL", camera: "CAM-201", temp: "68.4°C", smoke: "320 ppm" },
    { time: "14:32:12", title: "Emergency Voice Alert Broadcasted", desc: "Automated multilingual voice announcement initiated.", status: "CRITICAL", camera: "CAM-202", temp: "68.4°C", smoke: "320 ppm" },
    { time: "14:32:15", title: "Dynamic Wheelchair Evacuation Route Active", desc: "Route updated to East Ramp Emergency Exit.", status: "CRITICAL", camera: "CAM-203", temp: "68.4°C", smoke: "320 ppm" }
  ];

  const currentEvent = timelineEvents[activeStepIdx];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">⏱️ INCIDENT TIME MACHINE & REPLAY</h2>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
              CHRONOLOGICAL AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-400">Inspect exact sequence of events, camera evidence snapshots, & IoT sensor logs</p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 gap-2">
          <button
            onClick={() => setActiveStepIdx(Math.max(0, activeStepIdx - 1))}
            className="p-1.5 rounded text-slate-300 hover:text-white cursor-pointer"
            title="Previous Event"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 cursor-pointer shadow"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <button
            onClick={() => setActiveStepIdx(Math.min(timelineEvents.length - 1, activeStepIdx + 1))}
            className="p-1.5 rounded text-slate-300 hover:text-white cursor-pointer"
            title="Next Event"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Timeline Bar */}
      <div className="grid grid-cols-7 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        {timelineEvents.map((evt, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStepIdx(idx)}
            className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
              activeStepIdx === idx
                ? 'bg-red-600 text-white font-bold shadow-lg scale-105'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono">{evt.time}</div>
            <div className="text-[11px] font-bold truncate mt-0.5">{evt.title.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Selected Replay Inspector Screen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
        
        {/* Simulated Camera Video Frame View */}
        <div className="md:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Camera className="w-4 h-4" /> SNAPSHOT: {currentEvent.camera}
            </span>
            <span className="font-mono text-slate-400">{currentEvent.time}</span>
          </div>

          <div className="relative w-full h-[220px] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Simulated Frame Graphics */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto animate-pulse">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-xs font-bold text-white uppercase">
                {currentEvent.title}
              </div>
              <div className="text-[11px] text-red-400 font-semibold">
                AI Vision Label: {currentEvent.status === 'CRITICAL' ? 'SMOKE_DENSE + FLAME_CORE' : 'CLEAR'}
              </div>
            </div>

            {/* Bounding box simulation overlay */}
            {currentEvent.status === 'CRITICAL' && (
              <div className="absolute top-8 left-12 w-32 h-24 border-2 border-red-500 bg-red-500/10 rounded flex items-start p-1 text-[9px] font-bold text-white">
                SMOKE_DENSE (96.4%)
              </div>
            )}
          </div>
        </div>

        {/* Telemetry Details */}
        <div className="md:col-span-5 space-y-3">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            EVENT TELEMETRY METRICS
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-base font-extrabold text-white">{currentEvent.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{currentEvent.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-bold block">TEMP SENSOR</span>
              <span className="text-base font-extrabold text-amber-400 mt-1 block">{currentEvent.temp}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-bold block">SMOKE SENSOR</span>
              <span className="text-base font-extrabold text-red-400 mt-1 block">{currentEvent.smoke}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
