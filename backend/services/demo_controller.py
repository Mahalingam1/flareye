from typing import Dict, Any, List

class DemoController:
    """
    Orchestrates the hackathon judge demonstration flow.
    Controls the state of FLAREYE through a 14-step scripted sequence.
    """
    def __init__(self):
        self.is_demo_running = False
        self.current_step = 0
        self.steps = [
            {"step": 1, "title": "Hospital Normal Operating State", "status": "SAFE", "risk": 12.0},
            {"step": 2, "title": "Compliance Warning: Corridor Obstruction Detected", "status": "WARNING", "risk": 35.0},
            {"step": 3, "title": "CCTV Vision Engine Detects Smoke on CAM-201", "status": "WARNING", "risk": 58.0},
            {"step": 4, "title": "Secondary Camera CAM-202 Cross-Confirms Smoke Pattern", "status": "HIGH RISK", "risk": 78.0},
            {"step": 5, "title": "IoT Sensors Register 68°C Temp Spike & 320ppm Smoke", "status": "CRITICAL", "risk": 88.0},
            {"step": 6, "title": "AI Risk Engine Calculates Safety Score: 94 / 100 CRITICAL", "status": "CRITICAL", "risk": 94.0},
            {"step": 7, "title": "Hospital Digital Twin Auto-Zooms to Floor 2 ICU Wing", "status": "CRITICAL", "risk": 94.0},
            {"step": 8, "title": "North ICU Exit Marked BLOCKED by Smoke plume", "status": "CRITICAL", "risk": 94.0},
            {"step": 9, "title": "Dynamic Evacuation Router Calculates SAFEST EXIT: EAST RAMP", "status": "CRITICAL", "risk": 94.0},
            {"step": 10, "title": "Voice Assistant Broadcasts Multilingual Emergency Alert", "status": "CRITICAL", "risk": 94.0},
            {"step": 11, "title": "Incident INC-2026-0811-01 Created & Logged to Database", "status": "CRITICAL", "risk": 94.0},
            {"step": 12, "title": "Evidence Vault Captures Vision Frames & Sensor Telemetry", "status": "CRITICAL", "risk": 94.0},
            {"step": 13, "title": "Incident Time Machine Timeline Generated for Inspection", "status": "CRITICAL", "risk": 94.0},
            {"step": 14, "title": "Automated PDF Emergency Safety Report Ready for Export", "status": "RESOLVING", "risk": 94.0}
        ]

    def get_current_state(self) -> Dict[str, Any]:
        step_info = self.steps[self.current_step - 1] if self.current_step > 0 else self.steps[0]
        return {
            "is_demo_running": self.is_demo_running,
            "current_step": self.current_step,
            "total_steps": len(self.steps),
            "step_details": step_info
        }

demo_controller = DemoController()
