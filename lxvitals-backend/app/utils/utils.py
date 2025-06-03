import re
from typing import Dict, Any
import time
import traceback
import importlib

def get_connected_ap_index(output: str):
        pattern = r"AP\[(\d+)\]\.IN-USE:\s*\*"
        match = re.search(pattern, output)
        if match:
            return int(match.group(1))
        return None

def get_current_ap_index(key: str):
    """
    Extracts the index number from a key like 'AP[1].IN-USE', 'IP4.ADDRESS[1]', etc.

    Returns:
        int: The index as an integer if matched, otherwise None.
    """
    match = re.search(r"\[(\d+)\]", key)
    if match:
        return int(match.group(1))
    return None

def convert_size(size_bytes):
    """Convert bytes to human-readable string"""
    if size_bytes >= 1 << 40:
        return round(size_bytes / (1 << 40), 2)
    elif size_bytes >= 1 << 30:
        return round(size_bytes / (1 << 30), 2)
    elif size_bytes >= 1 << 20:
        return round(size_bytes / (1 << 20), 2)
    else:
        return round(size_bytes / (1 << 10), 2)
    
def calculate_size_unit(size_bytes):
    """Return the unit for the given size in bytes"""
    if size_bytes >= 1 << 40:
        return "TB"
    elif size_bytes >= 1 << 30:
        return "GB"
    elif size_bytes >= 1 << 20:
        return "MB"
    else:
        return "KB"

def convert_speed(bps):
    # Convert bits per second to Mbps
    mbps = bps / (1024 * 1024)
    return round(mbps, 2)

def format_uptime(seconds: int) -> str:
    """Convert uptime seconds to a human-readable string format.
    
    Args:
        seconds: Total uptime in seconds
        
    Returns:
        String representation in the format "Xd Yh Zm Ws" (days, hours, minutes, seconds)
    """
    days, remainder = divmod(seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    parts = []
    if days > 0:
        parts.append(f"{days}d")
    if hours > 0 or days > 0:
        parts.append(f"{hours}h")
    if minutes > 0 or hours > 0 or days > 0:
        parts.append(f"{minutes}m")
    parts.append(f"{seconds}s")
    
    return " ".join(parts)

def check_imports() -> Dict[str, Dict[str, Any]]:
    """Check if all required modules can be imported successfully"""
    modules_to_check = [
        "app.services.system_monitor", 
        "app.services.network_monitor", 
        "app.services.battery_monitor",
        "psutil"
    ]
    
    results = {}
    
    for module_name in modules_to_check:
        try:
            start_time = time.time()
            importlib.import_module(module_name)
            import_time = (time.time() - start_time) * 1000  # in ms
            
            results[module_name] = {
                "status": "ok",
                "import_time_ms": round(import_time, 2)
            }
        except Exception as e:
            error_info = traceback.format_exc()
            results[module_name] = {
                "status": "error",
                "error": str(e),
                "details": error_info
            }
    
    return results