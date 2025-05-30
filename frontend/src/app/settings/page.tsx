'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import Footer from '@/app/components/Footer';

export default function Settings() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
  const [refreshInterval, setRefreshInterval] = useLocalStorage('refreshInterval', 30);
  const [backendUrl, setBackendUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Get the backend URL from .env
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setBackendUrl(url || '');
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // We would normally update the .env file here, but that's not possible in the browser
    // This is just a mock UI
  };

  return (
    <>
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1>Settings</h1>
          <Link href="/" className="link">
            Back to Dashboard
          </Link>
        </div>

        <div className="card mb-6">
          <div className="card-header">
            <h2>Appearance</h2>
          </div>
          <div className="card-body">
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
        </div>

        <div className="card mb-6">
          <div className="card-header">
            <h2>Data Refresh</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="refreshInterval" className="form-label">Auto-refresh interval (seconds)</label>
              <input
                id="refreshInterval"
                type="number"
                min="5"
                max="300"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                className="form-input"
              />
              <p className="form-help">
                Set to 0 to disable auto-refresh
              </p>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="card-header">
            <h2>Backend Connection</h2>
          </div>
          <div className="card-body">
            <div className="form-group mb-4">
              <label htmlFor="backendUrl" className="form-label">Backend URL</label>
              <input
                id="backendUrl"
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="form-input"
                placeholder="http://localhost:8000"
              />
              <p className="form-help">
                This setting requires restarting the application
              </p>
            </div>
            
            <button
              onClick={handleSave}
              className="button primary"
            >
              {isSaved ? 'Saved!' : 'Save Connection Settings'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
