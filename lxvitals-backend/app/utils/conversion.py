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