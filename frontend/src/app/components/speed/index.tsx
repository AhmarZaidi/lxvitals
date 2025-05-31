import { useState, useEffect } from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Speed as SpeedType } from '@/app/types';
import DataRow from '@/app/components/DataRow';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { checkLatency } from '@/app/utils';

interface SpeedProps {
    collapsedSections: { speed: boolean };
    toggleCollapse: (section: 'speed') => void;
    setCardOrder: (newOrder: string[]) => void;
}

export default function Speed({ collapsedSections, toggleCollapse, setCardOrder }: SpeedProps) {
    const [data, setData] = useLocalStorage<SpeedType | null>('speedResults', null);
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState<string | null>(null);

    const [latency, setLatency] = useState<number | null>(null);
    const [pingLoading, setPingLoading] = useState(false);

    const fetchSpeedData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/network/speed`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching speed data');
            }
            const responseJson = await response.json();
            setData(responseJson);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePing = async () => {
        setPingLoading(true);
        const result = await checkLatency();
        setLatency(result);
        setPingLoading(false);
    };

    useEffect(() => {
        if (!data) {
            fetchSpeedData();
        } else {
            setLoading(false); // Cached data exists, no need to load
        }
    });

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
                    onRefresh={fetchSpeedData}
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
                                    onClick={fetchSpeedData} 
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