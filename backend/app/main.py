from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes_health import router as health_router
from app.api.routes_ai import router as ai_router
from app.api.routes_auth import router as auth_router
from app.api.routes_calendar import router as calendar_router


app = FastAPI(
    title=settings.app_name,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health_router,
    prefix=settings.api_prefix,
    tags=["Health"]
)

app.include_router(
    ai_router,
    prefix=settings.api_prefix,
    tags=["AI"]
)

app.include_router(
    auth_router,
    prefix=settings.api_prefix,
    tags=["Auth"]
)

app.include_router(
    calendar_router,
    prefix=settings.api_prefix,
    tags=["Calendar"]
)


@app.get("/")
def root():
    return {
        "message": "Welcome to CalPilot API"
    }