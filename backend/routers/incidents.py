from fastapi import APIRouter
from services.ai_verification import ai_verification_engine
from services.risk_engine import safety_risk_engine

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

@router.get("/active")
async def get_active_incident():
    # Return active incident mock or current state
    verification = ai_verification_engine.calculate_verification(
        cctv_smoke_prob=0.94,
        cctv_flame_prob=0.96,
        temp_celsius=68.4,
        smoke_ppm=320.0,
        nearby_cam_confirm=True,
        crowd_density=17
    )
    
    risk = safety_risk_engine.calculate_risk(
        fire_prob=0.96,
        smoke_prob=0.94,
        temp_celsius=68.4,
        people_count=17,
        exit_blocked=True,
        is_icu_or_oxygen_wing=True
    )
    
    return {
        "id": 1,
        "incident_number": "INC-2026-0811-01",
        "title": "🔥 CONFIRMED FIRE EVENT - FLOOR 2 ICU CORRIDOR",
        "floor_id": 2,
        "floor_number": 2,
        "location": "Floor 2 — ICU Corridor near Room 204",
        "severity": "CRITICAL",
        "confidence": verification["confidence_pct"],
        "risk_score": risk["overall_score"],
        "status": "ACTIVE",
        "rationale": risk["rationale"],
        "reasons": verification["reasons"],
        "people_nearby": 17,
        "safest_exit": "EAST RAMP EMERGENCY EXIT",
        "blocked_exit": "NORTH ICU EXIT",
        "is_simulation": False,
        "created_at": "2026-08-11 14:32:10"
    }

@router.get("/evidence")
async def get_evidence_vault():
    return [
        {
            "id": 101,
            "incident_number": "INC-2026-0811-01",
            "camera_code": "CAM-201",
            "camera_name": "ICU Room 204 Corridor",
            "timestamp": "2026-08-11 14:32:10",
            "media_type": "IMAGE_ANNOTATED",
            "ai_confidence": 96.4,
            "detected_labels": ["SMOKE_DENSE (94%)", "FLAME_CORE (96%)", "OBSTRUCTED_EXIT (91%)"],
            "sensor_telemetry": {"temp": "68.4°C", "smoke": "320 ppm"},
            "snapshot_url": "/assets/evidence_cam201.png"
        },
        {
            "id": 102,
            "incident_number": "INC-2026-0811-01",
            "camera_code": "CAM-202",
            "camera_name": "ICU Central Station",
            "timestamp": "2026-08-11 14:32:14",
            "media_type": "IMAGE_ANNOTATED",
            "ai_confidence": 94.2,
            "detected_labels": ["FLAME_SPECTRUM (94%)"],
            "sensor_telemetry": {"temp": "62.1°C", "smoke": "280 ppm"},
            "snapshot_url": "/assets/evidence_cam202.png"
        }
    ]

@router.get("/timeline")
async def get_incident_timeline():
    return [
        {"time": "14:31:05", "title": "Corridor Obstruction Flagged", "desc": "Medical trolley detected blocking North ICU Exit.", "severity": "WARNING"},
        {"time": "14:32:00", "title": "Optical Smoke Pattern Detected", "desc": "Camera CAM-201 detected dense optical smoke pattern.", "severity": "HIGH"},
        {"time": "14:32:04", "title": "Thermal Flame Verified", "desc": "CAM-202 cross-confirmed thermal flame spectrum near Room 204.", "severity": "CRITICAL"},
        {"time": "14:32:08", "title": "IoT Temp Spike 68.4°C", "desc": "Sensor SEN-202 triggered alarm state.", "severity": "CRITICAL"},
        {"time": "14:32:10", "title": "Safety Risk Score: 94 / 100", "desc": "AI Multi-Modal Fusion Engine confirmed high-risk fire event.", "severity": "CRITICAL"},
        {"time": "14:32:12", "title": "Emergency Voice Alert Broadcasted", "desc": "Automated multilingual voice announcement initiated.", "severity": "CRITICAL"},
        {"time": "14:32:15", "title": "Dynamic Wheelchair Evacuation Route Active", "desc": "Route updated to East Ramp Emergency Exit.", "severity": "CRITICAL"}
    ]
