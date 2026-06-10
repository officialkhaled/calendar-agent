import os
from pathlib import Path

from fastapi import HTTPException
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from app.core.config import settings


SCOPES = ["https://www.googleapis.com/auth/calendar"]


def get_project_root() -> Path:
    return Path(__file__).resolve().parents[2]


def get_credentials_path() -> Path:
    return get_project_root() / settings.google_credentials_file


def get_token_path() -> Path:
    return get_project_root() / settings.google_token_file


def get_google_flow() -> Flow:
    credentials_path = get_credentials_path()

    if not credentials_path.exists():
        raise HTTPException(
            status_code=500,
            detail="Google credentials.json file not found in backend folder.",
        )

    flow = Flow.from_client_secrets_file(
        str(credentials_path),
        scopes=SCOPES,
        redirect_uri=settings.google_redirect_uri,
        autogenerate_code_verifier=False,
    )

    return flow


def get_google_auth_url() -> str:
    flow = get_google_flow()

    auth_url, _ = flow.authorization_url(
    access_type="offline",
    include_granted_scopes="true",
    prompt="consent select_account",
)

    return auth_url


def save_credentials(credentials: Credentials) -> None:
    token_path = get_token_path()

    with open(token_path, "w", encoding="utf-8") as token_file:
        token_file.write(credentials.to_json())


def exchange_code_for_token(code: str) -> None:
    flow = get_google_flow()

    try:
        flow.fetch_token(code=code)
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to exchange Google OAuth code: {str(error)}",
        )

    save_credentials(flow.credentials)


def load_credentials() -> Credentials:
    token_path = get_token_path()

    if not token_path.exists():
        raise HTTPException(
            status_code=401,
            detail="Google Calendar is not connected.",
        )

    credentials = Credentials.from_authorized_user_file(
        str(token_path),
        scopes=SCOPES,
    )

    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
        save_credentials(credentials)

    if not credentials.valid:
        raise HTTPException(
            status_code=401,
            detail="Google Calendar credentials are invalid. Please reconnect.",
        )

    return credentials


def is_calendar_connected() -> bool:
    try:
        credentials = load_credentials()
        return credentials.valid
    except Exception:
        return False


def create_google_calendar_event(event_data):
    credentials = load_credentials()

    service = build("calendar", "v3", credentials=credentials)

    start_datetime = f"{event_data.date}T{event_data.start_time}:00"
    end_datetime = f"{event_data.date}T{event_data.end_time}:00"

    event_body = {
        "summary": event_data.title,
        "start": {
            "dateTime": start_datetime,
            "timeZone": settings.app_timezone,
        },
        "end": {
            "dateTime": end_datetime,
            "timeZone": settings.app_timezone,
        },
        "reminders": {
            "useDefault": False,
            "overrides": [
                {
                    "method": "popup",
                    "minutes": event_data.reminder_minutes,
                }
            ],
        },
    }

    if event_data.color_id:
        event_body["colorId"] = str(event_data.color_id)

    try:
        created_event = (
            service.events()
            .insert(
                calendarId="primary",
                body=event_body,
            )
            .execute()
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create Google Calendar event: {str(error)}",
        )

    return created_event


def disconnect_google_calendar() -> bool:
    token_path = get_token_path()

    if token_path.exists():
        token_path.unlink()
        return True

    return False