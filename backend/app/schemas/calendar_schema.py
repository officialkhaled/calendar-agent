from datetime import datetime
from pydantic import BaseModel, Field, model_validator
from typing import Optional


class CalendarEventCreateRequest(BaseModel):
    title: str = Field(..., min_length=1)
    date: str
    start_time: str
    end_time: str
    reminder_minutes: int = 30
    color_id: Optional[str] = None

    @model_validator(mode="after")
    def validate_event_datetime(self):
        try:
            start = datetime.fromisoformat(
                f"{self.date}T{self.start_time}:00"
            )
            end = datetime.fromisoformat(
                f"{self.date}T{self.end_time}:00"
            )
        except ValueError:
            raise ValueError("Invalid date or time format.")

        if end <= start:
            raise ValueError("End time must be after start time.")

        return self


class CalendarEventCreateResponse(BaseModel):
    message: str
    google_event_id: str
    html_link: Optional[str] = None


class CalendarStatusResponse(BaseModel):
    connected: bool
    message: str