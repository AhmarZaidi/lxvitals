import { useState, useEffect } from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Drives as DrivesType, Drive as DriveType } from '@/app/types';
import Drive from '@/app/components/Drive'

interface DrivesProps {
    collapsedSections: { drives: boolean };
    toggleCollapse: (section: 'drives') => void;
    setCardOrder: (newOrder: string[]) => void;
}

export default function Drives({ collapsedSections, toggleCollapse, setCardOrder }: DrivesProps) {
    const [data, setData] = useState<DrivesType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDrivesData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/system/drives`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching drives data');
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
        fetchDrivesData();
    }, []);

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
                    fullWidth={true}
                >
                    {!collapsedSections.drives && data && (
                        <div className="card-content">
                            {data.drives.length > 0 ? (
                                data.drives.map((drive: DriveType, index: number) => (
                                    <Drive key={index} drive={drive}/>
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