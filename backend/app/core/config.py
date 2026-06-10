from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CalPilot API"
    api_prefix: str = "/api"
    frontend_url: str = "http://localhost:5173"

    lm_studio_base_url: str = "http://localhost:1234/api/v1"
    lm_studio_model: str = "google/gemma-4-e4b"
    lm_studio_timeout_seconds: int = 180

    app_timezone: str = "Europe/London"

    google_credentials_file: str = "credentials.json"
    google_token_file: str = "token.json"
    google_redirect_uri: str = "http://127.0.0.1:8000/api/auth/google/callback"
    
    database_url: str = "sqlite:///./calendar_agent.db"

    class Config:
        env_file = ".env"


settings = Settings()
