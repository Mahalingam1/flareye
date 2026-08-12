from fastapi import APIRouter
from services.copilot_engine import copilot_engine
from schemas import CopilotQueryRequest, CopilotQueryResponse

router = APIRouter(prefix="/api/copilot", tags=["copilot"])

@router.post("/query", response_model=CopilotQueryResponse)
async def query_copilot(payload: CopilotQueryRequest):
    return copilot_engine.answer_query(
        query=payload.query,
        language=payload.language,
        is_emergency=True
    )
