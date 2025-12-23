"""Application configuration using pydantic-settings."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # Riot API
    RIOT_API_KEY: str

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/smurf_detector"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # Riot API Hosts
    PLATFORM_HOST: str = "https://na1.api.riotgames.com"
    REGIONAL_HOST: str = "https://americas.api.riotgames.com"

    # Rate Limiting (dev key limits)
    RATE_LIMIT_PER_SECOND: int = 20
    RATE_LIMIT_PER_2MIN: int = 100


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
