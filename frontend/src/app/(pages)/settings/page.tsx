'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Card from '@/app/components/Card';
import { pingBackend, isValidUrl, checkInterval } from '@/app/utils';

export default function Settings() {
    const { 
        backendUrl, 
        setBackendUrl, 
        refreshInterval, 
        setRefreshInterval
    } = useAppContext();

    const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
    const [tempBackendUrl, setTempBackendUrl] = useState('');
    const [tempRefreshInterval, setTempRefreshInterval] = useState(refreshInterval);
    const [isSaved, setIsSaved] = useState(false);
    const [isIntervalSaved, setIsIntervalSaved] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const isBrowser = typeof window !== 'undefined';

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        if(!isBrowser) return;

        const savedUrl = window.localStorage.getItem('backendUrl');
        if (!backendUrl || !isValidUrl(backendUrl)) {
            // If backend URL is not set, check localStorage
            if (savedUrl && isValidUrl(savedUrl)) {
                setBackendUrl(savedUrl);
            }
        } else if (!savedUrl || !isValidUrl(savedUrl)) {
            // If backend URL is already set, update localStorage
            window.localStorage.setItem('backendUrl', backendUrl);
        }

        // Initialize the temp URL from the context
        setTempBackendUrl(backendUrl || '');
        setTempRefreshInterval(refreshInterval);
    }, [backendUrl, refreshInterval, setBackendUrl, isBrowser]);

    const handleSave = async () => {
        if (!tempBackendUrl || !isValidUrl(tempBackendUrl)) {
            setConnectionStatus('error');
            return;
        }

        setConnectionStatus('loading');

        // Test the connection first
        try {
            const isAlive = await pingBackend(tempBackendUrl);
            if (isAlive) {
                // Update the URL if connection is successful
                setTempBackendUrl(tempBackendUrl);
                setConnectionStatus('success');
                setBackendUrl(tempBackendUrl);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            } else {
                setConnectionStatus('error');
            }
        } catch (error) {
            console.error('Error testing backend connection:', error);
            setConnectionStatus('error');
        }
    };

    const handleIntervalSave = () => {
        // Ensure the interval is a valid number and within reasonable bounds
        try {
            const interval = checkInterval(tempRefreshInterval);

            // Update the context value
            setRefreshInterval(interval); // Convert ms to seconds for storage
            setTempRefreshInterval(interval); // Ensure display is normalized
            
            // Show success message
            setIsIntervalSaved(true);
            setTimeout(() => setIsIntervalSaved(false), 2000);
        } catch (error) {
            console.error('Invalid refresh interval:', error);
            setIsIntervalSaved(false);
        }
    };

    return (
        <div className="container">
            <Header title='Settings' showDarkModeToggle={false} showHomeButton={true} />

            <div className='general-cards-container'>
                <Card title="Appearance">
                    <div className="card-content">
                        <div className="theme-toggle mb-4">
                            <span className="theme-label">Theme:</span>
                            <div className="theme-buttons">
                                <button
                                    onClick={() => setDarkMode(false)}
                                    className={`theme-button ${!darkMode ? 'active' : ''}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => setDarkMode(true)}
                                    className={`theme-button ${darkMode ? 'active' : ''}`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title='Live Data Refresh'>
                    <div className="card-content">
                        <div className="form-group">
                            <label htmlFor="refreshInterval" className="form-label">Auto-refresh interval (seconds)</label>
                            <input
                                id="refreshInterval"
                                type="number"
                                min="1"
                                max="60"
                                value={String(tempRefreshInterval)}
                                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                                className="form-input settings-form-input"
                            />
                            <p className="form-help">
                                Set a value between 1 and 60 seconds for auto-refreshing data.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleIntervalSave}
                            className="button primary mt-2"
                        >
                            {isIntervalSaved ? 'Saved!' : 'Save Interval'}
                        </button>
                    </div>
                </Card>

                <Card title='Server Configuration'>
                    <div className="card-content">
                        <p className="text-muted mb-4">
                            The backend URL is used to connect to the server for fetching system data.
                        </p>
                        <div className="form-group mb-4">
                            <label htmlFor="backendUrl" className="form-label">Backend URL</label>
                            <input
                                id="backendUrl"
                                type="text"
                                value={tempBackendUrl}
                                onChange={(e) => setTempBackendUrl((e.target.value).trim())}
                                className="form-input settings-form-input"
                                placeholder="http://192.168.1.x:5000"
                            />
                            {connectionStatus === 'error' && (
                                <div className="status-indicator error">
                                    <span className="indicator-icon">⚠️</span>
                                    <span>Could not connect to server. Please check the URL and try again.</span>
                                </div>
                            )}

                            {connectionStatus === 'success' && (
                                <div className="status-indicator success">
                                    <span className="indicator-icon">✅</span>
                                    <span>Connection successful!</span>
                                </div>
                            )}
                        </div>
                        <button
                            type='button'
                            onClick={handleSave}
                            className="button primary"
                            disabled={connectionStatus === 'loading'}
                        >
                            {connectionStatus === 'loading' ? 'Testing connection...' : (isSaved ? 'Saved!' : 'Save Connection Settings')}
                        </button>
                    </div>
                </Card>
            </div>

            <Footer />
        </div>
    );
}
