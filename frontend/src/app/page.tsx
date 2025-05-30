'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Failed to fetch:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={darkMode ? 'bg-black text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Server Dashboard</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="border p-2 rounded">
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : (
        <div className="p-4 space-y-6">
          <section>
            <h2 className="text-xl font-semibold">CPU</h2>
            <p>Temperature: {data.cpu.temperature} °C</p>
            <p>Fan Speed: {data.cpu.fan_speed} RPM</p>
            <p>Usage: {data.cpu.usage} %</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">GPU</h2>
            <p>Temperature: {data.gpu.temperature} °C</p>
            <p>Using NVIDIA: {data.gpu.using_nvidia ? 'Yes' : 'No'}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Memory</h2>
            <p>Used: {data.memory.used_gb} GB / {data.memory.total_gb} GB</p>
            <p>Usage: {data.memory.percent} %</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Drives</h2>
            {data.drives.map((drive: any, index: number) => (
              <div key={index} className="border p-2 rounded mb-2">
                <p>{drive.name} ({drive.path})</p>
                <p>{drive.used} / {drive.total} ({drive.percent}%)</p>
                <div className="w-full h-2 bg-gray-700 rounded">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${drive.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      <button
        onClick={fetchData}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
}
