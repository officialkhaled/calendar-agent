from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CalPilot API"
    api_prefix: str = "/api"
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()