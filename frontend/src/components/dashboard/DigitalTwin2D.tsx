import React, { useState } from 'react';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import type { Camera, FireEquipment, EmergencyExit } from '../../types';
import { Video, ShieldAlert, Layers, Flame, CheckSquare, Square, ZoomIn, ZoomOut, RotateCcw, Satellite, MapPin } from 'lucide-react';
import { RealTimeGeoMap } from './RealTimeGeoMap';

export const DigitalTwin2D: React.FC = () => {
  const { activeFloor, setActiveFloor, safetyStatus } = useSafetyBrain();
  
  // View mode switcher: 'geo' (Real-Time GPS Satellite Map) vs 'cad' (Indoor CAD Blueprint)
  const [viewMode, setViewMode] = useState<'geo' | 'cad'>('geo');

  // Layer toggles
  const [showCameras, setShowCameras] = useState<boolean>(true);
  const [showEquipment, setShowEquipment] = useState<boolean>(true);
  const [showExits, setShowExits] = useState<boolean>(true);
  const [showEvacuation, setShowEvacuation] = useState<boolean>(true);

  // Map Zoom Control
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Selected item modal details
  const [selectedItem, setSelectedItem] = useState<{ type: string; data: any } | null>(null);

  // Floor 2 Real Telemetry Data
  const cameras: Camera[] = [
    { code: "CAM-201", name: "ICU Room 204 Corridor", location: "North Hallway", x_position: 32.0, y_position: 32.0, status: "ONLINE", confidence: 0.94, last_detection: "SMOKE_DENSE" },
    { code: "CAM-202", name: "ICU Central Station", location: "Center Station", x_position: 50.0, y_position: 48.0, status: "ONLINE", confidence: 0.96, last_detection: "FLAME_CORE" },
    { code: "CAM-203", name: "East Wing Corridor", location: "East Hallway", x_position: 82.0, y_position: 45.0, status: "ONLINE", confidence: 0.99, last_detection: "CLEAR" }
  ];

  const equipment: FireEquipment[] = [
    { passport_id: "EXT-204", equipment_type: "CO2 Extinguisher", location: "ICU Station 2", x_position: 46.0, y_position: 50.0, last_inspected: "2026-07-10", next_inspection: "2026-09-10", status: "AVAILABLE", qr_code: "QR-EXT-204" },
    { passport_id: "DOOR-201", equipment_type: "Magnetic Fire Door", location: "North ICU Door", x_position: 28.0, y_position: 20.0, last_inspected: "2026-06-15", next_inspection: "2026-08-15", status: "OPEN", qr_code: "QR-DOOR-201" }
  ];

  const exits: EmergencyExit[] = [
    { code: "EXIT-2A", name: "North ICU Exit", location: "North Egress Stairwell", x_position: 14.0, y_position: 15.0, is_accessible: false, status: "BLOCKED", distance_meters: 32.0 },
    { code: "EXIT-2B", name: "East Ramp Emergency Exit", location: "East Egress Ramp", x_position: 90.0, y_position: 45.0, is_accessible: true, status: "SAFE", distance_meters: 84.0 }
  ];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-4">
      
      {/* Map Engine View Switcher Banner */}
      <div className="bg-stone-900/90 border-2 border-stone-800 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 px-2">
          <MapPin className="w-5 h-5 text-orange-400 animate-bounce" />
          <span className="text-sm font-black text-white">ACTIVE MAP MODE:</span>
        </div>

        <div className="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setViewMode('geo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-xs transition-all cursor-pointer ${
              viewMode === 'geo'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border border-orange-400/50'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Satellite className="w-4 h-4 text-orange-300" />
            <span>🛰️ REAL-TIME GPS SATELLITE MAP</span>
          </button>

          <button
            onClick={() => setViewMode('cad')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-xs transition-all cursor-pointer ${
              viewMode === 'cad'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border border-orange-400/50'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            <span>🏢 INDOOR CAD BLUEPRINT</span>
          </button>
        </div>
      </div>

      {/* Conditionally Render Real-Time Geo Map or Indoor CAD Blueprint */}
      {viewMode === 'geo' ? (
        <RealTimeGeoMap />
      ) : (
        <div className="bg-stone-900/90 border-2 border-stone-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl backdrop-blur-md">
          
          {/* Header controls & Floor Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-black text-white font-heading">🗺️ REAL ARCHITECTURAL FLOOR PLAN MAP</h2>
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-xs border border-orange-500/40">
                  CAD MAP ENGINE
                </span>
              </div>
              <p className="text-sm font-extrabold text-stone-300">Live spatial CAD telemetry with real doors, beds, stairwells, and evacuation path chevrons</p>
            </div>

            {/* Floor Selector Buttons */}
            <div className="flex items-center bg-stone-950 p-1.5 rounded-2xl border-2 border-stone-800">
              {[1, 2, 3].map((floorNum) => (
                <button
                  key={floorNum}
                  onClick={() => setActiveFloor(floorNum)}
                  className={`px-4 py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
                    activeFloor === floorNum
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/40 border border-orange-400/50'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  FLOOR {floorNum} {floorNum === 2 && ' (ICU)'}
                </button>
              ))}
            </div>
          </div>

      {/* Map Layer Controls & Zoom Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/90 p-3 rounded-2xl border-2 border-stone-800 text-xs font-extrabold text-stone-200">
        
        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-black">
            <Layers className="w-4 h-4 text-orange-400" /> LAYERS:
          </span>
          
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input type="checkbox" checked={showCameras} onChange={(e) => setShowCameras(e.target.checked)} className="hidden" />
            {showCameras ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-stone-600" />}
            <span>📹 CAMERAS</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input type="checkbox" checked={showEquipment} onChange={(e) => setShowEquipment(e.target.checked)} className="hidden" />
            {showEquipment ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-stone-600" />}
            <span>🧯 EQUIPMENT</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input type="checkbox" checked={showExits} onChange={(e) => setShowExits(e.target.checked)} className="hidden" />
            {showExits ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-stone-600" />}
            <span>🚪 EXITS</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input type="checkbox" checked={showEvacuation} onChange={(e) => setShowEvacuation(e.target.checked)} className="hidden" />
            {showEvacuation ? <CheckSquare className="w-4 h-4 text-emerald-300" /> : <Square className="w-4 h-4 text-stone-600" />}
            <span>🧭 EVACUATION PATH</span>
          </label>
        </div>

        {/* Map Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button onClick={handleZoomIn} className="p-1.5 rounded-lg hover:bg-stone-800 text-white cursor-pointer" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="px-2 text-stone-300 font-black">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={handleZoomOut} className="p-1.5 rounded-lg hover:bg-stone-800 text-white cursor-pointer" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleResetZoom} className="p-1.5 rounded-lg hover:bg-stone-800 text-amber-400 cursor-pointer" title="Reset View">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Real Architectural Floor Plan SVG Canvas */}
      <div className="relative w-full h-[500px] sm:h-[560px] bg-stone-950 rounded-3xl border-2 border-stone-800 overflow-hidden shadow-inner flex items-center justify-center">
        
        <div 
          className="w-full h-full relative transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SVG Real Architectural Blueprint Floor Plan */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* Floor Tile Pattern */}
              <pattern id="floorGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.3" />
              </pattern>

              {/* Thermal Heat Diffusion Plume */}
              <radialGradient id="thermalPlume" cx="30%" cy="30%" r="25%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#f97316" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* Wall Hatch Pattern */}
              <pattern id="wallHatch" width="2" height="2" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="2" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Grid Backdrop */}
            <rect width="100%" height="100%" fill="url(#floorGrid)" />

            {/* Outer Hospital Building Perimeter Walls */}
            <rect x="4" y="8" width="92" height="84" rx="4" fill="#0f0c0c" stroke="#38bdf8" strokeWidth="1.2" />

            {/* --- ROOM 1: ICU ROOM 204 (North West) --- */}
            <g id="room204">
              <rect x="8" y="12" width="28" height="32" fill="#1c1111" stroke="#ef4444" strokeWidth="1.2" rx="1.5" />
              <text x="22" y="18" fill="#f87171" fontSize="2.8" fontWeight="bold" textAnchor="middle">ICU ROOM 204</text>
              
              {/* Architectural Hospital Beds */}
              {/* Bed 1 */}
              <rect x="11" y="22" width="5" height="8" rx="1" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.5" />
              <rect x="11.5" y="22.5" width="4" height="2" fill="#38bdf8" />
              {/* Bed 2 */}
              <rect x="18" y="22" width="5" height="8" rx="1" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.5" />
              <rect x="18.5" y="22.5" width="4" height="2" fill="#38bdf8" />
              {/* Bed 3 */}
              <rect x="25" y="22" width="5" height="8" rx="1" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.5" />
              <rect x="25.5" y="22.5" width="4" height="2" fill="#38bdf8" />
              {/* Bed 4 (Active Fire Origin) */}
              <rect x="29" y="32" width="5" height="8" rx="1" fill="#450a0a" stroke="#ef4444" strokeWidth="0.8" className="animate-pulse" />
              <rect x="29.5" y="32.5" width="4" height="2" fill="#ef4444" />

              {/* Door Swing Arc */}
              <path d="M 22 44 A 6 6 0 0 1 28 44" fill="none" stroke="#10b981" strokeWidth="0.6" strokeDasharray="1 1" />
              <line x1="22" y1="44" x2="28" y2="44" stroke="#0f0c0c" strokeWidth="1.5" /> {/* Door opening */}
            </g>

            {/* --- ROOM 2: ICU ROOM 205 (North Center) --- */}
            <g id="room205">
              <rect x="40" y="12" width="26" height="32" fill="#17181c" stroke="#475569" strokeWidth="1" rx="1.5" />
              <text x="53" y="18" fill="#e2e8f0" fontSize="2.8" fontWeight="bold" textAnchor="middle">ICU ROOM 205</text>
              
              {/* Beds in Room 205 */}
              <rect x="43" y="23" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
              <rect x="43.5" y="23.5" width="4" height="2" fill="#94a3b8" />
              <rect x="50" y="23" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
              <rect x="50.5" y="23.5" width="4" height="2" fill="#94a3b8" />
              <rect x="57" y="23" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
              <rect x="57.5" y="23.5" width="4" height="2" fill="#94a3b8" />

              {/* Door Swing */}
              <path d="M 50 44 A 5 5 0 0 1 55 44" fill="none" stroke="#10b981" strokeWidth="0.6" strokeDasharray="1 1" />
              <line x1="50" y1="44" x2="55" y2="44" stroke="#0f0c0c" strokeWidth="1.5" />
            </g>

            {/* --- ROOM 3: OXYGEN STORAGE BAY (North East) --- */}
            <g id="oxygenBay">
              <rect x="70" y="12" width="22" height="32" fill="#0f172a" stroke="#0284c7" strokeWidth="1" rx="1.5" />
              <text x="81" y="18" fill="#38bdf8" fontSize="2.8" fontWeight="bold" textAnchor="middle">OXYGEN BAY</text>
              
              {/* Oxygen Cylinders */}
              <circle cx="75" cy="26" r="2.2" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.4" />
              <circle cx="81" cy="26" r="2.2" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.4" />
              <circle cx="87" cy="26" r="2.2" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.4" />
              <circle cx="78" cy="33" r="2.2" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.4" />
              <circle cx="84" cy="33" r="2.2" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.4" />

              {/* Door Swing */}
              <path d="M 78 44 A 5 5 0 0 1 83 44" fill="none" stroke="#10b981" strokeWidth="0.6" strokeDasharray="1 1" />
              <line x1="78" y1="44" x2="83" y2="44" stroke="#0f0c0c" strokeWidth="1.5" />
            </g>

            {/* --- CENTRAL MAIN CORRIDOR --- */}
            <g id="corridor">
              <rect x="8" y="46" width="84" height="16" fill="#121010" stroke="#334155" strokeWidth="0.8" />
              <text x="50" y="55" fill="#94a3b8" fontSize="2.6" fontWeight="extrabold" letterSpacing="0.2" textAnchor="middle">MAIN ICU CENTRAL CORRIDOR</text>
            </g>

            {/* --- ROOM 4: NURSE CENTRAL STATION (South West) --- */}
            <g id="nurseStation">
              <rect x="8" y="64" width="36" height="24" fill="#181514" stroke="#60a5fa" strokeWidth="1" rx="1.5" />
              <text x="26" y="72" fill="#60a5fa" fontSize="2.8" fontWeight="bold" textAnchor="middle">NURSE STATION</text>
              
              {/* Curved Counter Desk */}
              <path d="M 14 76 Q 26 82 38 76" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="22" y="78" width="8" height="3" fill="#1e293b" stroke="#60a5fa" strokeWidth="0.4" />
            </g>

            {/* --- ROOM 5: CARDIAC WARD (South East) --- */}
            <g id="cardiacWard">
              <rect x="48" y="64" width="44" height="24" fill="#16181b" stroke="#475569" strokeWidth="1" rx="1.5" />
              <text x="70" y="72" fill="#cbd5e1" fontSize="2.8" fontWeight="bold" textAnchor="middle">CARDIAC WARD</text>

              {/* Beds */}
              <rect x="52" y="76" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
              <rect x="60" y="76" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
              <rect x="68" y="76" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
              <rect x="76" y="76" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
              <rect x="84" y="76" width="5" height="8" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
            </g>

            {/* --- STAIRWELL & ELEVATOR SHAFTS --- */}
            {/* North Stairwell */}
            <g id="stairwell">
              <rect x="8" y="12" width="6" height="12" fill="#1e1b1b" stroke="#ef4444" strokeWidth="0.8" />
              <line x1="8" y1="15" x2="14" y2="15" stroke="#64748b" strokeWidth="0.5" />
              <line x1="8" y1="18" x2="14" y2="18" stroke="#64748b" strokeWidth="0.5" />
              <line x1="8" y1="21" x2="14" y2="21" stroke="#64748b" strokeWidth="0.5" />
              <text x="11" y="23" fill="#ef4444" fontSize="1.8" textAnchor="middle">STAIRS</text>
            </g>

            {/* Elevator Shaft */}
            <g id="elevator">
              <rect x="46" y="47" width="8" height="14" fill="#090d16" stroke="#38bdf8" strokeWidth="0.8" />
              <line x1="46" y1="47" x2="54" y2="61" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.4" />
              <line x1="54" y1="47" x2="46" y2="61" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.4" />
              <text x="50" y="55" fill="#38bdf8" fontSize="2" fontWeight="bold" textAnchor="middle">ELEV</text>
            </g>

            {/* --- THERMAL FIRE HEAT GRADIENT diffusion from Room 204 --- */}
            {safetyStatus === 'CRITICAL' && (
              <g className="animate-pulse">
                <circle cx="30" cy="32" r="22" fill="url(#thermalPlume)" />
                <circle cx="30" cy="32" r="10" fill="#ef4444" fillOpacity="0.4" />
              </g>
            )}

            {/* --- REAL-TIME ANIMATED CHEVRON EVACUATION ROUTE PATH --- */}
            {showEvacuation && (
              <g>
                {/* Glowing Egress Path from Room 204 Bed 4 ➔ Corridor ➔ East Exit */}
                <path
                  d="M 28 36 L 25 54 L 88 54"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                  strokeLinecap="round"
                />
                
                {/* Start Origin Pin */}
                <circle cx="28" cy="36" r="3" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.8" />
                <text x="28" y="32" fill="#60a5fa" fontSize="2.2" fontWeight="black" textAnchor="middle">ICU BED 4</text>
                
                {/* Destination Safe Exit Pin */}
                <circle cx="88" cy="54" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" className="animate-bounce" />
                <text x="88" y="48" fill="#34d399" fontSize="2.5" fontWeight="black" textAnchor="middle">SAFE EXIT</text>
              </g>
            )}

          </svg>

          {/* Clickable Overlay Markers (Cameras, Sensors, Equipment, Exits) */}
          
          {/* Cameras */}
          {showCameras && cameras.map((cam) => (
            <button
              key={cam.code}
              onClick={() => setSelectedItem({ type: 'camera', data: cam })}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 transition-all cursor-pointer hover:scale-125 shadow-lg ${
                cam.last_detection?.includes('SMOKE') || cam.last_detection?.includes('FLAME')
                  ? 'bg-red-600 text-white border-yellow-300 animate-ping'
                  : 'bg-stone-900 text-cyan-400 border-cyan-400'
              }`}
              style={{ left: `${cam.x_position}%`, top: `${cam.y_position}%` }}
              title={cam.name}
            >
              <Video className="w-4 h-4" />
            </button>
          ))}

          {/* Equipment Passports */}
          {showEquipment && equipment.map((eq) => (
            <button
              key={eq.passport_id}
              onClick={() => setSelectedItem({ type: 'equipment', data: eq })}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-blue-900/90 text-blue-200 border-2 border-blue-400 transition-all cursor-pointer hover:scale-125 shadow-xl"
              style={{ left: `${eq.x_position}%`, top: `${eq.y_position}%` }}
              title={eq.equipment_type}
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          ))}

          {/* Emergency Exits */}
          {showExits && exits.map((ex) => (
            <button
              key={ex.code}
              onClick={() => setSelectedItem({ type: 'exit', data: ex })}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer hover:scale-110 shadow-2xl ${
                ex.status === 'BLOCKED'
                  ? 'bg-red-950 text-red-400 border-red-600 line-through'
                  : 'bg-emerald-600 text-white border-emerald-300 animate-pulse'
              }`}
              style={{ left: `${ex.x_position}%`, top: `${ex.y_position}%` }}
            >
              🚪 {ex.name}
            </button>
          ))}

          {/* Auto-Zoom Active Emergency Banner Overlay */}
          {safetyStatus === 'CRITICAL' && (
            <div className="absolute top-4 left-4 bg-red-950/95 border-2 border-red-500 p-4 rounded-2xl shadow-2xl text-white text-xs font-extrabold space-y-1.5 z-20">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>ACTIVE FIRE ZONE HIGHLIGHTED</span>
              </div>
              <div className="text-stone-200">ICU Bed 4 &bull; Camera CAM-201 Active &bull; Smoke Plume 320°C</div>
            </div>
          )}

        </div>

      </div>

      {/* Selected Item Inspector Popup */}
      {selectedItem && (
        <div className="bg-stone-950 p-4 rounded-2xl border-2 border-stone-800 flex items-center justify-between gap-4 animate-in fade-in duration-200 shadow-2xl">
          <div className="space-y-1 text-sm">
            <div className="font-black text-amber-400 uppercase text-xs tracking-wider">
              SELECTED {selectedItem.type.toUpperCase()}: {selectedItem.data.code || selectedItem.data.passport_id}
            </div>
            <div className="text-white font-bold">
              Location: {selectedItem.data.location || selectedItem.data.name} &bull; Status: <span className="text-emerald-400 font-extrabold">{selectedItem.data.status}</span>
            </div>
            {selectedItem.data.last_detection && (
              <div className="text-orange-400 font-extrabold text-xs">
                Vision Detection: {selectedItem.data.last_detection} (Confidence: {selectedItem.data.confidence * 100}%)
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedItem(null)}
            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-black hover:bg-stone-700 cursor-pointer border border-stone-700"
          >
            Close
          </button>
        </div>
      )}

        </div>
      )}

    </div>
  );
};
