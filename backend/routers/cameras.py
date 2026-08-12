from fastapi import APIRouter
from services.cv_pipeline import cv_pipeline_service

router = APIRouter(prefix="/api/cameras", tags=["cameras"])

@router.get("/list")
async def list_cameras():
    return [
        {"code": "CAM-101", "name": "Ground Reception", "floor": 1, "status": "ONLINE", "risk": "SAFE"},
        {"code": "CAM-201", "name": "ICU Room 204 Corridor", "floor": 2, "status": "ONLINE", "risk": "CRITICAL", "active_detections": ["SMOKE_DENSE", "FLAME_CORE"]},
        {"code": "CAM-202", "name": "ICU Central Station", "floor": 2, "status": "ONLINE", "risk": "HIGH", "active_detections": ["FLAME_CORE"]},
        {"code": "CAM-203", "name": "East Wing Elevator Hall", "floor": 2, "status": "ONLINE", "risk": "SAFE", "active_detections": ["CLEAR"]},
        {"code": "CAM-301", "name": "OT Suite Entrance", "floor": 3, "status": "ONLINE", "risk": "SAFE"}
    ]

@router.get("/{camera_code}/detections")
async def get_camera_detections(camera_code: str, is_active_fire: bool = False):
    return cv_pipeline_service.get_camera_detections(camera_code, is_active_fire)
