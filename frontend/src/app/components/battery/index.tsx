import { useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

export default function Battery() {
    const {
        dataState,
        fetchData,
        setCardOrder,
        collapsedSections,
        toggleCollapse,
    } = useAppContext();

    const { data, loading, error } = dataState.battery;

    useEffect(() => {
        // Only fetch if we don't have data yet or if it's never been loaded
        if (!data && !loading) {
            fetchData('battery');
        }
    }, [data, loading, fetchData]);

    const handleRefresh = () => {
        fetchData('battery');
    };

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
                    onRefresh={handleRefresh}
                    fullWidth={true}
                >
                    {!collapsedSections.battery && data && (
                        <div className="card-content">
                            <DataRow title="Mode" data={data.mode} />
                            <DataRow title={`${data.mode} Rate`} data={data.rate} unit={data.rate_unit} />
                            <DataRow title={`${data.mode} Time Left`} data={data.time_left} unit={data.time_left_unit} />
                            <PercentageData title="Percentage" usage_percent={data.percentage} reverse={true} />
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}