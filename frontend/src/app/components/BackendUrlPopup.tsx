'use client';

import { useState, useEffect } from 'react';
import { pingBackend, isValidUrl } from '@/app/utils';
interface BackendUrlPopupProps {
	onClose: () => void;
	onSave: (url: string) => void;
}

export default function BackendUrlPopup({ onClose, onSave }: BackendUrlPopupProps) {
    // TODO: Remove the direct local URL as being default
	const [tempBackendUrl, setTempBackendUrl] = useState('http://192.168.1.x:5000');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

	const handleSave = async () => {
		if (!tempBackendUrl || !isValidUrl(tempBackendUrl)) {
			setStatus('error');
			return;
		}

		setStatus('loading');

		try {
			const isAlive = await pingBackend(tempBackendUrl);

			if (isAlive) {
                setTempBackendUrl(tempBackendUrl);
                setStatus('success');
                onSave(tempBackendUrl);
                setTimeout(() => onClose(), 1000);
            } else {
				setStatus('error');
            }
		} catch (error) {
			console.error('Connection test failed:', error);
			setStatus('error');
		}
	};

	// Handle Escape key to close popup
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	return (
		<div className="popup-overlay">
			<div className="popup-container">
				<div className="popup-header">
					<h2>Setup Required</h2>
				</div>
				<div className="popup-body">
					<p>Please enter the backend server URL to connect to your system monitoring service:</p>

					<div className="form-group">
						<label htmlFor="tempBackendUrl" className="form-label">Backend URL</label>
						<input
							id="tempBackendUrl"
							type="text"
							value={tempBackendUrl}
							onChange={(e) => setTempBackendUrl((e.target.value).trim())}
							className="form-input popup-input"
							placeholder="http://192.168.1.x:5000"
							autoFocus
						/>

						{status === 'error' && (
							<div className="status-indicator error">
								<span className="indicator-icon">⚠️</span>
								<span>Could not connect to server. Please check the URL and try again.</span>
							</div>
						)}

						{status === 'success' && (
							<div className="status-indicator success">
								<span className="indicator-icon">✅</span>
								<span>Connection successful!</span>
							</div>
						)}

						{status === 'loading' && (
							<div className="status-indicator loading">
								<span className="indicator-icon">⏳</span>
								<span>Testing connection...</span>
							</div>
						)}
					</div>
				</div>
				<div className="popup-footer">
					<button
						type="button"
						className="button secondary"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						type="button"
						className="button primary"
						onClick={handleSave}
						disabled={status === 'loading'}
					>
						{status === 'loading' ? 'Connecting...' : 'Save & Connect'}
					</button>
				</div>
			</div>
		</div>
	);
}