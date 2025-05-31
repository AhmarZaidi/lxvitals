from fastapi import APIRouter
from app.api.endpoints import system
from app.api.endpoints import network
from app.api.endpoints import battery

router = APIRouter()

# add a ping router
@router.get("/ping")
async def ping():
    """Ping endpoint to check if the server is running"""
    return {"message": "pong"}

# Include all endpoint routers
router.include_router(system.router, prefix="/api/system", tags=["System"])
router.include_router(network.router, prefix="/api/network", tags=["Network"])
router.include_router(battery.router, prefix="/api/battery", tags=["Battery"])