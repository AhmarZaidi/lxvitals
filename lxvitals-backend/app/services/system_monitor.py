import psutil
import os
import shutil
import sensors
import platform
from app.core.config import settings
from app.utils.utils import convert_size, calculate_size_unit

class SystemMonitor:
    def __init__(self):
        self.drive_path = settings.DRIVE_PATH

    def get_cpu_stats(self):
        sensors.init()
        cpu_temp = None
        fan_speed = None
        cpu_usage = None
        cores = None
        frequency = None
        try:
            for chip in sensors.iter_detected_chips():
                label = str(chip)
                for feature in chip:
                    name = feature.label.lower()
                    if "tctl" in name and "k10temp" in label:
                        cpu_temp = round(feature.get_value(), 1)
                    elif "cpu_fan" in name and "asus" in label.lower():
                        fan_speed = int(feature.get_value())

            cpu_usage = round(psutil.cpu_percent(interval=1), 2)
            cores = psutil.cpu_count(logical=True)
            frequency = psutil.cpu_freq().current

            cpu_temp = cpu_temp if cpu_temp is not None else None
            fan_speed = fan_speed if fan_speed is not None else None
            cpu_usage = cpu_usage if cpu_usage is not None else None
            cores = cores if cores is not None else None
            frequency = round(frequency, 2) if frequency is not None else None

            return {
                'temperature': cpu_temp,
                'temperature_unit': 'celsius',
                'fan_speed': fan_speed,
                'fan_speed_unit': 'RPM',
                'usage_percent': cpu_usage,
                'cores': cores,
                'frequency': frequency,
                'frequency_unit': 'MHz',
            }
        except Exception as e:
            return {'error': str(e)}
        finally:
            sensors.cleanup()

    def get_gpu_stats(self):
        sensors.init()
        temperature = None
        try:
            for chip in sensors.iter_detected_chips():
                label = str(chip)
                for feature in chip:
                    name = feature.label.lower()
                    if "edge" in name and "amdgpu" in label:
                        temperature = round(feature.get_value(), 1)
            sensors.cleanup()

            temperature = temperature if temperature is not None else None

            return {
                'available': True,
                'using_nvidia': False,
                'temperature': temperature,
                'temperature_unit': 'celsius',
                'usage_percent': None,
                'fan_speed': None
            }
        except Exception as e:
            return {'error': str(e)}  
        finally:
            sensors.cleanup()

    def get_memory_usage(self):
        mem = None
        try:
            mem = psutil.virtual_memory()

            in_use = round(mem.used / (1024 ** 3), 2) if mem else None
            total = round(mem.total / (1024 ** 3), 2) if mem else None
            percent = mem.percent if mem else None

            return {
                'in_use': in_use,
                'total': total,
                'size_unit': 'GB',
                'percent': percent
            }
        except Exception as e:
            return {'error': str(e)}

    def get_drive_info(self):
        try:
            drives = []
            folder = self.drive_path
            seen_paths = set()
            if not os.path.exists(folder):
                return drives
            for entry in os.scandir(folder):
                path = entry.path
                if os.path.ismount(path):
                    total, used, free = shutil.disk_usage(path)

                    percent = round(used / total * 100, 2) if total and used and total > 0 else None
                    
                    total_unit = calculate_size_unit(total) if total else None
                    used_unit = calculate_size_unit(used) if used else None
                    free_unit = calculate_size_unit(free) if free else None
                    
                    total = convert_size(total) if total else None
                    used = convert_size(used) if used else None
                    free = convert_size(free) if free else None

                    seen_paths.add(path)

                    drives.append({
                        'name': os.path.basename(path),
                        'path': path,
                        'total': total,
                        'total_unit': total_unit,
                        'used': used,
                        'used_unit': used_unit,
                        'free': free,
                        'free_unit': free_unit,
                        'percent': percent
                    })

            # Add boot drive info if not already included    
            boot_path = '/'
            if boot_path not in seen_paths:
                total, used, free = shutil.disk_usage(boot_path)

                percent = round(used / total * 100, 2) if total and used and total > 0 else None
                
                total_unit = calculate_size_unit(total) if total else None
                used_unit = calculate_size_unit(used) if used else None
                free_unit = calculate_size_unit(free) if free else None
                
                total = convert_size(total) if total else None
                used = convert_size(used) if used else None
                free = convert_size(free) if free else None

                drives.insert(0, {  # Put boot drive at the top
                    'name': 'Boot Drive',
                    'path': boot_path,
                    'total': total,
                    'total_unit': total_unit,
                    'used': used,
                    'used_unit': used_unit,
                    'free': free,
                    'free_unit': free_unit,
                    'percent': percent
                })

            return drives   
        except Exception as e:
            return {'error': str(e)}

    def get_status(self):
        try:
            cpu = self.get_cpu_stats()
            gpu = self.get_gpu_stats()
            memory = self.get_memory_usage()
            drives = self.get_drive_info()

            return {
                'cpu': cpu,
                'gpu': gpu,
                'memory': memory,
                'drives': drives
            }
        except Exception as e:
            return {'error': str(e)}