from pydantic import BaseModel, Field
from typing import Optional


class CalendarEventCreateRequest(BaseModel):
    title: str = Field(..., min_length=1)
    date: str
    start_time: str
    end_time: str
    reminder_minutes: int = 30
    color_id: Optional[str] = None


class CalendarEventCreateResponse(BaseModel):
    message: str
    google_event_id: str
    html_link: Optional[str] = None


class CalendarStatusResponse(BaseModel):
    connected: bool
    message: str