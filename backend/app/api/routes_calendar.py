from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.calendar_schema import (
    CalendarEventCreateRequest,
    CalendarEventCreateResponse,
)
from app.schemas.event_history_schema import EventHistoryResponse
from app.services.event_history_service import (
    create_event_history,
    get_recent_event_history,
)
from app.services.google_calendar_service import create_google_calendar_event

router = APIRouter()


@router.post("/calendar/events", response_model=CalendarEventCreateResponse)
def create_event(
    request: CalendarEventCreateRequest,
    db: Session = Depends(get_db),
):
    created_event = create_google_calendar_event(request)

    create_event_history(
        db=db,
        event_data=request,
        created_event=created_event,
    )

    return CalendarEventCreateResponse(
        message="Event created successfully in Google Calendar",
        google_event_id=created_event.get("id"),
        html_link=created_event.get("htmlLink"),
    )


@router.get("/calendar/history", response_model=List[EventHistoryResponse])
def list_event_history(
    db: Session = Depends(get_db),
):
    return get_recent_event_history(db)