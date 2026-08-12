import React, { useState, useEffect, useRef } from 'react';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Flame, XCircle, Navigation, Volume2, PhoneCall, AlertTriangle, X, Radio, CheckCircle, Clock } from 'lucide-react';

export const EmergencyCommandOverlay: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, setActiveTab, activeIncident, evacuationRoute, activeFloor } = useSafetyBrain();
  const { speakText, language } = useAccessibility();

  // Announcement state tracking
  const [isAnnouncing, setIsAnnouncing] = useState<boolean>(false);
  const [broadcastTimestamp, setBroadcastTimestamp] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any ongoing speech synthesis or timers when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isEmergencyModalOpen) return null;

  // Extract dynamic values from active state with robust defaults
  const floorNumber = activeIncident?.floor_number || activeFloor || 2;
  const locationText = activeIncident?.location || `Floor ${floorNumber} — ICU Corridor near Room 204`;
  const blockedExitName = activeIncident?.blocked_exit || "NORTH ICU EXIT";
  const safestExitName = activeIncident?.safest_exit || evacuationRoute?.safest_exit || "EAST RAMP EMERGENCY EXIT";
  const distanceMeters = evacuationRoute?.distance_meters || 84;
  const peopleCount = activeIncident?.people_nearby || 17;
  const unsafeReason = activeIncident?.rationale || "Dense smoke & fire plume in corridor";

  // Construct dynamic emergency speech text based on live context
  const constructEmergencyAnnouncement = (): string => {
    if (language === 'Tamil') {
      return `அவசர தீ எச்சரிக்கை! தளம் ${floorNumber}, ${locationText} பகுதியில் தீ விபத்து கண்டறியப்பட்டுள்ளது. புகை மற்றும் ஆபத்து காரணமாக ${blockedExitName} வழியைப் பயன்படுத்த வேண்டாம். உடனடியாக ${safestExitName} வழியைப் பயன்படுத்தவும். இந்த வழி ${distanceMeters} மீட்டர் தொலைவில் பாதுகாப்பாக உள்ளது. அருகில் உள்ள ${peopleCount} நோயாளிகள் மற்றும் ஊழியர்களுக்கு முன்னுரிமை அளிக்கவும்.`;
    }

    if (language === 'Hindi') {
      return `आपातकालीन अग्नि चेतावनी! मंजिल ${floorNumber}, ${locationText} के पास आग का पता चला है। घने धुएं के कारण ${blockedExitName} का उपयोग न करें। कृपया तुरंत ${safestExitName} से बाहर निकलें। यह सबसे सुरक्षित मार्ग है, दूरी ${distanceMeters} मीटर है। पास के ${peopleCount} मरीजों और कर्मचारियों को प्राथमिकता दें।`;
    }

    return `Emergency fire alert. Fire detected on Floor ${floorNumber}, ${locationText}. Please remain calm. Do not use the ${blockedExitName} because of dense smoke and fire. Please evacuate using the ${safestExitName}. The ${safestExitName} is the safest available evacuation route, distance ${distanceMeters} meters. ${peopleCount} patients and staff are nearby. Patients, visitors, and staff requiring assistance should be given immediate priority.`;
  };

  // Handle PA System Audio Announcement
  const handleAnnounceAlert = () => {
    // 1. Feature availability check
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSpeechError("Audio announcement is unavailable on this device. Please use the visual emergency display and manual PA system.");
      return;
    }

    setSpeechError(null);
    const announcementText = constructEmergencyAnnouncement();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
    setBroadcastTimestamp(currentTime);
    setIsAnnouncing(true);

    // Safety timeout in case window.speechSynthesis.onend gets delayed or fails in browser
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAnnouncing(false);
    }, 18000); // 18-second safety fallback

    // 2. Trigger speech synthesis with forceSpeak: true
    speakText(announcementText, {
      forceSpeak: true,
      rate: 0.88, // slightly slower pronunciation for emergency clarity
      pitch: 1.0,
      volume: 1.0,
      onStart: () => {
        setIsAnnouncing(true);
        setSpeechError(null);
      },
      onEnd: () => {
        setIsAnnouncing(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      },
      onError: (err) => {
        console.warn("Speech synthesis notice:", err);
        setIsAnnouncing(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="max-w-4xl w-full bg-slate-900 border-4 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-600/50 space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-2xl text-white animate-bounce">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black tracking-widest text-red-400 uppercase bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
                  SAFETY BRAIN CRITICAL COMMAND MODE
                </span>
                <span className="text-xs font-extrabold tracking-wider text-amber-400 uppercase bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  EMERGENCY PA SIMULATION
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-heading mt-1">
                🚨 FIRE DETECTED — FLOOR {floorNumber}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setIsEmergencyModalOpen(false);
            }}
            className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer"
            title="Close Emergency Modal"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Live PA Announcement Active Indicator Banner */}
        {isAnnouncing && (
          <div className="bg-blue-950/80 border-2 border-blue-500 rounded-2xl p-4 flex items-center justify-between animate-pulse shadow-lg shadow-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                <Radio className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider text-blue-300 uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                  🔊 PA SYSTEM ACTIVE — BROADCASTING EMERGENCY ALERT
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Public Address broadcast active through speakers. Occupants receiving route instructions.
                </div>
              </div>
            </div>
            {broadcastTimestamp && (
              <div className="text-xs font-mono font-bold text-blue-300 bg-blue-900/60 px-3 py-1.5 rounded-lg border border-blue-500/40 flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>Broadcast: {broadcastTimestamp}</span>
              </div>
            )}
          </div>
        )}

        {/* Browser Audio Speech Error Message */}
        {speechError && (
          <div className="bg-amber-950/80 border-2 border-amber-500/80 rounded-2xl p-4 text-amber-200 text-sm font-semibold flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Visual Emergency Display Board (Synchronized with Announcement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="bg-red-950/50 p-5 rounded-2xl border-2 border-red-500/60 flex items-center gap-4">
            <XCircle className="w-12 h-12 text-red-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider">UNSAFE ROUTE</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                🔴 DO NOT USE {blockedExitName}
              </div>
              <div className="text-xs text-red-300 font-semibold mt-0.5">
                Reason: {unsafeReason}
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/50 p-5 rounded-2xl border-2 border-emerald-500/60 flex items-center gap-4">
            <Navigation className="w-12 h-12 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">SAFEST EVACUATION ROUTE</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                🟢 USE {safestExitName}
              </div>
              <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                Distance: {distanceMeters}m &bull; Ramp & Wheelchair Priority
              </div>
            </div>
          </div>

        </div>

        {/* Plain Language Location & People Count Rationale */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              LOCATION & AFFECTED PEOPLE:
            </div>
            <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {locationText} &bull; <span className="text-amber-400">{peopleCount} Patients/Staff Nearby</span>
            </p>
          </div>

          {broadcastTimestamp && (
            <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>PA Broadcast Logged: {broadcastTimestamp}</span>
            </div>
          )}
        </div>

        {/* 64px+ Giant Action Buttons Designed for Emergency Accessibility */}
        <div className="space-y-3 pt-2">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsEmergencyModalOpen(false);
              }}
              className="flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-xl shadow-xl shadow-red-600/40 hover:scale-[1.02] transition-all cursor-pointer min-h-[64px]"
            >
              <Flame className="w-8 h-8" />
              <span>🔥 VIEW FIRE CAMERA</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('evacuation');
                setIsEmergencyModalOpen(false);
              }}
              className="flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xl shadow-xl shadow-emerald-600/40 hover:scale-[1.02] transition-all cursor-pointer min-h-[64px]"
            >
              <Navigation className="w-8 h-8" />
              <span>🧭 SHOW SAFE ROUTE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ANNOUNCE ALERT Button with Dynamic Speech Synthesis & States */}
            <button
              onClick={handleAnnounceAlert}
              disabled={isAnnouncing}
              className={`flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-white font-black text-xl shadow-xl transition-all cursor-pointer min-h-[64px] ${
                isAnnouncing
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 border-2 border-blue-400 animate-pulse shadow-blue-500/60 ring-4 ring-blue-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/40 hover:scale-[1.02]'
              }`}
            >
              <Volume2 className={`w-8 h-8 ${isAnnouncing ? 'animate-bounce text-blue-200' : ''}`} />
              <span>{isAnnouncing ? '🔊 ANNOUNCING...' : '🔊 ANNOUNCE ALERT'}</span>
            </button>

            <button
              onClick={() => {
                alert("Emergency Response Team & Fire Department notified successfully!");
              }}
              className="flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl border-2 border-slate-700 transition-all cursor-pointer min-h-[64px]"
            >
              <PhoneCall className="w-8 h-8 text-amber-400" />
              <span>📞 NOTIFY TEAM</span>
            </button>
          </div>

          {/* PA System Simulation Helper Status Note */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-400 font-medium">
              {isAnnouncing ? (
                <span className="text-blue-400 font-bold animate-pulse">
                  Emergency announcement is being broadcast through the hospital PA simulation.
                </span>
              ) : (
                <span>
                  Clicking <strong>🔊 ANNOUNCE ALERT</strong> simulates a live public address broadcast using browser voice synthesis.
                </span>
              )}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

