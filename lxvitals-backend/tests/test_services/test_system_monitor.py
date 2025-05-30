import pytest
from app.services.system_monitor import SystemMonitor

def test_get_cpu_usage(system_monitor):
    """Test that CPU usage returns a valid percentage"""
    usage = system_monitor.get_cpu_usage()
    assert isinstance(usage, float)
    assert 0 <= usage <= 100

def test_get_memory_usage(system_monitor):
    """Test memory usage returns valid data"""
    memory = system_monitor.get_memory_usage()
    
    assert "used_gb" in memory
    assert "total_gb" in memory
    assert "percent" in memory
    
    assert isinstance(memory["used_gb"], float)
    assert isinstance(memory["total_gb"], float)
    assert isinstance(memory["percent"], float)
    
    assert 0 <= memory["percent"] <= 100
    assert memory["used_gb"] <= memory["total_gb"]