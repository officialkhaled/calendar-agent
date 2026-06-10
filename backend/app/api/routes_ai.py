from fastapi import APIRouter

from app.schemas.ai_schema import AICommandRequest, AIEventPreviewResponse
from app.services.lm_studio_service import generate_event_json_from_command

router = APIRouter()


@router.post("/ai/generate-event", response_model=AIEventPreviewResponse)
async def generate_event(request: AICommandRequest):
    event_data = await generate_event_json_from_command(request.command)

    return AIEventPreviewResponse(**event_data)