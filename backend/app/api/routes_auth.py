from fastapi import APIRouter, Query
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.services.google_calendar_service import (
    exchange_code_for_token,
    get_google_auth_url,
    is_calendar_connected,
)

router = APIRouter()


@router.get("/auth/google")
def connect_google_calendar():
    auth_url = get_google_auth_url()
    return RedirectResponse(auth_url)


@router.get("/auth/google/callback")
def google_auth_callback(code: str = Query(...)):
    exchange_code_for_token(code)

    return RedirectResponse(
        f"{settings.frontend_url}?calendar_connected=true"
    )


@router.get("/auth/google/status")
def google_calendar_status():
    connected = is_calendar_connected()

    return {
        "connected": connected,
        "message": "Google Calendar connected" if connected else "Google Calendar not connected",
    }