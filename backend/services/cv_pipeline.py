from typing import Dict, Any, List

class CVPipelineService:
    """
    Computer Vision Pipeline Service.
    Generates computer vision detection metadata, bounding box annotations,
    YOLO confidence scores, and visual telemetry data for live cameras.
    """
    def __init__(self):
        pass

    def get_camera_detections(self, camera_code: str, is_active_fire: bool = False) -> Dict[str, Any]:
        if camera_code == "CAM-201" and is_active_fire:
            # Active emergency camera
            return {
                "camera_code": camera_code,
                "fps": 30,
                "model_status": "YOLOv8-FIRE ONLINE",
                "detections": [
                    {
                        "label": "SMOKE_DENSE",
                        "confidence": 0.94,
                        "bbox": [140, 80, 420, 290], # x1, y1, x2, y2
                        "color": "#EF4444" # Red
                    },
                    {
                        "label": "FLAME_CORE",
                        "confidence": 0.96,
                        "bbox": [210, 150, 310, 260],
                        "color": "#F97316" # Orange
                    },
                    {
                        "label": "OBSTRUCTED_EXIT_DOOR",
                        "confidence": 0.91,
                        "bbox": [510, 110, 610, 380],
                        "color": "#EAB308" # Yellow
                    },
                    {
                        "label": "PERSON",
                        "confidence": 0.98,
                        "bbox": [60, 220, 120, 380],
                        "color": "#3B82F6" # Blue
                    }
                ],
                "people_count": 17,
                "crowd_density": "HIGH",
                "overall_risk_level": "CRITICAL"
            }
        else:
            # Normal camera feed
            return {
                "camera_code": camera_code,
                "fps": 30,
                "model_status": "YOLOv8-FIRE ONLINE",
                "detections": [
                    {
                        "label": "CLEAR_CORRIDOR",
                        "confidence": 0.99,
                        "bbox": [50, 50, 590, 390],
                        "color": "#22C55E" # Green
                    },
                    {
                        "label": "FIRE_EXTINGUISHER_AVAILABLE",
                        "confidence": 0.97,
                        "bbox": [480, 200, 520, 290],
                        "color": "#3B82F6"
                    }
                ],
                "people_count": 4,
                "crowd_density": "LOW",
                "overall_risk_level": "SAFE"
            }

cv_pipeline_service = CVPipelineService()
