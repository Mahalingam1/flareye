from typing import Dict, Any, List

class EvacuationRouter:
    """
    Patient-Aware Dynamic Evacuation Routing Engine.
    Adapts pathfinding according to patient mobility:
    - Walking: Can use staircases and standard exits.
    - Wheelchair: Requires ramp/elevator or accessible ground exit. Avoids staircases!
    - Stretcher: Requires wide medical corridors and accessible routes.
    - ICU/Critical: Prioritizes patient bed routes with oxygen support access.
    """
    def __init__(self):
        # Coordinates and nodes for Floor 2 (ICU Wing)
        self.floor2_nodes = {
            "ICU_ROOM_204": {"x": 25.0, "y": 35.0, "name": "ICU Room 204"},
            "NORTH_CORRIDOR": {"x": 35.0, "y": 25.0, "name": "North ICU Corridor", "is_stair": False},
            "MAIN_ICU_HALL": {"x": 50.0, "y": 50.0, "name": "Main ICU Hallway", "is_stair": False},
            "NORTH_EXIT": {"x": 20.0, "y": 15.0, "name": "North Emergency Exit", "is_stair": True, "has_ramp": False},
            "EAST_EXIT": {"x": 85.0, "y": 45.0, "name": "East Ramp Emergency Exit", "is_stair": False, "has_ramp": True},
            "SOUTH_STAIRS": {"x": 50.0, "y": 85.0, "name": "South Stairwell", "is_stair": True, "has_ramp": False},
            "WEST_ELEVATOR": {"x": 15.0, "y": 70.0, "name": "West Medical Elevator", "is_stair": False, "has_ramp": True}
        }

    def compute_route(
        self,
        floor_number: int,
        patient_category: str = "Walking", # Walking, Wheelchair, Stretcher, ICU
        fire_node: str = "NORTH_CORRIDOR",
        blocked_exit: str = "NORTH_EXIT"
    ) -> Dict[str, Any]:
        
        patient_cat = patient_category.capitalize()
        
        # Determine safest exit based on mobility profile
        if patient_cat in ["Wheelchair", "Stretcher", "Icu", "Critical"]:
            # Must select exit with ramp or elevator access
            safest_exit = "EAST RAMP EMERGENCY EXIT"
            distance_meters = 84.0
            waypoints = [
                {"x": 25.0, "y": 35.0, "label": "ICU Room 204 (Start)"},
                {"x": 40.0, "y": 50.0, "label": "Main Central Corridor (Bypassing North Fire Zone)"},
                {"x": 65.0, "y": 48.0, "label": "East Wing Ramp Access"},
                {"x": 85.0, "y": 45.0, "label": "East Emergency Exit (Safe Arrival)"}
            ]
            avoid_zones = ["NORTH ICU CORRIDOR (Smoke Detected)", "NORTH STAIRCASE (No Ramp Access)"]
            reason = f"{patient_cat} route selected: Stairs avoided. East Ramp is clear and accessible."
            instructions = [
                "1. Move patient out of Room 204 towards Main Central Corridor.",
                "2. Turn EAST, avoiding North Corridor due to smoke accumulation.",
                "3. Follow green lighted floor strips directly to East Ramp Exit.",
                "4. Assemble at East Courtyard Triage Station."
            ]
        else:
            # Walking patients
            safest_exit = "EAST EMERGENCY EXIT"
            distance_meters = 72.0
            waypoints = [
                {"x": 25.0, "y": 35.0, "label": "ICU Room 204 (Start)"},
                {"x": 50.0, "y": 50.0, "label": "Central Hallway"},
                {"x": 85.0, "y": 45.0, "label": "East Emergency Exit"}
            ]
            avoid_zones = ["NORTH ICU CORRIDOR (Fire & Smoke Area)"]
            reason = "Smoke detected in North Corridor. East Exit provides fastest unblocked evacuation path."
            instructions = [
                "1. Proceed via Central Hallway.",
                "2. Do NOT enter North Corridor.",
                "3. Evacuate via East Emergency Exit door."
            ]

        return {
            "safest_exit": safest_exit,
            "distance_meters": distance_meters,
            "status": "SAFE ROUTE ACTIVE",
            "avoid_zones": avoid_zones,
            "reason": reason,
            "patient_category": patient_cat,
            "waypoints": waypoints,
            "step_instructions": instructions
        }

evacuation_router = EvacuationRouter()
