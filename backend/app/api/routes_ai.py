from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.ai_schema import AICommandRequest, AIEventPreviewResponse
from app.services.lm_studio_service import generate_event_json_from_command
from app.services.preset_service import get_all_presets

router = APIRouter()


@router.post("/ai/generate-event", response_model=AIEventPreviewResponse)
async def generate_event(
    request: AICommandRequest,
    db: Session = Depends(get_db),
):
    presets = get_all_presets(db)

    event_data = await generate_event_json_from_command(
        command=request.command,
        presets=presets,
    )

    return AIEventPreviewResponse(**event_data)