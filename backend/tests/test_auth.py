import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    """Test user registration"""
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "TestPassword123",
        "full_name": "Test User"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "user" in data

def test_login_user():
    """Test user login"""
    # First register a user
    client.post("/api/auth/register", json={
        "email": "test2@example.com",
        "password": "TestPassword123",
        "full_name": "Test User 2"
    })
    
    # Then login
    response = client.post("/api/auth/login", json={
        "email": "test2@example.com",
        "password": "TestPassword123",
        "device_info": {
            "fingerprint": "test_fingerprint",
            "user_agent": "test_agent",
            "browser": "Chrome",
            "os": "Windows",
            "screen_resolution": "1920x1080",
            "timezone": "UTC"
        }
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
