import { useRef, useEffect } from 'react';
import { Health } from '@/app/types';
import { useAppContext } from '@/app/context/AppContext';

interface HealthPopupProps {
	health: Health;
	onClose: () => void;
}

export default function HealthPopup({ health, onClose }: HealthPopupProps) {
	const { fetchData } = useAppContext();
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				onClose();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	const handleRefresh = () => {
		fetchData('health');
	};

	return (
		<div className="popup-overlay">
			<div className="popup-container health-popup" ref={popupRef}>
				<div className="popup-header">
					<h2>Server Health</h2>
					<button type="button" className="button secondary" onClick={onClose}>✕</button>
				</div>
				<div className="popup-body">
					<div className="mb-4">
						<div className="flex justify-between">
							<strong>Status:</strong>
							<span className={health.status === 'healthy' ? 'text-success' : 'text-warning'}>
								{health.status.toUpperCase()}
							</span>
						</div>
						<div className="flex justify-between">
							<strong>CPU Usage:</strong>
							<span>{health.cpu_usage}%</span>
						</div>
						<div className="flex justify-between">
							<strong>Memory Usage:</strong>
							<span>{health.memory_usage}%</span>
						</div>
						<div className="flex justify-between">
							<strong>Uptime:</strong>
							<span>{health.uptime_formatted}</span>
						</div>
						<div className="flex justify-between">
							<strong>Response Time:</strong>
							<span>{health.health_check_duration_ms} ms</span>
						</div>
					</div>

					{health.issues.length > 0 && (
						<div className="mb-4">
							<strong>Issues:</strong>
							<ul className="feature-list">
								{health.issues.map((issue, index) => (
									<li key={index} className="text-warning">{issue}</li>
								))}
							</ul>
						</div>
					)}

					<div>
						<strong>Module Status:</strong>
						{Object.entries(health.import_status).map(([module, status]) => (
							<div key={module} className="mb-1">
								<div className="flex justify-between">
									<span className="module-name">{module.split('.').pop()}</span>
									<span className={status.status === 'ok' ? 'text-success' : 'text-danger'}>
										{status.status}
										{status.import_time_ms && ` (${status.import_time_ms} ms)`}
									</span>
								</div>
								{status.error && <div className="text-danger">{status.error}</div>}
							</div>
						))}
					</div>
				</div>
				<div className="popup-footer">
					<button type="button" className="button primary" onClick={handleRefresh}>
						🔄 Refresh
					</button>
				</div>
			</div>
		</div>
	);
}