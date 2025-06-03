import psutil

class BatteryMonitor:
    def __init__(self):
        self.last_stats = None
        self.last_time = None

    def get_percentage(self):
        try:
            battery = psutil.sensors_battery()
            percentage = battery.percent if battery else None
            return percentage
        except Exception as e:
            return {"error": str(e)}

    def get_mode(self):
        try:
            battery = psutil.sensors_battery()

            mode = battery.power_plugged if battery else None
            mode = "Charging" if bool(mode) else "Discharging"

            return mode   
        except Exception as e:
            return {'error': str(e)}

    def get_rate(self):
        try:
            rate = None
            rate_unit = None
            # TODO: Implement this

            return {
                "rate": rate,
                "rate_unit": rate_unit,
            }
        except Exception as e:
            return {"error": str(e)}

    def get_time_left(self):
        try:
            battery = psutil.sensors_battery()

            mode = battery.power_plugged if battery else None
            mode = "Charging" if bool(mode) else "Discharging"

            time_left = battery.secsleft if battery and mode == "Discharging" else None
            time_left_unit = "seconds" if time_left is not None else None

            return {
                "time_left": time_left,
                "time_left_unit": time_left_unit,
            }
        except Exception as e:
            return {"error": str(e)}

    def get_status(self):
        try:
            battery = psutil.sensors_battery()
    
            percentage = round(battery.percent, 2) if battery else None
            
            mode = battery.power_plugged if battery else None
            mode = "Charging" if bool(mode) else "Discharging"

            rate_info = self.get_rate()
            rate = rate_info.get("rate") if rate_info else None
            rate_unit = rate_info.get("rate_unit") if rate_info else None

            time_left = battery.secsleft if battery and mode == "Discharging" else None
            time_left_unit = "seconds" if time_left is not None else None

            return {
                "percentage": percentage,
                "mode": mode,
                "rate": rate,
                "rate_unit": rate_unit, 
                "time_left": time_left,
                "time_left_unit": time_left_unit,
            }
        except Exception as e:
            return {"error": str(e)}