import psutil
import os
import shutil
import sensors
from dotenv import load_dotenv

load_dotenv()

class SystemMonitor:
    def __init__(self):
        self.drive_path = os.getenv("DRIVE_PATH", "/mnt")

    def get_cpu_usage(self):
        return round(psutil.cpu_percent(interval=1), 2)

    def get_memory_usage(self):
        mem = psutil.virtual_memory()
        return {
            'used_gb': round(mem.used / (1024 ** 3), 2),
            'total_gb': round(mem.total / (1024 ** 3), 2),
            'percent': mem.percent
        }

    def convert_size(self, size_bytes):
        if size_bytes >= 1 << 40:
            return f"{round(size_bytes / (1 << 40), 2)} TB"
        elif size_bytes >= 1 << 30:
            return f"{round(size_bytes / (1 << 30), 2)} GB"
        elif size_bytes >= 1 << 20:
            return f"{round(size_bytes / (1 << 20), 2)} MB"
        else:
            return f"{round(size_bytes / (1 << 10), 2)} KB"

    def get_drive_info(self):
        drives = []
        folder = self.drive_path
        if not os.path.exists(folder):
            return drives
        for entry in os.scandir(folder):
            path = entry.path
            if os.path.ismount(path):
                total, used, free = shutil.disk_usage(path)
                drives.append({
                    'name': os.path.basename(path),
                    'path': path,
                    'total': self.convert_size(total),
                    'used': self.convert_size(used),
                    'free': self.convert_size(free),
                    'percent': round(used / total * 100, 2)
                })
        return drives

    def get_cpu_stats(self):
        sensors.init()
        cpu_temp = None
        fan_speed = None
        try:
            for chip in sensors.iter_detected_chips():
                label = str(chip)
                for feature in chip:
                    name = feature.label.lower()
                    if "tctl" in name and "k10temp" in label:
                        cpu_temp = round(feature.get_value(), 1)
                    elif "cpu_fan" in name and "asus" in label.lower():
                        fan_speed = int(feature.get_value())
        finally:
            sensors.cleanup()
        return {
            'temperature': cpu_temp,
            'fan_speed': fan_speed,
            'usage': self.get_cpu_usage(),
        }   

    def get_gpu_stats(self):
        sensors.init()
        amd_temp = None
        try:
            for chip in sensors.iter_detected_chips():
                label = str(chip)
                for feature in chip:
                    name = feature.label.lower()
                    if "edge" in name and "amdgpu" in label:
                        amd_temp = round(feature.get_value(), 1)
            sensors.cleanup()
            return {
                'available': True,
                'using_nvidia': False,
                'temperature': amd_temp,
                'usage_percent': None,
                'fan_speed': None
            }
        except Exception as e:
            sensors.cleanup()
            return {'available': False, 'error': str(e)}

    def get_status(self):
        return {
            'cpu': self.get_cpu_stats(),
            'gpu': self.get_gpu_stats(),
            'memory': self.get_memory_usage(),
            'drives': self.get_drive_info()
        }