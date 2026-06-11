from typing import Optional
from pydantic import BaseModel


class EventHistoryResponse(BaseModel):
    id: int
    title: str
    date: str
    start_time: str
    end_time: str
    reminder_minutes: int
    color_id: str
    google_event_id: Optional[str] = None
    html_link: Optional[str] = None

    class Config:
        from_attributes = True