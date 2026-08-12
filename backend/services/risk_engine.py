from typing import Dict, Any, List

class SafetyRiskEngine:
    """
    Computes Safety Risk Score (0-100) based on fire probability, smoke density,
    temp anomaly, crowd density, exit obstruction, and sensitivity of area (ICU/Oxygen).
    Provides plain-language explanations.
    """
    def calculate_risk(
        self,
        fire_prob: float,
        smoke_prob: float,
        temp_celsius: float,
        people_count: int,
        exit_blocked: bool,
        is_icu_or_oxygen_wing: bool
    ) -> Dict[str, Any]:
        
        base_risk = (fire_prob * 45) + (smoke_prob * 25)
        
        if temp_celsius > 50:
            base_risk += 15
        elif temp_celsius > 38:
            base_risk += 8
            
        if exit_blocked:
            base_risk += 15
            
        if is_icu_or_oxygen_wing:
            base_risk *= 1.2
            
        score = round(min(100.0, max(0.0, base_risk)), 1)
        
        if score >= 75.0:
            status = "CRITICAL"
        elif score >= 45.0:
            status = "HIGH RISK"
        elif score >= 20.0:
            status = "WARNING"
        else:
            status = "SAFE"

        # Plain language explainability for elderly administrators
        rationale_parts = []
        if fire_prob > 0.5 or smoke_prob > 0.5:
            rationale_parts.append("Smoke and flame detected near the ward corridor")
        if exit_blocked:
            rationale_parts.append("the primary emergency exit is currently obstructed")
        if is_icu_or_oxygen_wing:
            rationale_parts.append("the area is close to high-sensitivity ICU / Oxygen storage facilities")
        if temp_celsius > 45:
            rationale_parts.append(f"ambient temperature has risen to {temp_celsius}°C")
            
        if rationale_parts:
            rationale = "Risk is high because " + " and ".join(rationale_parts) + "."
        else:
            rationale = "Hospital environment is operating normally with all safety systems functional."

        factors = []
        factors.append(f"Fire Probability: {int(fire_prob*100)}%")
        factors.append(f"Smoke Density: {int(smoke_prob*100)}%")
        factors.append(f"Temperature: {temp_celsius}°C")
        factors.append(f"People in Zone: {people_count}")
        factors.append(f"Exit Obstructed: {'YES' if exit_blocked else 'NO'}")
        factors.append(f"ICU Proximity: {'CRITICAL' if is_icu_or_oxygen_wing else 'STANDARD'}")

        return {
            "overall_score": score,
            "status": status,
            "rationale": rationale,
            "breakdown": {
                "fire_factor": round(fire_prob * 45, 1),
                "smoke_factor": round(smoke_prob * 25, 1),
                "temperature_factor": 15 if temp_celsius > 50 else (8 if temp_celsius > 38 else 0),
                "obstruction_factor": 15 if exit_blocked else 0,
                "sensitivity_multiplier": 1.2 if is_icu_or_oxygen_wing else 1.0
            },
            "factors": factors
        }

safety_risk_engine = SafetyRiskEngine()
