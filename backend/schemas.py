from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
import datetime

class HospitalBase(BaseModel):
    name: str
    code: str
    total_floors: int
    safety_status: str
    safety_score: float

class HospitalResponse(HospitalBase):
    id: int
    created_at: datetime.datetime
    class Config:
        from_attributes = True

class CameraBase(BaseModel):
    code: str
    name: str
    location: str
    x_position: float
    y_position: float
    status: str
    confidence: float
    last_detection: Optional[str] = None

class SensorBase(BaseModel):
    code: str
    sensor_type: str
    location: str
    x_position: float
    y_position: float
    value: float
    status: str

class FireEquipmentBase(BaseModel):
    passport_id: str
    equipment_type: str
    location: str
    x_position: float
    y_position: float
    last_inspected: str
    next_inspection: str
    status: str
    qr_code: str

class EmergencyExitBase(BaseModel):
    code: str
    name: str
    location: str
    x_position: float
    y_position: float
    is_accessible: bool
    status: str
    distance_meters: float

class FloorDetails(BaseModel):
    id: int
    floor_number: int
    name: str
    risk_level: str
    risk_score: float
    people_count: int
    cameras: List[CameraBase] = []
    sensors: List[SensorBase] = []
    equipment: List[FireEquipmentBase] = []
    exits: List[EmergencyExitBase] = []

class IncidentBase(BaseModel):
    incident_number: str
    title: str
    floor_id: int
    location: str
    severity: str
    confidence: float
    risk_score: float
    status: str
    rationale: str
    people_nearby: int
    safest_exit: str
    blocked_exit: str
    is_simulation: bool = False

class IncidentResponse(IncidentBase):
    id: int
    created_at: datetime.datetime
    class Config:
        from_attributes = True

class EvacuationRequest(BaseModel):
    floor_number: int
    patient_category: str = "Walking" # Walking, Wheelchair, Stretcher, ICU
    source_location: str = "ICU Room 204"

class EvacuationRouteResponse(BaseModel):
    safest_exit: str
    distance_meters: float
    status: str
    avoid_zones: List[str]
    reason: str
    patient_category: str
    waypoints: List[Dict[str, float]] # [{x: 20, y: 30}, ...]
    step_instructions: List[str]

class RiskAssessmentResponse(BaseModel):
    overall_score: float
    status: str # SAFE, WARNING, CRITICAL
    rationale: str
    breakdown: Dict[str, float]
    factors: List[str]

class CopilotQueryRequest(BaseModel):
    query: str
    language: str = "English" # English, Tamil, Hindi
    floor_context: Optional[int] = 2

class CopilotQueryResponse(BaseModel):
    answer: str
    voice_audio_text: str
    highlight_action: Optional[str] = None # e.g. "ZOOM_FLOOR_2"
    related_exit: Optional[str] = None
    language: str

class SimulationScenarioRequest(BaseModel):
    scenario_type: str # exit_blocked, electrical_fire, smoke_spread
    floor_number: int = 2

class SimulationScenarioResponse(BaseModel):
    scenario_name: str
    timeline: List[Dict[str, Any]] # [{timestamp: "00:00", event: "...", risk: 45}, ...]
    recommended_route: str
    risk_delta: float
    is_simulation: bool = True

class ComplianceSummaryResponse(BaseModel):
    overall_score: float
    extinguishers_pct: float
    exits_pct: float
    fire_doors_pct: float
    corridors_pct: float
    signage_pct: float
    violations: List[Dict[str, Any]]
    recurring_issues: List[Dict[str, Any]]

class SystemHealthResponse(BaseModel):
    ai_engine: str
    database: str
    cameras_online: str
    sensors_online: str
    websocket: str
    gpu_utilization: str
    cpu_usage: str
    memory_usage: str
