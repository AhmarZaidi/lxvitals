'use client';

import { useState, useEffect } from 'react';
import { pingBackend, normalizeUrl } from '@/app/utils';
import { useAppContext } from '@/app/context/AppContext';

interface BackendUrlPopupProps {
	onClose: () => void;
	onSave: (url: string) => void;
}

export default function BackendUrlPopup({ onClose, onSave }: BackendUrlPopupProps) {
	const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const { clearCache } = useAppContext();

	const handleSave = async () => {
		if (!backendUrl.trim()) {
			setStatus('error');
			return;
		}

		setStatus('loading');

		try {
			// Add missing protocol if needed
            const finalUrl = normalizeUrl(backendUrl);

			const isAlive = await pingBackend(finalUrl);

			if (!isAlive) {
				setStatus('error');
				return;
			}

			setBackendUrl(finalUrl);

			// Save to localStorage and apply
			setStatus('success');
			// localStorage.setItem('backendUrl', finalUrl);

			// Clear cache to ensure fresh data with new backend
			clearCache();

			// Notify parent component
			onSave(finalUrl);

			// Close popup after a brief success message
			setTimeout(() => {
				onClose();
			}, 1000);
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
						<label htmlFor="backendUrl" className="form-label">Backend URL</label>
						<input
							id="backendUrl"
							type="text"
							value={backendUrl}
							onChange={(e) => setBackendUrl(e.target.value)}
							className="form-input popup-input"
							placeholder="http://localhost:8000"
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