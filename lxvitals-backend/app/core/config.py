from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DRIVE_PATH: str = os.getenv("DRIVE_PATH", "/mnt")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")
    PLATFORM: str = os.getenv("PLATFORM", "Linux")
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()