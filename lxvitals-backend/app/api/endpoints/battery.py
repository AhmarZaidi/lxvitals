from fastapi import APIRouter, Depends
from app.services.battery_monitor import BatteryMonitor

router = APIRouter()
battery_monitor = BatteryMonitor()

@router.get("/")
async def get_battery_stats():
    """Get battery statistics including rate and mode"""
    return battery_monitor.get_status()

@router.get("/percentage")
async def get_battery_percentage():
    """Get battery percentage"""
    return battery_monitor.get_percentage()

@router.get("/mode")
async def get_battery_mode():
    """Get battery mode"""
    return battery_monitor.get_mode()

@router.get("/rate")
async def get_battery_rate():
    """Get battery rate"""
    return battery_monitor.get_rate()

@router.get("/time_left")
async def get_battery_time_left():
    """Get battery time remaniing"""
    return battery_monitor.get_time_left()