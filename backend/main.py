from fastapi import FastAPI
from fastapi.responses import JSONResponse
from system_monitor import SystemMonitor
import time

app = FastAPI()
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
    print("\n")
    print(last_response)
    print("\n")
    return JSONResponse(content=last_response)