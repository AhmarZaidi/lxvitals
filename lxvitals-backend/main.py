from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import platform
from dotenv import load_dotenv

from app.api.router import router
from app.core.config import settings

# Load environment variables
load_dotenv()

app = FastAPI(
    title="LXVitals API",
    description="System monitoring API for Linux machines",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)

if __name__ == "__main__":
    if platform.system() != settings.PLATFORM:
        print(f"This application is designed to run on {settings.PLATFORM} systems only.")
        exit(1)

    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)