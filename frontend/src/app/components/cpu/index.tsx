import { useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Temperature from '@/app/components/Temperature';
import FanSpeed from '@/app/components/FanSpeed';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

export default function CPU() {
    const {
        dataState,
        fetchData,
        setCardOrder,
        collapsedSections,
        toggleCollapse,
    } = useAppContext();

    const { data, loading, error } = dataState.cpu;

    useEffect(() => {
		if (!data && !loading) {
			fetchData('cpu');
		}
	}, [data, loading, fetchData]);

	const handleRefresh = () => {
		fetchData('cpu');
	};

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
                    onRefresh={handleRefresh}
                >
                    {!collapsedSections.cpu && data && (
                        <div className="card-content">
                            <Temperature temperature={data.temperature} temperature_unit={data.temperature_unit} />
                            <FanSpeed fan_speed={data.fan_speed} fan_speed_unit={data.fan_speed_unit} />
                            <DataRow title="Cores" data={data.cores} />
                            <DataRow title="Frequency" data={data.frequency} unit={data.frequency_unit} />
                            <PercentageData title="Usage" usage_percent={data.usage_percent} reverse={false} />
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}