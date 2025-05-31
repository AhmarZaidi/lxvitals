import { useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import DashboardCard from '@/app/components/DashboardCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import DataRow from '@/app/components/DataRow';
import PercentageData from '@/app/components/PercentageData';

export default function Wifi() {
    const {
        dataState,
        fetchData,
        setCardOrder,
        collapsedSections,
        toggleCollapse,
    } = useAppContext();

    const { data, loading, error } = dataState.wifi;

    useEffect(() => {
        // Only fetch if we don't have data yet or if it's never been loaded
        if (!data && !loading) {
            fetchData('wifi');
        }
    }, [data, loading, fetchData]);

    const handleRefresh = () => {
        fetchData('wifi');
    };

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
                    onRefresh={handleRefresh}
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
                            <PercentageData title="Signal Strength" usage_percent={data.signal} reverse={true} />
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}