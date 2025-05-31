from fastapi import APIRouter, Depends
from app.services.network_monitor import NetworkMonitor

router = APIRouter()

@router.get("/status")
async def get_network_stats():
    """Get network statistics"""
    network_monitor = NetworkMonitor()
    return network_monitor.get_status()

@router.get("/wifi")
async def get_wifi_info():
    """Get wifi info"""
    network_monitor = NetworkMonitor()
    return network_monitor.get_wifi_info()

@router.get("/speed")
async def get_network_speed():
    """Get network speed"""
    network_monitor = NetworkMonitor()
    return network_monitor.get_network_speed()
