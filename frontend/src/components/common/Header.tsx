import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useSafetyBrain } from '../../context/SafetyBrainContext';
import { Eye, Volume2, VolumeX, Sun, Moon, Sparkles, AlertTriangle } from 'lucide-react';
import type { Language } from '../../types';

export const Header: React.FC = () => {
  const { 
    isEasyMode, setIsEasyMode, 
    textSize, setTextSize, 
    isHighContrast, setIsHighContrast, 
    isVoiceEnabled, setIsVoiceEnabled, 
    language, setLanguage, 
    speakText 
  } = useAccessibility();

  const { safetyStatus, setIsEmergencyModalOpen } = useSafetyBrain();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-0.5 shadow-lg shadow-red-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Eye className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-wider text-white font-heading">FLAREYE</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">AI BRAIN</span>
            </div>
          </div>
        </div>

        {/* 5-Second Clarity Safety Indicator */}
        <div className="flex items-center gap-2">
          {safetyStatus === 'SAFE' && (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 font-bold shadow-lg shadow-emerald-500/10">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-base sm:text-lg">🟢 HOSPITAL SAFE</span>
            </div>
          )}
          {safetyStatus === 'WARNING' && (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-400 font-bold shadow-lg shadow-amber-500/10">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-base sm:text-lg">🟡 SAFETY WARNING</span>
            </div>
          )}
          {safetyStatus === 'CRITICAL' && (
            <button 
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-red-600 border-2 border-red-400 text-white font-black text-base sm:text-lg shadow-xl shadow-red-600/40 hover:bg-red-500 transition-all animate-bounce"
            >
              <AlertTriangle className="w-6 h-6 text-white" />
              <span>🔴 EMERGENCY DETECTED</span>
            </button>
          )}
        </div>

        {/* Accessibility & Elderly Mode Controls Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Easy Mode Toggle - Highlighted for Elderly Users */}
          <button
            onClick={() => {
              const newMode = !isEasyMode;
              setIsEasyMode(newMode);
              speakText(newMode ? "Easy Mode Enabled" : "Standard Mode Active");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black border-2 transition-all cursor-pointer shadow-lg ${
              isEasyMode 
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-amber-500/40 animate-pulse' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isEasyMode ? '⚡ EASY MODE ON' : '⚡ EASY MODE'}</span>
          </button>

          {/* Text Size Resizer for Senior Citizens */}
          <div className="flex items-center bg-stone-900 rounded-xl p-1 border-2 border-stone-700">
            <button
              onClick={() => setTextSize('small')}
              className={`px-3 py-1 rounded-lg text-sm font-black ${textSize === 'small' ? 'bg-orange-500 text-white' : 'text-stone-300'}`}
              title="Small Text"
            >
              A-
            </button>
            <button
              onClick={() => setTextSize('normal')}
              className={`px-3 py-1 rounded-lg text-sm font-black ${textSize === 'normal' ? 'bg-orange-500 text-white' : 'text-stone-300'}`}
              title="Normal Text"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-3 py-1 rounded-lg text-sm font-black ${textSize === 'large' ? 'bg-orange-500 text-white shadow-md' : 'text-amber-400 font-extrabold'}`}
              title="Large Text for Elderly Users"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
              isHighContrast ? 'bg-white text-black border-white' : 'bg-stone-900 text-white border-stone-700 hover:bg-stone-800'
            }`}
            title="High Contrast Mode"
          >
            {isHighContrast ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Voice Assistance */}
          <button
            onClick={() => {
              const newVoice = !isVoiceEnabled;
              setIsVoiceEnabled(newVoice);
              if (newVoice) speakText("Voice Assistant Activated");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-extrabold border-2 cursor-pointer ${
              isVoiceEnabled ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30' : 'bg-stone-900 text-stone-300 border-stone-700'
            }`}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
            <span className="hidden sm:inline">{isVoiceEnabled ? '🔊 VOICE' : 'MUTED'}</span>
          </button>

          {/* Language Switcher */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-stone-900 text-white text-xs font-extrabold px-3 py-2 rounded-xl border-2 border-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Hindi">हिंदी (Hindi)</option>
          </select>

        </div>

      </div>
    </header>
  );
};
