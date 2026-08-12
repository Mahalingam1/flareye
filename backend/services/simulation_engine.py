from typing import Dict, Any, List

class SimulationEngine:
    """
    What-If Emergency Spread Physics Simulator.
    Simulates fire spread, smoke propagation, exit availability, and alternative routing options.
    """
    def run_scenario(self, scenario_type: str, floor_number: int = 2) -> Dict[str, Any]:
        
        if scenario_type == "exit_blocked":
            name = "What-If: Primary ICU Exit Blocked"
            timeline = [
                {"timestamp": "00:00", "event": "Obstruction placed at North ICU Emergency Exit door.", "risk": 25.0, "status": "WARNING"},
                {"timestamp": "00:30", "event": "AI Compliance system flags blocked exit. Fire door sensor fails.", "risk": 48.0, "status": "HIGH RISK"},
                {"timestamp": "01:00", "event": "Simulated heat anomaly in Room 204. Corridor evacuation load increases.", "risk": 78.0, "status": "CRITICAL"},
                {"timestamp": "01:30", "event": "North route fully rendered unsafe. System reroutes all flow to East Ramp Exit.", "risk": 92.0, "status": "CRITICAL"}
            ]
            recommended_route = "EAST RAMP EMERGENCY EXIT (Distance: 84 meters)"
            risk_delta = 67.0
            
        elif scenario_type == "electrical_fire":
            name = "What-If: Fire Outbreak in Electrical Room 208"
            timeline = [
                {"timestamp": "00:00", "event": "Electrical arc detected in Room 208 DB Panel.", "risk": 35.0, "status": "WARNING"},
                {"timestamp": "00:30", "event": "Smoke detector triggered. Ambient temp jumps to 58°C.", "risk": 68.0, "status": "HIGH RISK"},
                {"timestamp": "01:00", "event": "CO2 automatic suppression system deploys. Power isolated.", "risk": 82.0, "status": "CRITICAL"},
                {"timestamp": "01:30", "event": "Smoke spreads to West Wing. Patients diverted to South Corridor.", "risk": 70.0, "status": "HIGH RISK"}
            ]
            recommended_route = "SOUTH CORRIDOR STAIRWELL & EAST RAMP"
            risk_delta = 47.0
            
        else: # smoke_spread
            name = "What-If: Rapid Smoke Spread to ICU Corridor B"
            timeline = [
                {"timestamp": "00:00", "event": "Thermal smoke plume initiated in East Storage.", "risk": 20.0, "status": "SAFE"},
                {"timestamp": "00:30", "event": "HVAC airflow spreads optical smoke at 1.2 m/s.", "risk": 55.0, "status": "HIGH RISK"},
                {"timestamp": "01:00", "event": "Corridor B visibility drops below 2 meters.", "risk": 88.0, "status": "CRITICAL"},
                {"timestamp": "01:30", "event": "Positive pressure smoke barriers automatically seal.", "risk": 62.0, "status": "HIGH RISK"}
            ]
            recommended_route = "WEST ELEVATOR & SOUTH STAIRCASE"
            risk_delta = 68.0

        return {
            "scenario_name": name,
            "timeline": timeline,
            "recommended_route": recommended_route,
            "risk_delta": risk_delta,
            "is_simulation": True,
            "watermark": "SIMULATED WHAT-IF PREDICTION"
        }

simulation_engine = SimulationEngine()
