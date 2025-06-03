from fastapi import APIRouter, HTTPException, status, Response
from app.api.endpoints import system
from app.api.endpoints import network
from app.api.endpoints import battery
import time
import psutil
from app.utils.utils import check_imports, format_uptime
from typing import List

router = APIRouter()

HEALTH_CHECK_TIME_THRESHOLD_MS = 1  # Maximum acceptable response time in ms
CPU_THRESHOLD = 90  # Maximum acceptable CPU usage percentage
MEMORY_THRESHOLD = 90  # Maximum acceptable memory usage percentage

# add a ping router
@router.get("/ping")
async def ping():
    """Ping endpoint to check if the server is running"""
    return {"message": "pong"}

@router.get("/health")
async def health_check(response: Response):
    """API health check endpoint"""
    start_time = time.time()
    
    # Initialize status checks
    issues: List[str] = []
    
    # Check system metrics
    cpu_usage = round(psutil.cpu_percent(interval=None), 2)
    memory_usage = psutil.virtual_memory().percent
    uptime_seconds = int(time.time() - psutil.boot_time())
    uptime_formatted = format_uptime(uptime_seconds)
    
    # Check imports
    import_status = check_imports()
    
    # Look for import failures
    for module, status_info in import_status.items():
        if status_info["status"] == "error":
            issues.append(f"Module {module} import failed: {status_info['error']}")
            response.status_cod = status.HTTP_500_INTERNAL_SERVER_ERROR
    
    # Check system thresholds
    if cpu_usage > CPU_THRESHOLD:
        issues.append(f"CPU usage ({cpu_usage}%) exceeds threshold ({CPU_THRESHOLD}%)")
        # response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        
    if memory_usage > MEMORY_THRESHOLD:
        issues.append(f"Memory usage ({memory_usage}%) exceeds threshold ({MEMORY_THRESHOLD}%)")
        # response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    
    # Calculate total response time
    health_check_duration_ms = round((time.time() - start_time) * 1000, 2)
    
    # Check response time
    if health_check_duration_ms > HEALTH_CHECK_TIME_THRESHOLD_MS:
        issues.append(f"Health check response time ({health_check_duration_ms}ms) exceeds threshold ({HEALTH_CHECK_TIME_THRESHOLD_MS}ms)")
        # response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    
    # Assemble health data
    health_data = {
        "status": "healthy" if not issues else "unhealthy",
        "issues": issues,
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "uptime_seconds": uptime_seconds,
        "uptime_formatted": uptime_formatted,
        "import_status": import_status,
        "health_check_duration_ms": health_check_duration_ms
    }

    return health_data

# Include all endpoint routers
router.include_router(system.router, prefix="/api/system", tags=["System"])
router.include_router(network.router, prefix="/api/network", tags=["Network"])
router.include_router(battery.router, prefix="/api/battery", tags=["Battery"])