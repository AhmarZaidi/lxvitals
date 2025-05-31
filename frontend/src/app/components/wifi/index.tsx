import { useState, useEffect } from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Wifi as WifiType } from '@/app/types';
import DataRow from '@/app/components/DataRow';
import PercentageData from '@/app/components/PercentageData';

interface WifiProps {
    collapsedSections: { wifi: boolean };
    toggleCollapse: (section: 'wifi') => void;
    setCardOrder: (newOrder: string[]) => void;
}

export default function Wifi({ collapsedSections, toggleCollapse, setCardOrder }: WifiProps) {
    const [data, setData] = useState<WifiType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWifiData = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/network/wifi`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching wifi data');
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
        fetchWifiData();
    }, []);

    return (
        <>
            {loading && !data ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <DashboardCard
                    key="wifi"
                    title="Wifi"
                    isCollapsed={collapsedSections.wifi}
                    onToggleCollapse={() => toggleCollapse('wifi')}
                    dragId="wifi"
                    onDragReorder={setCardOrder}
                    onRefresh={fetchWifiData}
                >
                    {!collapsedSections.wifi && data && (
                        <div className="card-content">
                            <DataRow title="SSID" data={data.ssid} />
                            <DataRow title="Device" data={data.device} />
                            <DataRow title="Type" data={data.type} />
                            <DataRow title="State" data={data.state} />
                            <DataRow title="Vendor" data={data.vendor} />
                            <DataRow title="Product" data={data.product} />
                            <DataRow title="Driver" data={data.driver} />
                            <DataRow title="MAC Address" data={data.mac_address} />
                            <DataRow title="Mode" data={data.mode} />
                            <DataRow title="Rate" data={data.rate} />
                            <DataRow title="Bars" data={data.bars} />
                            <DataRow title="Security" data={data.security} />
                            <DataRow title="IPv4" data={data.ipv4} />
                            <DataRow title="IPv6" data={data.ipv6} />
                            <DataRow title="DNS" data={data.dns} />
                            <PercentageData title="Signal Strength" usage_percent={data.signal} reverse={true}/>
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}