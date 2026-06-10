from pydantic import BaseModel, Field
from typing import List, Optional


class AICommandRequest(BaseModel):
    command: str = Field(..., min_length=3)


class AIEventPreviewResponse(BaseModel):
    intent: str
    event_type: str
    title: str
    date: str
    start_time: str
    end_time: str
    shift_leader: Optional[str] = None
    reminder_minutes: int = 30
    color_id: str = "9"
    color_label: str = "Work"
    missing_fields: List[str] = []