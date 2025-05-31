import { useState, useEffect } from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { GPU as GPUType } from '@/app/types';
import Temperature from '@/app/components/Temperature';
import FanSpeed from '@/app/components/FanSpeed';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

interface GPUProps {
    collapsedSections: { gpu: boolean };
    toggleCollapse: (section: 'gpu') => void;
    setCardOrder: (newOrder: string[]) => void;
}

export default function GPU({ collapsedSections, toggleCollapse, setCardOrder }: GPUProps) {
    const [data, setData] = useState<GPUType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGpuData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/system/gpu`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching GPU data');
            }
            const responseJson = await response.json();
            setData(responseJson);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGpuData();
    }, []);

    return (
        <>
            {loading && !data ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DashboardCard
                    key="gpu"
                    title="GPU"
                    isCollapsed={collapsedSections.gpu}
                    onToggleCollapse={() => toggleCollapse('gpu')}
                    dragId="gpu"
                    onDragReorder={setCardOrder}
                >
                    {!collapsedSections.gpu && data && (
                        <div className="card-content">
                            <DataRow title="Available" data={data.available ? 'True' : 'False'} />
                            <DataRow title="Using Nvidia" data={data.using_nvidia ? 'True' : 'False'} />
                            <Temperature temperature={data.temperature} temperature_unit={data.temperature_unit} />
                            <FanSpeed fan_speed={data.fan_speed} fan_speed_unit={data.fan_speed_unit} />
                            <PercentageData title="Usage" usage_percent={data.usage_percent} reverse={false}/>
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}