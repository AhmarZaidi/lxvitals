import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppContext';
import { secondsToMs, formatUptime } from '@/app/utils';
import HealthPopup from '@/app/components/HealthPopup';

export default function FloatingActions() {
    const { dataState, refreshAllData, refreshInterval, fetchData } = useAppContext();
    const [liveMode, setLiveMode] = useState(false);
    const [showHealthPopup, setShowHealthPopup] = useState(false);
    const [uptimeSeconds, setUptimeSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const uptimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { data: healthData, loading: healthLoading, error: healthError } = dataState.health;

    // Start or stop the interval based on liveMode
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // If live mode is enabled, set up the interval
        if (liveMode && refreshInterval > 0) {
            const intervalMs = secondsToMs(refreshInterval);
            intervalRef.current = setInterval(() => {
                refreshAllData();
            }, intervalMs);
        }

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [liveMode, refreshInterval, refreshAllData]);

    useEffect(() => {
        // Only fetch if we don't have data yet or if it's never been loaded
        if (!healthData && !healthLoading) {
            fetchData('health');
        }
    }, [healthData, healthLoading, fetchData]);

    // Handle live uptime counter
    useEffect(() => {
        // Clear existing uptime interval
        if (uptimeIntervalRef.current) {
            clearInterval(uptimeIntervalRef.current);
            uptimeIntervalRef.current = null;
        }

        // Initialize uptime from health data when it's available
        if (healthData?.uptime_seconds) {
            setUptimeSeconds(healthData.uptime_seconds);

            // Start incrementing uptime every second
            uptimeIntervalRef.current = setInterval(() => {
                setUptimeSeconds(prev => prev + 1);
            }, 1000);
        }

        // Cleanup
        return () => {
            if (uptimeIntervalRef.current) {
                clearInterval(uptimeIntervalRef.current);
            }
        };
    }, [healthData]);

    const toggleLiveMode = () => {
        setLiveMode(prev => !prev);
    };

    const toggleHealthPopup = () => {
        if (!healthError && healthData && !healthLoading) {
            setShowHealthPopup(prev => !prev);
        }
    };

    return (
        <>
            <div className="fixed-actions">
                <button
                    type="button"
                    className={`button ${healthData?.status === 'healthy' ? 'success' : 'warning'}`}
                    onClick={toggleHealthPopup}
                    title="Server health and uptime"
                >
                    {uptimeSeconds > 0 ? formatUptime(uptimeSeconds) : '⏱️'}
                </button>
                <button
                    type="button"
                    className="button secondary"
                    onClick={refreshAllData}
                >
                    {'🔄'}
                </button>
                <button
                    type="button"
                    className={`button ${liveMode ? 'danger' : 'secondary'}`}
                    onClick={toggleLiveMode}
                    title={liveMode ? 'Stop live updates' : 'Start live updates'}
                    disabled={refreshInterval <= 0}
                >
                    {liveMode ? '⏹️' : '▶️'}
                </button>
                <Link
                    href="/settings"
                    className="button secondary"
                >
                    ⚙️
                </Link>
            </div>

            {showHealthPopup && healthData && (
                <HealthPopup health={healthData} onClose={toggleHealthPopup} />
            )}
        </>
    );
}