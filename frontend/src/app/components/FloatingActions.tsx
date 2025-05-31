import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppContext';

export default function FloatingActions() {
	const { refreshAllData } = useAppContext();
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
		if (liveMode) {
			intervalRef.current = setInterval(() => {
				refreshAllData();
			}, 2000); // 2 seconds
		}

		// Cleanup on unmount
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [liveMode, refreshAllData]);

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