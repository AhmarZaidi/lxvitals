import { useState, useEffect } from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Memory as MemoryType } from '@/app/types';
import PercentageData from '@/app/components/PercentageData';
import DataRow from '@/app/components/DataRow';

interface MemoryProps {
    collapsedSections: { memory: boolean };
    toggleCollapse: (section: 'memory') => void;
    setCardOrder: (newOrder: string[]) => void;
}

export default function Memory({ collapsedSections, toggleCollapse, setCardOrder }: MemoryProps) {
    const [data, setData] = useState<MemoryType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMemoryData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/system/memory`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching memory data');
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
        fetchMemoryData();
    }, []);

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
                    onRefresh={fetchMemoryData}
                >
                    {!collapsedSections.memory && data && (
                        <div className="card-content">
                            <DataRow title="Total Memory" data={data.total} unit={data.size_unit} />
                            <DataRow title="Used Memory" data={data.in_use} unit={data.size_unit} />
                            <PercentageData title="Usage" usage_percent={data.percent} reverse={false}/>
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}