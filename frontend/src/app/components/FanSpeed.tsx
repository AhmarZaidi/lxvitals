interface FanSpeedProps {
    fan_speed: number | null;
    fan_speed_unit: 'RPM' | null;
}

export default function FanSpeed({ fan_speed, fan_speed_unit }: FanSpeedProps) {
    return (
        <div className="flex justify-between">
            <span>Fan Speed</span>
            <span>
                {fan_speed !== null ? `${fan_speed} ${fan_speed_unit}` : 'N/A'}
            </span>
        </div>
    );
}