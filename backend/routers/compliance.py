from fastapi import APIRouter

router = APIRouter(prefix="/api/compliance", tags=["compliance"])

@router.get("/summary")
async def get_compliance_summary():
    return {
        "overall_score": 91.0,
        "extinguishers_pct": 94.0,
        "exits_pct": 88.0,
        "fire_doors_pct": 91.0,
        "corridors_pct": 96.0,
        "signage_pct": 87.0,
        "violations": [
            {
                "id": 1,
                "title": "⚠️ EXIT CORRIDOR OBSTRUCTED",
                "location": "Floor 2 — ICU North Hallway",
                "detected": "Medical trolley stored in emergency egress path",
                "duration_minutes": 18,
                "severity": "HIGH",
                "status": "OPEN"
            },
            {
                "id": 2,
                "title": "⚠️ EXPIRED FIRE EXTINGUISHER",
                "location": "Floor 3 — OT Suite Lobby (EXT-301)",
                "detected": "Inspection expired on 2026-07-10",
                "duration_minutes": 720,
                "severity": "MEDIUM",
                "status": "NOTIFIED"
            }
        ],
        "recurring_issues": [
            {
                "location": "North ICU Exit Hallway",
                "issue": "Blocked 8 times this month by mobile equipment.",
                "recommendation": "AI Recommendation: Re-allocate trolley parking zone to Bay 3 to eliminate recurring egress risk."
            }
        ]
    }

@router.get("/equipment/passport/{passport_id}")
async def get_equipment_passport(passport_id: str):
    return {
        "passport_id": passport_id,
        "type": "CO2 Fire Extinguisher (4.5kg)",
        "location": "Floor 2 — ICU Central Station",
        "last_inspected": "2026-07-10",
        "next_inspection": "2026-09-10",
        "status": "AVAILABLE & OPERATIONAL",
        "pressure_psi": 850,
        "weight_kg": 4.5,
        "accessibility": "CLEAR (100% Egress Visibility)",
        "qr_code": f"QR-{passport_id}"
    }
