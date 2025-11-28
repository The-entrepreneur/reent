"""Application configuration"""

from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str

    # Redis
    REDIS_URL: str

    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440

    # Encryption
    ENCRYPTION_KEY: str

    # Storage
    STORAGE_ENDPOINT: str
    STORAGE_ACCESS_KEY: str
    STORAGE_SECRET_KEY: str
    STORAGE_BUCKET: str
    STORAGE_USE_SSL: bool = False

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # Email
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 1025
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@reent.com"

    # Mock flags
    MOCK_YOUVERIFY: bool = True
    MOCK_PAYSTACK: bool = True

    # Youverify API
    YOUVERIFY_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
