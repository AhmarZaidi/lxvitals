export interface CPU {
	temperature: number | null;
	temperature_unit: 'cesius' | 'fahrenheit' | null;
    fan_speed: number | null;
    fan_speed_unit	: 'RPM' | null;
	usage_percent: number | null;
	cores: number | null;
	frequency: number | null;
	frequency_unit: 'GHz' | 'MHz' | null;
}

export interface GPU {
  available: boolean;
  using_nvidia: boolean;
  temperature: number | null;
  temperature_unit: 'celsius' | 'fahrenheit' | null;
  usage_percent: number | null;
  fan_speed: number | null;
  fan_speed_unit: 'RPM' | null;
}

export interface Memory {
  in_use: number | null;
  total: number | null;
  size_unit: 'GB' | 'MB' | null;
  percent: number | null;
}

export interface Drives {
  drives: Drive[] | [];
}

export interface Drive {
  name: string | null;
  path: string | null;
  total: string | null;
  total_unit: 'GB' | 'MB' | null;
  used: string | null;
  used_unit: 'GB' | 'MB' | null;
  free: string | null;
  free_unit: 'GB' | 'MB' | null;
  percent: number | null;
}

export interface Speed {
	upload_speed: number | null;
	download_speed: number | null;
	speed_unit: 'Mbps' | 'Kbps' | null;
	test_time: string | null;
	test_time_unit: 'seconds' | null;
}

export interface Wifi {
	ssid: string | null;
	device: string | null;
	type: string | null;
	state: string | null;
	vendor: string | null;
	product: string | null;
	driver: string | null;
	mac_address: string | null;
	mode: string | null;
	rate: string | null;
	signal: number | null;
	bars: string | null;
	security: string | null;
	ipv4: string | null;
	ipv6: string | null;
	dns: string | null;
}

export interface Battery {
	percentage: number | null;
	mode: 'Charging' | 'Discharging' | null;
	rate: number | null;
	rate_unit: 'W' | 'mW' | null;
	time_left: number | null;
	time_left_unit: 'seconds' | 'minutes' | 'hours' | null;
}

export interface System {
	cpu: CPU | null;
	gpu: GPU |	null;
	memory: Memory | null;
	drives: Drives;
}

export interface Network {
	speed: Speed | null;
	wifi: Wifi | null;
}