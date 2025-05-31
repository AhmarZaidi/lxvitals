import pytest
from fastapi.testclient import TestClient

def test_get_system_status(client):
    """Test the system status endpoint"""
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    
    # Check for expected keys
    assert "cpu" in data
    assert "gpu" in data
    assert "memory" in data
    assert "drives" in data

def test_get_cpu_stats(client):
    """Test the CPU stats endpoint"""
    response = client.get("/api/system/cpu")
    assert response.status_code == 200
    data = response.json()
    
    assert "temperature" in data
    assert "fan_speed" in data
    assert "usage" in data

def test_get_memory_stats(client):
    """Test the memory stats endpoint"""
    response = client.get("/api/system/memory")
    assert response.status_code == 200
    data = response.json()
    
    assert "used_gb" in data
    assert "total_gb" in data
    assert "percent" in data
    
    # Basic validation
    assert data["percent"] >= 0 and data["percent"] <= 100
    assert data["used_gb"] <= data["total_gb"]

def test_get_network_stats(client):
    """Test the network stats endpoint"""
    response = client.get("/api/system/network")
    assert response.status_code == 200
    data = response.json()
    
    assert "upload_speed" in data
    assert "download_speed" in data
    assert "total_sent" in data
    assert "total_received" in data