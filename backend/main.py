# Let's start by preparing the Python backend code to collect system stats and serve them via a Flask API.

# Required Python packages:
# - flask
# - psutil
# - pynvml
# - subprocess (built-in)
# - os (built-in)
# - shutil (built-in)
# - json (built-in)

# This code sets up the API endpoints you can later connect to from your frontend.

# First, we'll create the main backend script: `server_monitor.py`


from flask import Flask, jsonify
import psutil
import os
import shutil
import subprocess
import json

try:
    import pynvml
    pynvml.nvmlInit()
    gpu_available = True
except:
    gpu_available = False

app = Flask(__name__)

def get_cpu_usage():
    return round(psutil.cpu_percent(interval=1), 2)

def get_memory_usage():
    mem = psutil.virtual_memory()
    return {
        'used_gb': round(mem.used / (1024 ** 3), 2),
        'total_gb': round(mem.total / (1024 ** 3), 2),
        'percent': mem.percent
    }

def get_drive_info(folder):
    drives = []
    if not os.path.exists(folder):
        return drives
    for entry in os.scandir(folder):
        if entry.is_mount() or os.path.ismount(entry.path):
            total, used, free = shutil.disk_usage(entry.path)
            drives.append({
                'name': os.path.basename(entry.path),
                'path': entry.path,
                'total': convert_size(total),
                'used': convert_size(used),
                'free': convert_size(free),
                'percent': round(used / total * 100, 2)
            })
    return drives

def convert_size(size_bytes):
    if size_bytes >= 1 << 40:
        return f"{round(size_bytes / (1 << 40), 2)} TB"
    elif size_bytes >= 1 << 30:
        return f"{round(size_bytes / (1 << 30), 2)} GB"
    elif size_bytes >= 1 << 20:
        return f"{round(size_bytes / (1 << 20), 2)} MB"
    else:
        return f"{round(size_bytes / (1 << 10), 2)} KB"

def get_cpu_temp_and_fan():
    try:
        output = subprocess.check_output(['sensors']).decode()
        lines = output.split('\\n')
        temp, fan = None, None
        for line in lines:
            if 'Package id 0:' in line or 'Tctl:' in line:
                temp = float(line.split('+')[1].split('°')[0])
            elif 'fan' in line.lower() and 'rpm' in line.lower():
                try:
                    fan = int(''.join(filter(str.isdigit, line)))
                except:
                    continue
        return {'temperature': temp, 'fan_speed': fan}
    except:
        return {'temperature': None, 'fan_speed': None}

def get_gpu_stats():
    if not gpu_available:
        return {'available': False}
    try:
        handle = pynvml.nvmlDeviceGetHandleByIndex(0)
        usage = pynvml.nvmlDeviceGetUtilizationRates(handle)
        temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
        fan = pynvml.nvmlDeviceGetFanSpeed(handle)
        return {
            'available': True,
            'usage_percent': usage.gpu,
            'temperature': temp,
            'fan_speed': fan
        }
    except:
        return {'available': False}

@app.route('/api/status')
def get_status():
    return jsonify({
        'cpu_usage': get_cpu_usage(),
        'cpu': get_cpu_temp_and_fan(),
        'gpu': get_gpu_stats(),
        'memory': get_memory_usage(),
        'drives': get_drive_info('/home/ahmar/Ahmar/EXTSTG')
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
