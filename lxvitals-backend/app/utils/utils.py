import re
from ping3 import ping

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
        return f"{round(size_bytes / (1 << 40), 2)} TB"
    elif size_bytes >= 1 << 30:
        return f"{round(size_bytes / (1 << 30), 2)} GB"
    elif size_bytes >= 1 << 20:
        return f"{round(size_bytes / (1 << 20), 2)} MB"
    else:
        return f"{round(size_bytes / (1 << 10), 2)} KB"
    
def format_speed(bps):
    # Convert bits per second to Mbps
    if bps <= 0:
        return "0 Mbps"
    mbps = bps / (1024 * 1024)
    return f"{mbps:.2f} Mbps"

