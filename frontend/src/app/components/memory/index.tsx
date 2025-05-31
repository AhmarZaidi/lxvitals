import { useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

export default function Memory() {
    const {
        dataState,
        fetchData,
        setCardOrder,
        collapsedSections,
        toggleCollapse,
    } = useAppContext();

    const { data, loading, error } = dataState.memory;

    useEffect(() => {
        // Only fetch if we don't have data yet or if it's never been loaded
        if (!data && !loading) {
            fetchData('memory');
        }
    }, [data, loading, fetchData]);

    const handleRefresh = () => {
        fetchData('memory');
    };

    return (
        <>
            {loading && !data ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DashboardCard
                    key="memory"
                    title="Memory"
                    isCollapsed={collapsedSections.memory}
                    onToggleCollapse={() => toggleCollapse('memory')}
                    dragId="memory"
                    onDragReorder={setCardOrder}
                    onRefresh={handleRefresh}
                >
                    {!collapsedSections.memory && data && (
                        <div className="card-content">
                            <DataRow title="Total Memory" data={data.total} unit={data.size_unit} />
                            <DataRow title="Used Memory" data={data.in_use} unit={data.size_unit} />
                            <PercentageData title="Usage" usage_percent={data.percent} reverse={false} />
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}