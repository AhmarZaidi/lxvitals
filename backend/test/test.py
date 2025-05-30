from system_monitor import SystemMonitor
import time
from fastapi.responses import JSONResponse

monitor = SystemMonitor()

last_response = monitor.get_status()

print(JSONResponse(content=last_response))