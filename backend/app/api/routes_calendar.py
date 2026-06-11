from fastapi import APIRouter

from app.schemas.calendar_schema import (
    CalendarEventCreateRequest,
    CalendarEventCreateResponse,
)
from app.services.google_calendar_service import create_google_calendar_event

router = APIRouter()


@router.post("/calendar/events", response_model=CalendarEventCreateResponse)
def create_event(request: CalendarEventCreateRequest):
    created_event = create_google_calendar_event(request)

    return CalendarEventCreateResponse(
        message="Event created successfully in Google Calendar",
        google_event_id=created_event.get("id"),
        html_link=created_event.get("htmlLink"),
    )