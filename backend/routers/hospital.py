from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas import HospitalResponse, FloorDetails

router = APIRouter(prefix="/api/hospital", tags=["hospital"])

@router.get("/status")
async def get_hospital_status():
    return {
        "name": "Apollo Emergency & Specialty Hospital",
        "code": "APOLLO-BLR-01",
        "total_floors": 4,
        "safety_status": "SAFE",
        "safety_score": 98.0,
        "active_incidents": 0,
        "cameras_online": 47,
        "sensors_online": 84,
        "fire_equipment_count": 112
    }

@router.get("/floors", response_model=list[FloorDetails])
async def get_hospital_floors():
    # Mock return for initial quick response
    return [
        {
            "id": 1,
            "floor_number": 1,
            "name": "Ground Floor - Emergency & Reception",
            "risk_level": "LOW",
            "risk_score": 8.0,
            "people_count": 42,
            "cameras": [
                {"code": "CAM-101", "name": "Main Entrance", "location": "Ground Reception", "x_position": 20.0, "y_position": 80.0, "status": "ONLINE", "confidence": 0.99},
                {"code": "CAM-102", "name": "ER Triage Corridor", "location": "ER Hall", "x_position": 55.0, "y_position": 50.0, "status": "ONLINE", "confidence": 0.98}
            ],
            "sensors": [
                {"code": "SEN-101", "sensor_type": "TEMPERATURE", "location": "ER Reception", "x_position": 22.0, "y_position": 78.0, "value": 24.5, "status": "NORMAL"},
                {"code": "SEN-102", "sensor_type": "SMOKE", "location": "ER Corridor", "x_position": 54.0, "y_position": 48.0, "value": 12.0, "status": "NORMAL"}
            ],
            "equipment": [
                {"passport_id": "EXT-101", "equipment_type": "CO2 Extinguisher", "location": "ER Entrance", "x_position": 18.0, "y_position": 82.0, "last_inspected": "2026-07-20", "next_inspection": "2026-09-20", "status": "AVAILABLE", "qr_code": "QR-EXT-101"}
            ],
            "exits": [
                {"code": "EXIT-G1", "name": "Main Glass Emergency Exit", "location": "Ground Main Entrance", "x_position": 10.0, "y_position": 85.0, "is_accessible": True, "status": "SAFE", "distance_meters": 15.0}
            ]
        },
        {
            "id": 2,
            "floor_number": 2,
            "name": "Floor 2 - ICU & Cardiac Wing",
            "risk_level": "HIGH",
            "risk_score": 94.0,
            "people_count": 17,
            "cameras": [
                {"code": "CAM-201", "name": "ICU Room 204 Corridor", "location": "ICU North Hallway", "x_position": 35.0, "y_position": 30.0, "status": "ONLINE", "confidence": 0.94, "last_detection": "SMOKE_DENSE"},
                {"code": "CAM-202", "name": "ICU Central Station", "location": "ICU Center", "x_position": 50.0, "y_position": 50.0, "status": "ONLINE", "confidence": 0.96, "last_detection": "FLAME_CORE"},
                {"code": "CAM-203", "name": "East Wing Elevator Hall", "location": "East Hallway", "x_position": 80.0, "y_position": 45.0, "status": "ONLINE", "confidence": 0.99, "last_detection": "CLEAR_CORRIDOR"}
            ],
            "sensors": [
                {"code": "SEN-201", "sensor_type": "SMOKE", "location": "ICU Corridor", "x_position": 34.0, "y_position": 28.0, "value": 320.0, "status": "ALARM"},
                {"code": "SEN-202", "sensor_type": "TEMPERATURE", "location": "Room 204", "x_position": 36.0, "y_position": 32.0, "value": 68.4, "status": "ALARM"},
                {"code": "SEN-203", "sensor_type": "OXYGEN", "location": "ICU Gas Line", "x_position": 55.0, "y_position": 52.0, "value": 20.9, "status": "NORMAL"}
            ],
            "equipment": [
                {"passport_id": "EXT-204", "equipment_type": "CO2 Extinguisher", "location": "ICU Station 2", "x_position": 48.0, "y_position": 48.0, "last_inspected": "2026-07-10", "next_inspection": "2026-09-10", "status": "AVAILABLE", "qr_code": "QR-EXT-204"},
                {"passport_id": "DOOR-201", "equipment_type": "Fire Door", "location": "ICU North Door", "x_position": 30.0, "y_position": 25.0, "last_inspected": "2026-06-15", "next_inspection": "2026-08-15", "status": "OPEN", "qr_code": "QR-DOOR-201"}
            ],
            "exits": [
                {"code": "EXIT-2A", "name": "North ICU Exit", "location": "North ICU Corridor", "x_position": 20.0, "y_position": 15.0, "is_accessible": False, "status": "BLOCKED", "distance_meters": 32.0},
                {"code": "EXIT-2B", "name": "East Ramp Emergency Exit", "location": "East ICU Wing", "x_position": 85.0, "y_position": 45.0, "is_accessible": True, "status": "SAFE", "distance_meters": 84.0}
            ]
        },
        {
            "id": 3,
            "floor_number": 3,
            "name": "Floor 3 - Surgical & OT Suites",
            "risk_level": "LOW",
            "risk_score": 15.0,
            "people_count": 28,
            "cameras": [
                {"code": "CAM-301", "name": "OT Suite 1 Entrance", "location": "OT Hall", "x_position": 40.0, "y_position": 40.0, "status": "ONLINE", "confidence": 0.99}
            ],
            "sensors": [
                {"code": "SEN-301", "sensor_type": "TEMPERATURE", "location": "OT Corridor", "x_position": 42.0, "y_position": 42.0, "value": 22.0, "status": "NORMAL"}
            ],
            "equipment": [
                {"passport_id": "EXT-301", "equipment_type": "Water Hose Reel", "location": "OT Lobby", "x_position": 38.0, "y_position": 45.0, "last_inspected": "2026-05-10", "next_inspection": "2026-07-10", "status": "EXPIRED", "qr_code": "QR-EXT-301"}
            ],
            "exits": [
                {"code": "EXIT-3A", "name": "South OT Exit", "location": "South Hallway", "x_position": 50.0, "y_position": 85.0, "is_accessible": True, "status": "SAFE", "distance_meters": 40.0}
            ]
        }
    ]
