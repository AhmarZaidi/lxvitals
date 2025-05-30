import pytest
import time
from app.services.network_monitor import NetworkMonitor

def test_get_network_speed(network_monitor):
    """Test that network speed calculation works"""
    # First call initializes
    initial = network_monitor.get_network_speed()
    
    # Wait a bit for network activity
    time.sleep(1)
    
    # Second call should give actual speeds
    stats = network_monitor.get_network_speed()
    
    assert "bytes_sent" in stats
    assert "bytes_recv" in stats
    assert "bytes_sent_per_sec" in stats
    assert "bytes_recv_per_sec" in stats
    
    assert isinstance(stats["bytes_sent"], int)
    assert isinstance(stats["bytes_recv"], int)
    assert isinstance(stats["bytes_sent_per_sec"], float)
    assert isinstance(stats["bytes_recv_per_sec"], float)

def test_get_status(network_monitor):
    """Test network status function"""
    # First call to initialize the stats
    network_monitor.get_network_speed()
    time.sleep(1)
    
    status = network_monitor.get_status()
    
    assert "upload_speed" in status
    assert "download_speed" in status
    assert "total_sent" in status
    assert "total_received" in status
    assert "raw" in status
    
    assert isinstance(status["upload_speed"], str)
    assert isinstance(status["download_speed"], str)