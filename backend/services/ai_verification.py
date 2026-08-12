from typing import Dict, Any

class AIVerificationEngine:
    """
    Multi-Modal Fire Verification Engine
    Fuses CCTV Smoke/Flame probabilities + IoT Temperature/Smoke telemetry + Nearby camera verification + Crowd activity.
    """
    def __init__(self):
        pass

    def calculate_verification(
        self,
        cctv_smoke_prob: float,
        cctv_flame_prob: float,
        temp_celsius: float,
        smoke_ppm: float,
        nearby_cam_confirm: bool,
        crowd_density: int
    ) -> Dict[str, Any]:
        
        # Calculate weighted confidence
        # CCTV Smoke (25%), CCTV Flame (30%), Temp Anomaly (20%), Smoke Sensor (15%), Camera cross-check (10%)
        temp_factor = min(1.0, max(0.0, (temp_celsius - 25.0) / 45.0))
        smoke_sensor_factor = min(1.0, smoke_ppm / 500.0)
        cross_check_factor = 1.0 if nearby_cam_confirm else 0.4
        
        weighted_score = (
            (cctv_smoke_prob * 0.25) +
            (cctv_flame_prob * 0.30) +
            (temp_factor * 0.20) +
            (smoke_sensor_factor * 0.15) +
            (cross_check_factor * 0.10)
        )
        
        confidence_pct = round(weighted_score * 100, 1)
        
        reasons = []
        if cctv_smoke_prob > 0.6:
            reasons.append("✓ CCTV camera detected optical smoke pattern")
        if cctv_flame_prob > 0.6:
            reasons.append("✓ Thermal/Visual flame spectrum detected")
        if temp_celsius > 45.0:
            reasons.append(f"✓ IoT Temperature spike ({temp_celsius}°C detected)")
        if smoke_ppm > 200.0:
            reasons.append(f"✓ Ambient Smoke sensor alarm ({smoke_ppm} ppm)")
        if nearby_cam_confirm:
            reasons.append("✓ Nearby secondary camera cross-confirmed vision signature")
        if crowd_density > 15:
            reasons.append(f"⚠️ High crowd movement detected in evacuation area ({crowd_density} people)")

        status = "CONFIRMED HIGH-RISK EVENT" if confidence_pct >= 75.0 else "UNVERIFIED ANOMALY"
        if confidence_pct < 40.0:
            status = "NORMAL SYSTEM OPERATION"

        return {
            "confidence_pct": confidence_pct,
            "status": status,
            "reasons": reasons,
            "is_confirmed": confidence_pct >= 75.0,
            "inputs": {
                "cctv_smoke": cctv_smoke_prob,
                "cctv_flame": cctv_flame_prob,
                "temperature": temp_celsius,
                "smoke_ppm": smoke_ppm,
                "cross_confirmed": nearby_cam_confirm
            }
        }

ai_verification_engine = AIVerificationEngine()
