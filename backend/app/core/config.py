from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application configuration, loaded from environment variables / .env."""

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_database: str = "opportunity_copilot"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"

    cors_origins: str = "http://localhost:5173"

    max_emails_per_batch: int = 15
    min_recommended_emails: int = 5

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
