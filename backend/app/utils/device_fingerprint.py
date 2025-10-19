import hashlib
from typing import Dict, Any
from fastapi import Request

def generate_device_fingerprint(request: Request) -> Dict[str, Any]:
    """Generate device fingerprint from request"""
    
    # Get user agent
    user_agent = request.headers.get("user-agent", "")
    
    # Extract browser and OS info (simplified)
    browser = "Unknown"
    os = "Unknown"
    
    if "Chrome" in user_agent:
        browser = "Chrome"
    elif "Firefox" in user_agent:
        browser = "Firefox"
    elif "Safari" in user_agent:
        browser = "Safari"
    elif "Edge" in user_agent:
        browser = "Edge"
    
    if "Windows" in user_agent:
        os = "Windows"
    elif "Mac" in user_agent:
        os = "macOS"
    elif "Linux" in user_agent:
        os = "Linux"
    elif "Android" in user_agent:
        os = "Android"
    elif "iPhone" in user_agent or "iPad" in user_agent:
        os = "iOS"
    
    # Generate fingerprint
    fingerprint_data = f"{user_agent}|{browser}|{os}"
    fingerprint = hashlib.sha256(fingerprint_data.encode()).hexdigest()[:32]
    
    return {
        "fingerprint": fingerprint,
        "user_agent": user_agent,
        "browser": browser,
        "os": os,
        "screen_resolution": "unknown",  # Would need client-side JS to get this
        "timezone": "unknown"  # Would need client-side JS to get this
    }
