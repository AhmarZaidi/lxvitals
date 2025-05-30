'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import DashboardCard from '@/app/components/DashboardCard';
import ProgressBar from '@/app/components/ProgressBar';
import Footer from '@/app/components/Footer';
import { SystemStatus, DriveInfo } from '@/app/types';

export default function Home() {
  const [data, setData] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
  
  const [collapsedSections, setCollapsedSections] = useLocalStorage('collapsedSections', {
    cpu: false,
    gpu: false,
    memory: false,
    drives: false
  });

  // Card order state
  const [cardOrder, setCardOrder] = useLocalStorage('cardOrder', ['cpu', 'gpu', 'memory', 'drives']);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/system/status`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Failed to fetch:', e);
      setError(e instanceof Error ? e.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleCollapse = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to get temperature status type
  const getTemperatureType = (temp: number | null) => {
    if (temp === null) return 'success';
    if (temp > 60) return 'danger';
    if (temp > 45) return 'warning';
    return 'success';
  };

  // Function to get usage status type
  const getUsageType = (percent: number | null) => {
    if (percent === null) return 'success';
    if (percent > 95) return 'danger';
    if (percent > 90) return 'warning';
    return 'success';
  };

  return (
    <>
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1>Server Dashboard</h1>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="button secondary"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {loading && !data ? (
          <div className="flex justify-center items-center" style={{ height: '16rem' }}>
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">
            <h4>Error</h4>
            <p>{error}</p>
            <button onClick={fetchData} className="button danger">
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid">
            {cardOrder.map(section => {
              switch(section) {
                case 'cpu':
                  return (
                    <DashboardCard
                      key="cpu"
                      title="CPU"
                      isCollapsed={collapsedSections.cpu}
                      onToggleCollapse={() => toggleCollapse('cpu')}
                      dragId="cpu"
                      onDragReorder={setCardOrder}
                    >
                      {!collapsedSections.cpu && data && (
                        <div className="space-y">
                          <div className="flex justify-between">
                            <span>Temperature</span>
                            <span className={`text-${getTemperatureType(data.cpu.temperature)}`}>
                              {data.cpu.temperature !== null ? `${data.cpu.temperature} °C` : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fan Speed</span>
                            <span>
                              {data.cpu.fan_speed !== null ? `${data.cpu.fan_speed} RPM` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Usage</span>
                              <span className={`text-${getUsageType(data.cpu.usage)}`}>
                                {data.cpu.usage !== null ? `${data.cpu.usage}%` : 'N/A'}
                              </span>
                            </div>
                            {data.cpu.usage !== null && (
                              <ProgressBar 
                                percentage={data.cpu.usage} 
                                type={getUsageType(data.cpu.usage)} 
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </DashboardCard>
                  );
                
                case 'gpu':
                  return (
                    <DashboardCard
                      key="gpu"
                      title="GPU"
                      isCollapsed={collapsedSections.gpu}
                      onToggleCollapse={() => toggleCollapse('gpu')}
                      dragId="gpu"
                      onDragReorder={setCardOrder}
                    >
                      {!collapsedSections.gpu && data && (
                        <div className="space-y">
                          {data.gpu.available ? (
                            <>
                              <div className="flex justify-between">
                                <span>Temperature</span>
                                <span className={`text-${getTemperatureType(data.gpu.temperature)}`}>
                                  {data.gpu.temperature !== null ? `${data.gpu.temperature} °C` : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>GPU Provider</span>
                                <span>
                                  {data.gpu.using_nvidia ? 'NVIDIA' : 'AMD/Intel'}
                                </span>
                              </div>
                              {data.gpu.usage_percent !== null && (
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>Usage</span>
                                    <span className={`text-${getUsageType(data.gpu.usage_percent)}`}>
                                      {data.gpu.usage_percent}%
                                    </span>
                                  </div>
                                  <ProgressBar 
                                    percentage={data.gpu.usage_percent} 
                                    type={getUsageType(data.gpu.usage_percent)} 
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-muted">GPU not available</p>
                          )}
                        </div>
                      )}
                    </DashboardCard>
                  );
                
                case 'memory':
                  return (
                    <DashboardCard
                      key="memory"
                      title="Memory"
                      isCollapsed={collapsedSections.memory}
                      onToggleCollapse={() => toggleCollapse('memory')}
                      dragId="memory"
                      onDragReorder={setCardOrder}
                    >
                      {!collapsedSections.memory && data && (
                        <div className="space-y">
                          <div className="flex justify-between">
                            <span>Used</span>
                            <span>
                              {data.memory.used_gb !== null && data.memory.total_gb !== null 
                                ? `${data.memory.used_gb} GB / ${data.memory.total_gb} GB` 
                                : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Usage</span>
                              <span className={`text-${getUsageType(data.memory.percent)}`}>
                                {data.memory.percent !== null ? `${data.memory.percent}%` : 'N/A'}
                              </span>
                            </div>
                            {data.memory.percent !== null && (
                              <ProgressBar 
                                percentage={data.memory.percent} 
                                type={getUsageType(data.memory.percent)} 
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </DashboardCard>
                  );
                
                case 'drives':
                  return (
                    <DashboardCard
                      key="drives"
                      title="Drives"
                      isCollapsed={collapsedSections.drives}
                      onToggleCollapse={() => toggleCollapse('drives')}
                      dragId="drives"
                      onDragReorder={setCardOrder}
                      fullWidth={true}
                    >
                      {!collapsedSections.drives && data && (
                        <div className="space-y">
                          {data.drives.length > 0 ? (
                            data.drives.map((drive: DriveInfo, index: number) => (
                              <div key={index} className="drive-item">
                                <div className="flex justify-between mb-1">
                                  <span className="drive-name">{drive.name}</span>
                                  <span className="drive-path text-muted">{drive.path}</span>
                                </div>
                                <div className="flex justify-between text-muted mb-1">
                                  <span>{drive.used} used of {drive.total}</span>
                                  <span className={`text-${
                                    drive.percent > 95 ? 'danger' : 
                                    drive.percent > 90 ? 'warning' : 
                                    'success'
                                  }`}>
                                    {drive.free} free
                                  </span>
                                </div>
                                <ProgressBar 
                                  percentage={drive.percent} 
                                  type={
                                    drive.percent > 95 ? 'danger' : 
                                    drive.percent > 90 ? 'warning' : 
                                    'success'
                                  } 
                                />
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No drives detected</p>
                          )}
                        </div>
                      )}
                    </DashboardCard>
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}

        <div className="fixed-actions">
          <Link 
            href="/settings"
            className="button secondary"
          >
            ⚙️ Settings
          </Link>
          <button
            onClick={fetchData}
            className="button primary"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}