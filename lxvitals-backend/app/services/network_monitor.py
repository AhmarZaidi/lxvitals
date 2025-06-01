import psutil
import time
import subprocess
import platform
import re
import speedtest

from app.utils.utils import get_connected_ap_index, get_current_ap_index, convert_speed

class NetworkMonitor:
    def __init__(self):
        self.last_stats = None
        self.last_time = None

    def get_network_speed(self):
        try:
            start_time = time.time()

            st = speedtest.Speedtest(timeout=1)
            st.get_best_server()
            download = st.download()
            upload = st.upload()

            download_speed = convert_speed(download) if download else None
            upload_speed = convert_speed(upload) if upload else None

            end_time = time.time()
            test_time = round(end_time - start_time, 2)

            return {
                'upload_speed': upload_speed,
                'download_speed': download_speed,
                'speed_unit': 'Mbps',
                'test_time': test_time,
                'test_time_unit': 'seconds',
            }      
        except Exception as e:
            end_time = time.time()
            test_time = round(end_time - start_time, 2)

            return {
                'error': str(e),
                'test_time': test_time,
                'test_time_unit': 'seconds',
            }

    def get_wifi_info(self):
        try:
            # Step 1: Identify connected Wi-Fi device
            dev_output = subprocess.check_output(
                ["nmcli", "-t", "-f", "device,type,state", "device"],
                stderr=subprocess.DEVNULL
            ).decode()

            wifi_device = None
            for line in dev_output.strip().splitlines():
                parts = line.strip().split(":")
                if parts[1] == "wifi" and parts[2] == "connected":
                    wifi_device = parts[0]
                    break

            if not wifi_device:
                return {'error': 'Wi-Fi device not recognized.'}
    
            # Step 2: Get detailed info
            fields = [
                "GENERAL.CONNECTION",
                "GENERAL.DEVICE",
                "GENERAL.TYPE",
                "GENERAL.STATE",
                "GENERAL.VENDOR",
                "GENERAL.PRODUCT",
                "GENERAL.DRIVER",
                "GENERAL.HWADDR",
                "AP",
                "IP4",
                "IP6",
            ]

            out = subprocess.check_output(
                ["nmcli", "-t", "-f", ",".join(fields), "device", "show", wifi_device],
                stderr=subprocess.DEVNULL
            ).decode()

            connected_index = get_connected_ap_index(out)
            if connected_index is None:
                return {'error': 'No connected access point found.'}

            info = {}
            for line in out.strip().splitlines():
                key, _, value = line.partition(":")
                key = key.strip()
                value = value.strip()

                if "GENERAL.CONNECTION" in key:
                    info["ssid"] = value if value else None
                elif "GENERAL.DEVICE" in key:
                    info["device"] = value if value else None
                elif "GENERAL.TYPE" in key:
                    info["type"] = value if value else None
                elif "GENERAL.STATE" in key:
                    info["state"] = value if value else None
                elif "GENERAL.VENDOR" in key:
                    info["vendor"] = value if value else None
                elif "GENERAL.PRODUCT" in key:
                    info["product"] = value if value else None
                elif "GENERAL.DRIVER" in key:
                    info["driver"] = value if value else None
                elif "GENERAL.HWADDR" in key:
                    info["mac_address"] = value if value else None
                elif f"IP4.ADDRESS[1]" in key:
                    info["ipv4"] = value if value else None
                elif f"IP6.ADDRESS[1]" in key:
                    info["ipv6"] = value if value else None
                elif f"IP4.DNS[1]" in key:
                    info["dns"] = value if value else None

                current_index = get_current_ap_index(key)

                if connected_index is not None and current_index is not None and current_index != connected_index:
                    continue
                else:
                    if f"AP[{connected_index}].MODE" in key:
                        info["mode"] = value if value else None
                    elif f"AP[{connected_index}].RATE" in key:
                        info["rate"] = value if value else None
                    elif f"AP[{connected_index}].SIGNAL" in key:
                        info["signal"] = int(value) if value else None
                    elif f"AP[{connected_index}].BARS" in key:
                        info["bars"] = value if value else None
                    elif f"AP[{connected_index}].SECURITY" in key:
                        info["security"] = value if value else None
    
            return info
        except Exception as e:
            return {"error": str(e)}

    def get_status(self):
        try:
            speed = self.get_network_speed()
            wifi = self.get_wifi_info()

            return {
                "speed": speed,
                "wifi": wifi
            }
        except Exception as e:
            return {"error": str(e)}