import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import DataRow from '@/app/components/DataRow';
import { checkLatency } from '@/app/utils';

export default function Speed() {
    const {
        dataState,
        fetchData,
        setCardOrder,
        collapsedSections,
        toggleCollapse,
    } = useAppContext();

    const { data, loading, error } = dataState.speed;

    const [latency, setLatency] = useState<number | null>(null);
    const [pingLoading, setPingLoading] = useState(false);

    useEffect(() => {
        // Only fetch if we don't have data yet or if it's never been loaded
        if (!data && !loading) {
            fetchData('speed');
        }
    }, [data, loading, fetchData]);

    const handleRefresh = () => {
        fetchData('speed');
    };

    const handlePing = async () => {
        setPingLoading(true);
        const result = await checkLatency();
        setLatency(result);
        setPingLoading(false);
    };

    return (
        <>
            {loading && !data ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DashboardCard
                    key="speed"
                    title="Speed"
                    isCollapsed={collapsedSections.speed}
                    onToggleCollapse={() => toggleCollapse('speed')}
                    dragId="speed"
                    onDragReorder={setCardOrder}
                    onRefresh={handleRefresh}
                >
                    {!collapsedSections.speed && data && (
                        <div className="card-content">
                            {data ? (
                                <>
                                    <DataRow title="Upload Speed" data={data.upload_speed} unit={data.speed_unit} />
                                    <DataRow title="Download Speed" data={data.download_speed} unit={data.speed_unit} />
                                    <DataRow title="Test Time" data={data.test_time} unit={data.test_time_unit} />
                                </>
                            ) : (
                                <p className="text-muted">No previous results</p>
                            )}

                            <DataRow
                                title="Latency"
                                data={latency !== null ? latency : 'N/A'}
                                unit="ms"
                            />

                            <div className='speedtest-button-container'>
                                <button
                                    type="button"
                                    className="button secondary"
                                    onClick={handlePing}
                                    disabled={pingLoading}
                                >
                                    {pingLoading ? 'Pinging...' : 'Ping'}
                                </button>

                                <button
                                    type="button"
                                    className='button primary'
                                    onClick={handleRefresh}
                                    disabled={loading}
                                >
                                    {loading ? 'Testing...' : 'Test Again'}
                                </button>
                            </div>
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}