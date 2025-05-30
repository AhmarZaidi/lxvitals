import psutil
import time

class NetworkMonitor:
    def __init__(self):
        self.last_stats = None
        self.last_time = None

    def get_network_speed(self):
        """Calculate current network speed in bytes/sec"""
        if self.last_stats is None:
            self.last_stats = psutil.net_io_counters()
            self.last_time = time.time()
            # Return zeros for first call
            return {
                'bytes_sent': 0,
                'bytes_recv': 0,
                'bytes_sent_per_sec': 0,
                'bytes_recv_per_sec': 0
            }
        
        current_stats = psutil.net_io_counters()
        current_time = time.time()
        
        time_elapsed = current_time - self.last_time
        
        bytes_sent = current_stats.bytes_sent
        bytes_recv = current_stats.bytes_recv
        
        bytes_sent_per_sec = round((bytes_sent - self.last_stats.bytes_sent) / time_elapsed, 2)
        bytes_recv_per_sec = round((bytes_recv - self.last_stats.bytes_recv) / time_elapsed, 2)
        
        # Update last values
        self.last_stats = current_stats
        self.last_time = current_time
        
        return {
            'bytes_sent': bytes_sent,
            'bytes_recv': bytes_recv,
            'bytes_sent_per_sec': bytes_sent_per_sec,
            'bytes_recv_per_sec': bytes_recv_per_sec
        }

    def get_status(self):
        """Get current network status"""
        stats = self.get_network_speed()
        
        # Convert bytes/sec to more readable units
        up_speed = stats['bytes_sent_per_sec']
        down_speed = stats['bytes_recv_per_sec']
        
        if up_speed < 1024:
            upload_speed = f"{up_speed:.2f} B/s"
        elif up_speed < 1024 * 1024:
            upload_speed = f"{up_speed/1024:.2f} KB/s"
        else:
            upload_speed = f"{up_speed/(1024*1024):.2f} MB/s"
            
        if down_speed < 1024:
            download_speed = f"{down_speed:.2f} B/s"
        elif down_speed < 1024 * 1024:
            download_speed = f"{down_speed/1024:.2f} KB/s"
        else:
            download_speed = f"{down_speed/(1024*1024):.2f} MB/s"
        
        return {
            'upload_speed': upload_speed,
            'download_speed': download_speed,
            'total_sent': stats['bytes_sent'],
            'total_received': stats['bytes_recv'],
            'raw': {
                'upload_bytes_per_sec': stats['bytes_sent_per_sec'],
                'download_bytes_per_sec': stats['bytes_recv_per_sec']
            }
        }