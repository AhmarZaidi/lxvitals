import psutil
import time
import subprocess
import platform
import re
import speedtest

from app.utils.utils import get_connected_ap_index, get_current_ap_index, format_speed

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

            end_time = time.time()
            test_time = end_time - start_time
            test_time = f"{test_time:.2f} seconds"

            return {
                'upload_speed': format_speed(upload),
                'download_speed': format_speed(download),
                'test_time': test_time,
            }
        except Exception as e:
            print(f"Error during speed test: {e}")

            end_time = time.time()
            test_time = end_time - start_time
            test_time = f"{test_time:.2f} seconds"
            return {
                'error': str(e),
                'test_time': test_time,
            }

    def get_wifi_info(self):
        if platform.system() != "Linux":
            return {}

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
                return {}
    
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

            info = {}
            for line in out.strip().splitlines():
                key, _, value = line.partition(":")
                key = key.strip()
                value = value.strip()

                if "GENERAL.CONNECTION" in key:
                    info["ssid"] = value
                elif "GENERAL.DEVICE" in key:
                    info["device"] = value
                elif "GENERAL.TYPE" in key:
                    info["type"] = value
                elif "GENERAL.STATE" in key:
                    info["state"] = value
                elif "GENERAL.VENDOR" in key:
                    info["vendor"] = value
                elif "GENERAL.PRODUCT" in key:
                    info["product"] = value
                elif "GENERAL.DRIVER" in key:
                    info["driver"] = value
                elif "GENERAL.HWADDR" in key:
                    info["mac_address"] = value
                elif f"IP4.ADDRESS[1]" in key:
                    info["ipv4"] = value
                elif f"IP6.ADDRESS[1]" in key:
                    info["ipv6"] = value
                elif f"IP4.DNS[1]" in key:
                    info["dns"] = value

                current_index = get_current_ap_index(key)

                if connected_index is not None and current_index is not None and current_index != connected_index:
                    continue
                else:
                    if f"AP[{connected_index}].MODE" in key:
                        info["mode"] = value
                    elif f"AP[{connected_index}].RATE" in key:
                        info["rate"] = value
                    elif f"AP[{connected_index}].SIGNAL" in key:
                        info["signal"] = value
                    elif f"AP[{connected_index}].BARS" in key:
                        info["bars"] = value
                    elif f"AP[{connected_index}].SECURITY" in key:
                        info["security"] = value
    
            return info

        except Exception:
            return {}

    def get_status(self):
        speed = self.get_network_speed()
        wifi = self.get_wifi_info()

        return {
            "speed": speed,
            "wifi": wifi
        }