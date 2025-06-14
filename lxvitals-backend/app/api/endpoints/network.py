from fastapi import APIRouter, Depends
from app.services.network_monitor import NetworkMonitor

router = APIRouter()
network_monitor = NetworkMonitor()

@router.get("/")
async def get_network_stats():
    """Get network statistics including wifi and speed"""
    return network_monitor.get_status()

@router.get("/wifi")
async def get_wifi_info():
    """Get wifi info"""
    return network_monitor.get_wifi_info()

@router.get("/speed")
async def get_network_speed():
    """Get network speed"""
    return network_monitor.get_network_speed()
