from fastapi import APIRouter
from app.api.endpoints import system
from app.api.endpoints import network

router = APIRouter()

# Include all endpoint routers
router.include_router(system.router, prefix="/api/system", tags=["System"])
router.include_router(network.router, prefix="/api/network", tags=["Network"])