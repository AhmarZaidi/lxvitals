import { useState, useEffect } from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Battery as BatteryType } from '@/app/types';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

interface batteryProps {
    collapsedSections: { battery: boolean };
    toggleCollapse: (section: 'battery') => void;
    setCardOrder: (newOrder: string[]) => void;
}

export default function Battery({ collapsedSections, toggleCollapse, setCardOrder }: batteryProps) {
    const [data, setData] = useState<BatteryType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBatteryData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/battery`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching battery data');
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
        fetchBatteryData();
    }, []);

    return (
        <>
            {loading && !data ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DashboardCard
                    key="battery"
                    title="Battery"
                    isCollapsed={collapsedSections.battery}
                    onToggleCollapse={() => toggleCollapse('battery')}
                    dragId="battery"
                    onDragReorder={setCardOrder}
                    onRefresh={fetchBatteryData}
                    fullWidth={true}
                >
                    {!collapsedSections.battery && data && (
                        <div className="card-content">
                            <DataRow title="Mode" data={data.mode} />
                            <DataRow title={`${data.mode} Rate`} data={data.rate} unit={data.rate_unit}/>
                            <DataRow title={`${data.mode} Time Left`} data={data.time_left} unit={data.time_left_unit}/>
                            {/* add a horizontal separator */}
                            <PercentageData title="Percentage" usage_percent={data.percentage} reverse={true}/>
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}