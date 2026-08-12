from fastapi import APIRouter

router = APIRouter(prefix="/api/sensors", tags=["sensors"])

@router.get("/list")
async def list_sensors():
    return [
        {"code": "SEN-101", "type": "TEMPERATURE", "floor": 1, "location": "ER Reception", "value": 24.5, "unit": "°C", "status": "NORMAL"},
        {"code": "SEN-201", "type": "SMOKE", "floor": 2, "location": "ICU Room 204 Corridor", "value": 320.0, "unit": "ppm", "status": "ALARM"},
        {"code": "SEN-202", "type": "TEMPERATURE", "floor": 2, "location": "Room 204", "value": 68.4, "unit": "°C", "status": "ALARM"},
        {"code": "SEN-203", "type": "OXYGEN", "floor": 2, "location": "ICU Main Oxygen Line", "value": 20.9, "unit": "%", "status": "NORMAL"},
        {"code": "SEN-301", "type": "TEMPERATURE", "floor": 3, "location": "OT Suite", "value": 22.0, "unit": "°C", "status": "NORMAL"}
    ]
