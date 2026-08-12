export type SafetyStatus = 'SAFE' | 'WARNING' | 'CRITICAL';
export type PatientCategory = 'Walking' | 'Wheelchair' | 'Stretcher' | 'ICU';
export type Language = 'English' | 'Tamil' | 'Hindi';

export interface Camera {
  code: string;
  name: string;
  location: string;
  x_position: number;
  y_position: number;
  status: string;
  confidence: number;
  last_detection?: string;
}

export interface Sensor {
  code: string;
  sensor_type: string;
  location: string;
  x_position: number;
  y_position: number;
  value: number;
  status: string;
}

export interface FireEquipment {
  passport_id: string;
  equipment_type: string;
  location: string;
  x_position: number;
  y_position: number;
  last_inspected: string;
  next_inspection: string;
  status: string;
  qr_code: string;
}

export interface EmergencyExit {
  code: string;
  name: string;
  location: string;
  x_position: number;
  y_position: number;
  is_accessible: boolean;
  status: string;
  distance_meters: number;
}

export interface Floor {
  id: number;
  floor_number: number;
  name: string;
  risk_level: string;
  risk_score: number;
  people_count: number;
  cameras: Camera[];
  sensors: Sensor[];
  equipment: FireEquipment[];
  exits: EmergencyExit[];
}

export interface Incident {
  id: number;
  incident_number: string;
  title: string;
  floor_id: number;
  floor_number: number;
  location: string;
  severity: SafetyStatus;
  confidence: number;
  risk_score: number;
  status: string;
  rationale: string;
  reasons?: string[];
  people_nearby: number;
  safest_exit: string;
  blocked_exit: string;
  is_simulation: boolean;
  created_at: string;
}

export interface EvidenceItem {
  id: number;
  incident_number: string;
  camera_code: string;
  camera_name: string;
  timestamp: string;
  media_type: string;
  ai_confidence: number;
  detected_labels: string[];
  sensor_telemetry: { temp: string; smoke: string };
  snapshot_url: string;
}

export interface Waypoint {
  x: number;
  y: number;
  label: string;
}

export interface EvacuationRoute {
  safest_exit: string;
  distance_meters: number;
  status: string;
  avoid_zones: string[];
  reason: string;
  patient_category: PatientCategory;
  waypoints: Waypoint[];
  step_instructions: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  action?: string;
  timestamp: string;
}

export interface DemoStep {
  step: number;
  title: string;
  status: SafetyStatus;
  risk: number;
}
