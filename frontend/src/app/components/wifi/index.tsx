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
        advancedOptions,
        toggleAdvanced
    } = useAppContext();

    const { data, loading, error } = dataState.wifi;
    const showAdvanced = advancedOptions.wifi;

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
                    showAdvanced={showAdvanced}
                    onToggleAdvanced={() => toggleAdvanced('wifi')}
                >
                    {!collapsedSections.wifi && data && (
                        <div className="card-content">
                            {/* Always visible fields */}
                            <DataRow title="SSID" data={data.ssid} />
                            <DataRow title="Vendor" data={data.vendor} />
                            <DataRow title="Product" data={data.product} />
                            <DataRow title="Driver" data={data.driver} />
                            <DataRow title="Rate" data={data.rate} />
                            <DataRow title="Bars" data={data.bars} />
                            <DataRow title="Security" data={data.security} />
                            <DataRow title="State" data={data.state} />
                            <DataRow title="Mode" data={data.mode} />
                            <DataRow title="DNS" data={data.dns} />

                            {/* Advanced fields that only show when toggled on */}
                            {showAdvanced && (
                                <div className="advanced-fields">
                                    <h3 className="advanced-section-title">Advanced Details</h3>
                                    <DataRow title="Device" data={data.device} />
                                    <DataRow title="Type" data={data.type} />
                                    <DataRow title="MAC Address" data={data.mac_address} />
                                    <DataRow title="IPv4" data={data.ipv4} />
                                    <DataRow title="IPv6" data={data.ipv6} />
                                </div>
                            )}

                            <PercentageData title="Signal Strength" usage_percent={data.signal} reverse={true} />
                            
                        </div>
                    )}
                </DashboardCard>
            )}
        </>
    );
}