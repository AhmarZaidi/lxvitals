import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    """Return a TestClient for testing the API"""
    with TestClient(app) as client:
        yield client

@pytest.fixture
def system_monitor():
    """Return a SystemMonitor instance for testing"""
    from app.services.system_monitor import SystemMonitor
    return SystemMonitor()

@pytest.fixture
def network_monitor():
    """Return a NetworkMonitor instance for testing"""
    from app.services.network_monitor import NetworkMonitor
    return NetworkMonitor()