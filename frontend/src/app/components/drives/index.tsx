import { useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Drive as DriveType } from '@/app/types';
import Drive from '@/app/components/Drive';

export default function Drives() {
    const {
        dataState,
        fetchData,
        setCardOrder,
        collapsedSections,
        toggleCollapse,
    } = useAppContext();

    const { data, loading, error } = dataState.drives;

    useEffect(() => {
        // Only fetch if we don't have data yet or if it's never been loaded
        if (!data && !loading) {
            fetchData('drives');
        }
    }, [data, loading, fetchData]);

    const handleRefresh = () => {
        fetchData('drives');
    };

    return (
        <>
            {loading && !data ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DashboardCard
                    key="drives"
                    title="Drives"
                    isCollapsed={collapsedSections.drives}
                    onToggleCollapse={() => toggleCollapse('drives')}
                    dragId="drives"
                    onDragReorder={setCardOrder}
                    onRefresh={handleRefresh}
                    fullWidth={true}
                >
                    {!collapsedSections.drives && data && (
                        <div className="card-content">
                            {data.drives.length > 0 ? (
                                data.drives.map((drive: DriveType, index: number) => (
                                    <Drive key={index} drive={drive} />
                                ))
                            ) : (
                                <p className="text-muted">No drives detected</p>
                            )}
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}