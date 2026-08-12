from fastapi import APIRouter, Response
from services.pdf_generator import pdf_report_generator

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/html/{incident_number}")
async def get_html_report(incident_number: str):
    incident_data = {
        "incident_number": incident_number,
        "created_at": "2026-08-11 14:32:10",
        "location": "Floor 2 — ICU Corridor near Room 204",
        "confidence": 0.964,
        "risk_score": 94.0,
        "people_nearby": 17,
        "rationale": "Smoke and flame detected on CCTV CAM-201 and CAM-202 near ICU Room 204 with 68.4°C temp spike. Primary North Exit obstructed by trolley.",
        "safest_exit": "EAST RAMP EMERGENCY EXIT",
        "blocked_exit": "NORTH ICU EXIT"
    }
    html_content = pdf_report_generator.generate_html_report(incident_data)
    return Response(content=html_content, media_type="text/html")
