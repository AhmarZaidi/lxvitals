import { useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Temperature from '@/app/components/Temperature';
import FanSpeed from '@/app/components/FanSpeed';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

export default function GPU() {
    const {
        dataState,
        fetchData,
        setCardOrder,
        collapsedSections,
        toggleCollapse,
    } = useAppContext();

    const { data, loading, error } = dataState.gpu;

    useEffect(() => {
        // Only fetch if we don't have data yet or if it's never been loaded
        if (!data && !loading) {
            fetchData('gpu');
        }
    }, [data, loading, fetchData]);

    const handleRefresh = () => {
        fetchData('gpu');
    };

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
                    onRefresh={handleRefresh}
                >
                    {!collapsedSections.gpu && data && (
                        <div className="card-content">
                            <DataRow title="Available" data={data.available ? 'True' : 'False'} />
                            <DataRow title="Using Nvidia" data={data.using_nvidia ? 'True' : 'False'} />
                            <Temperature temperature={data.temperature} temperature_unit={data.temperature_unit} />
                            <FanSpeed fan_speed={data.fan_speed} fan_speed_unit={data.fan_speed_unit} />
                            <PercentageData title="Usage" usage_percent={data.usage_percent} reverse={false} />
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}