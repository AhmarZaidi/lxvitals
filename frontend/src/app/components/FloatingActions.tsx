import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppContext';
import { secondsToMs } from '@/app/utils'; 

export default function FloatingActions() {
	const { refreshAllData, refreshInterval } = useAppContext();
	const [liveMode, setLiveMode] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

	const toggleLiveMode = () => {
		setLiveMode(prev => !prev);
	};

	return (
		<div className="fixed-actions">
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
	);
}