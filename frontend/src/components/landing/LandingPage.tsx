import React, { useState } from 'react';
import { 
  Eye, Navigation, Bot, ArrowRight, Box, Smartphone, CheckCircle2, 
  Search, Calendar, User, ShieldAlert, DoorClosed, Sparkles, ChevronRight, Volume2, Sun 
} from 'lucide-react';
import { AnimatedFireBackground } from '../common/AnimatedFireBackground';
import { useAccessibility } from '../../context/AccessibilityContext';

interface LandingPageProps {
  onEnterCommandCenter: (tab?: string) => void;
  onWatchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterCommandCenter }) => {
  const [activeCategory, setActiveCategory] = useState<string>('arMode');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { isEasyMode, setIsEasyMode, setTextSize, setIsHighContrast, isVoiceEnabled, setIsVoiceEnabled, speakText } = useAccessibility();

  // Top Category Symbol items matching reference layout with high contrast
  const categories = [
    { id: 'map2d', label: 'Vision AI', symbol: Eye, tab: 'map2d' },
    { id: 'map3d', label: '3D Digital Twin', symbol: Box, tab: 'map3d' },
    { id: 'arMode', label: 'AR Field HUD', symbol: Smartphone, tab: 'arMode' },
    { id: 'evacuation', label: 'Evacuation', symbol: Navigation, tab: 'dashboard' },
    { id: 'copilot', label: 'AI Copilot', symbol: Bot, tab: 'copilot' },
    { id: 'exits', label: 'Emergency Exits', symbol: DoorClosed, tab: 'arMode' },
    { id: 'equipment', label: 'Fire Equipment', symbol: ShieldAlert, tab: 'dashboard' },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Application-Produced Animated Fire Canvas Background */}
      <AnimatedFireBackground intensity="high" />

      {/* Top Navbar */}
      <nav className="max-w-7xl w-full mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 z-10 border-b border-stone-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-0.5 shadow-lg shadow-red-500/30">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <Eye className="w-7 h-7 text-red-500 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black tracking-wider text-white font-heading">FLAREYE</span>
            <span className="ml-2 text-xs font-black px-3 py-1 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
              100% FREE ACCESSIBLE PLATFORM
            </span>
          </div>
        </div>

        {/* Elderly Accessibility Quick Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newMode = !isEasyMode;
              setIsEasyMode(newMode);
              speakText(newMode ? "Easy Mode Activated" : "Standard Mode Active");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer shadow-lg ${
              isEasyMode ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-amber-500/40' : 'bg-stone-900 text-amber-300 border-amber-500/40 hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isEasyMode ? '⚡ EASY MODE ON' : '⚡ EASY MODE'}</span>
          </button>

          <button
            onClick={() => setTextSize('large')}
            className="px-3.5 py-2.5 rounded-xl bg-stone-900 border-2 border-stone-700 text-amber-300 text-sm font-black hover:border-orange-500 cursor-pointer"
            title="Large Font Size"
          >
            A+ LARGE TEXT
          </button>

          <button
            onClick={() => {
              const newV = !isVoiceEnabled;
              setIsVoiceEnabled(newV);
              if (newV) speakText("Voice Guidance On");
            }}
            className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
              isVoiceEnabled ? 'bg-blue-600 text-white border-blue-400' : 'bg-stone-900 text-stone-300 border-stone-700'
            }`}
            title="Toggle Voice Assistance"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsHighContrast(true)}
            className="p-2.5 rounded-xl bg-stone-900 border-2 border-stone-700 text-white hover:bg-stone-800 cursor-pointer"
            title="High Contrast Mode"
          >
            <Sun className="w-5 h-5 text-amber-400" />
          </button>
        </div>

        <button
          onClick={() => onEnterCommandCenter()}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-base shadow-xl shadow-red-600/40 hover:scale-105 transition-all cursor-pointer border-2 border-orange-400/50 min-h-[52px]"
        >
          <span>OPEN SAFETY COMMAND CENTER</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </nav>

      {/* Main Hero Container Card (Elderly Accessible Styling) */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 z-10 my-auto">
        
        {/* Outer Rounded Hero Card Frame */}
        <div className="w-full rounded-[28px] sm:rounded-[36px] border-2 border-stone-800 shadow-2xl overflow-hidden relative bg-stone-950/90 backdrop-blur-md min-h-[540px] sm:min-h-[600px] p-6 sm:p-12 flex flex-col justify-between">
          
          {/* Subtle Radial Atmosphere Lighting */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-orange-600/15 via-red-600/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Top Header Section inside Hero Card */}
          <div className="space-y-6 z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 border-2 border-orange-500/50 text-amber-300 font-extrabold text-sm shadow-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>EASY-TO-USE HOSPITAL FIRE SAFETY BRAIN</span>
            </div>

            {/* Headline with High Legibility Typography */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-heading leading-[1.08] tracking-tight drop-shadow-xl">
              Hospital Fire Safety. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-orange-400">
                Reimagined.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-100 font-extrabold max-w-xl leading-relaxed">
              A clear, accessible safety platform fusing CCTV vision, IoT sensors, 3D building models, and AR field evacuation guidance.
            </p>
          </div>

          {/* Center Floating Translucent Glass Command / Search Bar (Elderly High Contrast & Large Targets) */}
          <div className="my-8 z-10">
            <div className="bg-slate-900/90 backdrop-blur-xl border-2 border-white/20 p-3 sm:p-3.5 rounded-2xl sm:rounded-full shadow-2xl flex flex-wrap items-center justify-between gap-4 max-w-4xl w-full mx-auto min-h-[64px]">
              
              {/* Search Field */}
              <div className="flex items-center gap-3 px-4 py-2 flex-1 min-w-[220px]">
                <Search className="w-6 h-6 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, cameras, ICU rooms..."
                  className="bg-transparent text-white placeholder-stone-300 text-base font-bold focus:outline-none w-full"
                />
              </div>

              {/* Floor Filter Pill */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 border-l-2 border-white/20 text-white text-sm font-extrabold">
                <Calendar className="w-5 h-5 text-orange-400" />
                <span>Floor 2 (ICU)</span>
              </div>

              {/* Patient Mobility Filter Pill */}
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 border-l-2 border-white/20 text-white text-sm font-extrabold">
                <User className="w-5 h-5 text-emerald-400" />
                <span>1 ICU, 2 Stretchers</span>
              </div>

              {/* White Action Pill Button - Large Touch Target for Senior Citizens */}
              <button
                onClick={() => onEnterCommandCenter()}
                className="px-8 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-950 font-black text-base shadow-xl transition-all hover:scale-105 cursor-pointer flex items-center gap-2.5 shrink-0 ml-auto min-h-[52px]"
              >
                <span>Search</span>
                <ArrowRight className="w-5 h-5 text-stone-950 stroke-[3]" />
              </button>

            </div>
          </div>

          {/* Bottom "Top categories" Symbol Icon Strip (Elderly High Legibility) */}
          <div className="z-10 pt-4 space-y-4 border-t-2 border-white/15">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
                Top categories
              </h2>
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-400 bg-emerald-950/50 px-3.5 py-1.5 rounded-xl border border-emerald-500/40">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>100% Free & Accessible</span>
              </div>
            </div>

            {/* Horizontal Line-Art Category Symbol Icons Row */}
            <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto pb-3 scrollbar-none">
              {categories.map((cat) => {
                const IconComponent = cat.symbol;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      onEnterCommandCenter(cat.tab);
                    }}
                    className={`group flex flex-col items-center gap-2 cursor-pointer transition-all shrink-0 pb-1 ${
                      isActive ? 'text-white scale-105' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <div className={`p-3.5 rounded-2xl transition-all border-2 ${
                      isActive ? 'bg-white/20 text-white border-white shadow-lg' : 'border-stone-800 group-hover:bg-white/10 group-hover:border-stone-600'
                    }`}>
                      <IconComponent className="w-7 h-7 stroke-[2.2]" />
                    </div>

                    <span className="text-sm font-extrabold whitespace-nowrap text-stone-100">
                      {cat.label}
                    </span>

                    {/* Active State Underline Indicator matching reference UI */}
                    {isActive ? (
                      <div className="w-8 h-1 bg-white rounded-full shadow-lg shadow-white/80" />
                    ) : (
                      <div className="w-8 h-1 bg-transparent" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => onEnterCommandCenter()}
                className="flex items-center justify-center p-3.5 rounded-full bg-stone-900 border-2 border-stone-700 text-white hover:bg-stone-800 transition-all shrink-0 ml-2 cursor-pointer"
                title="View All Modules"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-5 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-sm font-extrabold text-stone-300 z-10">
        <div>
          FLAREYE &bull; Accessible Hospital Fire Safety Intelligence Platform
        </div>
        <div className="text-emerald-400 font-black">
          100% Free & Accessible for All Senior Citizens & Staff
        </div>
      </footer>

    </div>
  );
};
