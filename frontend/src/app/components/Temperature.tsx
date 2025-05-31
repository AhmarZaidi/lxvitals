import { getTemperatureType, getTemperatureUnit } from '@/app/utils';

interface TemperatureProps {
    temperature: number | null;
    temperature_unit: string | null;
}

export default function Temperature({ temperature, temperature_unit }: TemperatureProps) {
    temperature_unit = getTemperatureUnit(temperature_unit);

    return (
        <div className="flex justify-between">
            <span>Temperature</span>
            <span className={`text-${getTemperatureType(temperature)}`}>
                {`${temperature} ${temperature_unit}`}
            </span>
        </div>
    );
}