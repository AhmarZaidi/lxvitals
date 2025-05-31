import { useState, useEffect } from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { CPU as CPUType } from '@/app/types';
import Temperature from '@/app/components/Temperature';
import FanSpeed from '@/app/components/FanSpeed';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

interface CPUProps {
    collapsedSections: { cpu: boolean };
    toggleCollapse: (section: 'cpu') => void;
    setCardOrder: (newOrder: string[]) => void;
}

export default function CPU({ collapsedSections, toggleCollapse, setCardOrder }: CPUProps) {
    const [data, setData] = useState<CPUType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCpuData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/system/cpu`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching CPU data');
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
        fetchCpuData();
    }, []);

    return (
        <>
            {loading && !data ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DashboardCard
                    key="cpu"
                    title="CPU"
                    isCollapsed={collapsedSections.cpu}
                    onToggleCollapse={() => toggleCollapse('cpu')}
                    dragId="cpu"
                    onDragReorder={setCardOrder}
                    onRefresh={fetchCpuData}
                >
                    {!collapsedSections.cpu && data && (
                        <div className="card-content">
                            <Temperature temperature={data.temperature} temperature_unit={data.temperature_unit} />
                            <FanSpeed fan_speed={data.fan_speed} fan_speed_unit={data.fan_speed_unit} />
                            <DataRow title="Cores" data={data.cores} />
                            <DataRow title="Frequency" data={data.frequency} unit={data.frequency_unit} />
                            <PercentageData title="Usage" usage_percent={data.usage_percent} reverse={false}/>
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}