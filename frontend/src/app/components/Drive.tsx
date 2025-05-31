import ProgressBar from '@/app/components/ProgressBar';
import { Drive as DriveType } from '@/app/types';
import { getUsageType } from '@/app/utils';

interface DriveProps {
    drive: DriveType;
}

export default function Drive({ drive }: DriveProps) {
    const usageType = getUsageType(drive.percent);

    return (
        <div className="drive-item">
            <div className="flex justify-between mb-1">
                <span className="drive-name">{drive.name}</span>
                <span className="drive-path text-muted">{drive.path}</span>
            </div>
            <div className="flex justify-between text-muted mb-1">
                <span>{drive.used} {drive.used_unit} used of {drive.total} {drive.total_unit}</span>
                <span className={`text-${usageType}`}>
                    {drive.free} {drive.free_unit} free
                </span>
            </div>
            <ProgressBar
                percentage={drive.percent}
                type={usageType}
            />
        </div>
    );
}