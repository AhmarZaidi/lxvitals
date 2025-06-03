from fastapi import APIRouter, Depends
from app.services.system_monitor import SystemMonitor

router = APIRouter()
system_monitor = SystemMonitor()

@router.get("/")
async def get_system_status():
    """Get complete system status including CPU, GPU, memory and drives"""
    
    status = system_monitor.get_status()
    
    return status

@router.get("/cpu")
async def get_cpu_stats():
    """Get CPU statistics"""
    return system_monitor.get_cpu_stats()

@router.get("/memory")
async def get_memory_stats():
    """Get memory statistics"""
    return system_monitor.get_memory_usage()

@router.get("/gpu")
async def get_gpu_stats():
    """Get GPU statistics"""
    return system_monitor.get_gpu_stats()

@router.get("/drives")
async def get_drive_stats():
    """Get drive statistics"""
    return system_monitor.get_drive_info()
