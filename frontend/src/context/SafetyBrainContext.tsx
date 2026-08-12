import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SafetyStatus, Incident, EvacuationRoute, PatientCategory, DemoStep } from '../types';

interface SafetyBrainContextType {
  safetyStatus: SafetyStatus;
  setSafetyStatus: (status: SafetyStatus) => void;
  overallRiskScore: number;
  activeFloor: number;
  setActiveFloor: (floor: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeIncident: Incident | null;
  setActiveIncident: (inc: Incident | null) => void;
  evacuationRoute: EvacuationRoute | null;
  patientCategory: PatientCategory;
  setPatientCategory: (cat: PatientCategory) => void;
  calculateEvacuation: (category?: PatientCategory) => Promise<void>;
  isDemoRunning: boolean;
  demoStep: number;
  demoSteps: DemoStep[];
  startDemo: () => void;
  nextDemoStep: () => void;
  resetDemo: () => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (val: boolean) => void;
}

const SafetyBrainContext = createContext<SafetyBrainContextType | undefined>(undefined);

export const SafetyBrainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>('SAFE');
  const [overallRiskScore, setOverallRiskScore] = useState<number>(12.0);
  const [activeFloor, setActiveFloor] = useState<number>(2); // Default to Floor 2 ICU
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [patientCategory, setPatientCategory] = useState<PatientCategory>('Wheelchair');
  const [evacuationRoute, setEvacuationRoute] = useState<EvacuationRoute | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // Demo simulation state
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  const demoSteps: DemoStep[] = [
    { step: 1, title: "1. Hospital Operating Normal", status: "SAFE", risk: 12.0 },
    { step: 2, title: "2. Compliance Warning: Obstruction", status: "WARNING", risk: 35.0 },
    { step: 3, title: "3. CCTV Detects Smoke on CAM-201", status: "WARNING", risk: 58.0 },
    { step: 4, title: "4. Multi-Camera Cross-Verification", status: "HIGH RISK" as SafetyStatus, risk: 78.0 },
    { step: 5, title: "5. IoT Sensor Temp Spike to 68°C", status: "CRITICAL", risk: 88.0 },
    { step: 6, title: "6. AI Safety Risk Score: 94 / 100", status: "CRITICAL", risk: 94.0 },
    { step: 7, title: "7. Digital Twin Auto-Zooms to Floor 2", status: "CRITICAL", risk: 94.0 },
    { step: 8, title: "8. North ICU Exit Blocked", status: "CRITICAL", risk: 94.0 },
    { step: 9, title: "9. Dynamic Wheelchair Route Active", status: "CRITICAL", risk: 94.0 },
    { step: 10, title: "10. Voice Alert Broadcasted", status: "CRITICAL", risk: 94.0 },
    { step: 11, "title": "11. Incident INC-2026-0811 Logged", status: "CRITICAL", risk: 94.0 },
    { step: 12, title: "12. Evidence Vault Captured", status: "CRITICAL", risk: 94.0 },
    { step: 13, title: "13. Time Machine Replay Ready", status: "CRITICAL", risk: 94.0 },
    { step: 14, title: "14. PDF Safety Report Export Ready", status: "CRITICAL", risk: 94.0 }
  ];

  const defaultIncident: Incident = {
    id: 1,
    incident_number: "INC-2026-0811-01",
    title: "🔥 CONFIRMED FIRE EVENT - FLOOR 2 ICU CORRIDOR",
    floor_id: 2,
    floor_number: 2,
    location: "Floor 2 — ICU Corridor near Room 204",
    severity: "CRITICAL",
    confidence: 0.964,
    risk_score: 94.0,
    status: "ACTIVE",
    rationale: "Risk is high because smoke and flame were detected near the ICU and the nearest emergency exit is blocked by an improperly stored medical trolley.",
    reasons: [
      "✓ CCTV camera detected optical smoke pattern on CAM-201",
      "✓ Thermal flame spectrum verified on CAM-202",
      "✓ IoT Temperature spike (68.4°C detected)",
      "✓ Ambient Smoke sensor alarm (320 ppm)",
      "⚠️ Primary North Exit corridor blocked"
    ],
    people_nearby: 17,
    safest_exit: "EAST RAMP EMERGENCY EXIT",
    blocked_exit: "NORTH ICU EXIT",
    is_simulation: false,
    created_at: "2026-08-11 14:32:10"
  };

  const [activeIncident, setActiveIncident] = useState<Incident | null>(defaultIncident);

  // Calculate dynamic route from backend API
  const calculateEvacuation = async (category: PatientCategory = patientCategory) => {
    try {
      const res = await fetch('/api/evacuation/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ floor_number: activeFloor, patient_category: category })
      });
      if (res.ok) {
        const data = await res.json();
        setEvacuationRoute(data);
      }
    } catch (err) {
      console.warn("Using fallback route", err);
    }
  };

  useEffect(() => {
    calculateEvacuation(patientCategory);
  }, [patientCategory, activeFloor]);

  // WebSocket live telemetry stream
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;
    let socket: WebSocket | null = null;
    
    try {
      socket = new WebSocket(wsUrl);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'TELEMETRY_UPDATE' && !isDemoRunning) {
          // Live telemetry updates
        }
      };
    } catch (e) {
      // Offline fallback
    }

    return () => {
      socket?.close();
    };
  }, [isDemoRunning]);

  const startDemo = async () => {
    setIsDemoRunning(true);
    setDemoStep(1);
    setSafetyStatus('SAFE');
    setOverallRiskScore(12.0);
    try {
      await fetch('/api/demo/start', { method: 'POST' });
    } catch (e) {}
  };

  const nextDemoStep = () => {
    if (demoStep < demoSteps.length) {
      const nextStepNum = demoStep + 1;
      setDemoStep(nextStepNum);
      const stepData = demoSteps[nextStepNum - 1];
      setSafetyStatus(stepData.status);
      setOverallRiskScore(stepData.risk);

      if (nextStepNum >= 5) {
        setIsEmergencyModalOpen(true);
      }
    }
  };

  const resetDemo = () => {
    setIsDemoRunning(false);
    setDemoStep(0);
    setSafetyStatus('SAFE');
    setOverallRiskScore(12.0);
    setIsEmergencyModalOpen(false);
    try {
      fetch('/api/demo/reset', { method: 'POST' });
    } catch (e) {}
  };

  return (
    <SafetyBrainContext.Provider value={{
      safetyStatus, setSafetyStatus,
      overallRiskScore,
      activeFloor, setActiveFloor,
      activeTab, setActiveTab,
      activeIncident, setActiveIncident,
      evacuationRoute,
      patientCategory, setPatientCategory,
      calculateEvacuation,
      isDemoRunning, demoStep, demoSteps,
      startDemo, nextDemoStep, resetDemo,
      isEmergencyModalOpen, setIsEmergencyModalOpen
    }}>
      {children}
    </SafetyBrainContext.Provider>
  );
};

export const useSafetyBrain = () => {
  const context = useContext(SafetyBrainContext);
  if (!context) throw new Error('useSafetyBrain must be used within SafetyBrainProvider');
  return context;
};
