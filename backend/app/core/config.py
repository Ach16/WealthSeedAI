import logging
import os
from dotenv import dotenv_values
from pydantic_settings import BaseSettings, SettingsConfigDict

# Configure basic logging for the bootstrap phase
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "WealthSeed AI"

    OPENROUTER_API_KEY: str | None = None
    OPENROUTER_MODEL: str = "google/gemini-2.5-flash"
    GROK_API_KEY: str | None = None
    
    DEFAULT_PROVIDER: str = "openrouter"
    FALLBACK_PROVIDER: str = "grok"

    DATABASE_URL: str = "sqlite:///./wealthseed.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    CHROMA_DB_PATH: str = "./chroma_db"

    JWT_SECRET: str = ""

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    RESEND_API_KEY: str = ""
    LANGSMITH_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()