import re

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