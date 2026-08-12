from fastapi import APIRouter
from services.evacuation_router import evacuation_router
from schemas import EvacuationRequest

router = APIRouter(prefix="/api/evacuation", tags=["evacuation"])

@router.post("/calculate")
async def calculate_route(payload: EvacuationRequest):
    return evacuation_router.compute_route(
        floor_number=payload.floor_number,
        patient_category=payload.patient_category
    )
