import ProgressBar from '@/app/components/ProgressBar';
import { getUsageType } from '@/app/utils';

interface PercentageData {
    title: string | null;
    usage_percent: number | null;
    reverse: boolean;
}

export default function PercentageData({ title, usage_percent, reverse }: PercentageData) {
    return (
        <div className='percentage-data-container'>
            <div className="flex justify-between mb-1">
                <span>{title}</span>
                <span className={`text-${getUsageType(usage_percent, reverse)}`}>
                    {usage_percent !== null ? `${usage_percent}%` : 'N/A'}
                </span>
            </div>
            {usage_percent !== null && (
                <ProgressBar
                    percentage={usage_percent}
                    type={getUsageType(usage_percent, reverse)}
                />
            )}
        </div>
    );
}