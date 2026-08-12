import { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { SafetyBrainProvider, useSafetyBrain } from './context/SafetyBrainContext';
import { Header } from './components/common/Header';
import { AnimatedFireBackground } from './components/common/AnimatedFireBackground';
import { LandingPage } from './components/landing/LandingPage';
import { SafetyHeader } from './components/dashboard/SafetyHeader';
import { EmergencyCommandOverlay } from './components/dashboard/EmergencyCommandOverlay';
import { DigitalTwin2D } from './components/dashboard/DigitalTwin2D';
import { DigitalTwin3D } from './components/dashboard/DigitalTwin3D';
import { AICopilotPanel } from './components/dashboard/AICopilotPanel';
import { EvacuationPlanner } from './components/dashboard/EvacuationPlanner';
import { ARModeOverlay } from './components/dashboard/ARModeOverlay';

import { Home, Map, Box, Bot, Smartphone, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

const MainCommandCenter: React.FC = () => {
  const { activeTab, setActiveTab, startDemo } = useSafetyBrain();

  // Streamlined 5 Core Essential Tabs
  const coreTabs = [
    { id: 'dashboard', label: '🔥 Command Center', shortLabel: '🔥 Dashboard', icon: Home },
    { id: 'map2d', label: '🗺️ 2D Blueprint', shortLabel: '🗺️ 2D Map', icon: Map },
    { id: 'map3d', label: '🏢 3D Digital Twin', shortLabel: '🏢 3D Twin', icon: Box },
    { id: 'arMode', label: '📱 AR Directions & HUD', shortLabel: '📱 AR HUD', icon: Smartphone },
    { id: 'copilot', label: '🤖 AI Safety Copilot', shortLabel: '🤖 AI Copilot', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-stone-950/95 text-stone-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Application-Produced Animated Fire Canvas Background */}
      <AnimatedFireBackground intensity="medium" />

      {/* Top Header */}
      <Header />

      {/* 100% Free Open Access & Small Navigation Tabs Bar */}
      <div className="bg-stone-900/90 border-b border-orange-500/30 px-4 py-2.5 backdrop-blur-md sticky top-[65px] z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Compact Small Tabs Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {coreTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/40 border border-orange-400/50 scale-105'
                    : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* 100% Free Open Access Indicator Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% FREE FOR ALL HOSPITALS & USERS</span>
          </div>

        </div>
      </div>

      {/* Main Command Center Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="text-[11px] font-black text-amber-500/90 uppercase tracking-wider px-1 pb-2 border-b border-stone-800 flex items-center justify-between">
              <span>CORE MODULE TABS</span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[9px]">5 MODULES</span>
            </div>

            <nav className="space-y-1.5">
              {coreTabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/30 border border-orange-400/40'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80 border border-transparent'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="bg-gradient-to-br from-stone-900 via-red-950 to-stone-900 border border-red-500/40 p-4 rounded-2xl space-y-2 text-xs shadow-xl">
            <div className="font-extrabold text-white uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>LIVE EMERGENCY SIMULATOR</span>
            </div>
            <p className="text-stone-300 font-medium">
              Simulate an active fire alarm to test AR evacuation and AI copilot routes.
            </p>
            <button
              onClick={startDemo}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>SIMULATE FIRE ALARM</span>
            </button>
          </div>

        </aside>

        {/* Center Dynamic Content Dashboard Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Safety Status Bar */}
          <SafetyHeader />

          {/* Core Tab Views */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <DigitalTwin2D />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EvacuationPlanner />
                <AICopilotPanel />
              </div>
            </div>
          )}

          {activeTab === 'map2d' && <DigitalTwin2D />}
          {activeTab === 'map3d' && <DigitalTwin3D />}
          {activeTab === 'arMode' && (
            <div className="space-y-6">
              <ARModeOverlay />
              <EvacuationPlanner />
            </div>
          )}
          {activeTab === 'copilot' && <AICopilotPanel />}

        </main>

      </div>

      {/* Emergency Modal */}
      <EmergencyCommandOverlay />

    </div>
  );
};

function AppContent() {
  const [view, setView] = useState<'landing' | 'command'>('landing');
  const { setActiveTab } = useSafetyBrain();

  return (
    <>
      {view === 'landing' ? (
        <LandingPage
          onEnterCommandCenter={(tab?: string) => {
            if (tab) setActiveTab(tab);
            setView('command');
          }}
          onWatchDemo={() => {
            setActiveTab('arMode');
            setView('command');
          }}
        />
      ) : (
        <MainCommandCenter />
      )}
    </>
  );
}

export function App() {
  return (
    <AccessibilityProvider>
      <SafetyBrainProvider>
        <AppContent />
      </SafetyBrainProvider>
    </AccessibilityProvider>
  );
}

export default App;
