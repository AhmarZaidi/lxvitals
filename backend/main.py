from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from system_monitor import SystemMonitor
from dotenv import load_dotenv
import os
import time

load_dotenv()

origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

monitor = SystemMonitor()
last_response = None
last_time = 0

@app.get("/api/status")
def get_status():
    global last_response, last_time
    current_time = time.time()
    if last_response is None or current_time - last_time >= 1:
        last_response = monitor.get_status()
        last_time = current_time
    return JSONResponse(content=last_response)