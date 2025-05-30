export interface DriveInfo {
  name: string;
  path: string;
  total: string;
  used: string;
  free: string;
  percent: number;
}

export interface SystemStatus {
  cpu: {
    temperature: number | null;
    fan_speed: number | null;
    usage: number | null;
  };
  gpu: {
    available: boolean;
    using_nvidia: boolean;
    temperature: number | null;
    usage_percent: number | null;
    fan_speed: number | null;
  };
  memory: {
    used_gb: number | null;
    total_gb: number | null;
    percent: number | null;
  };
  drives: DriveInfo[];
}
