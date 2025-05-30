'use client';

import { useEffect } from 'react';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

export default function About() {
  const [darkMode] = useLocalStorage('darkMode', true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1>About Samba Vitals</h1>
          <Link href="/" className="link">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="card mb-6">
          <div className="card-header">
            <h2>Project Information</h2>
          </div>
          <div className="card-body">
            <p className="mb-4">
              Samba Vitals is a system monitoring tool that provides real-time hardware statistics
              for your server or computer. It displays CPU usage, temperatures, fan speeds, GPU information,
              memory usage, and external drive storage details.
            </p>
            
            <h3 className="mb-2">Technology Stack</h3>
            <ul className="feature-list mb-4">
              <li>Backend: FastAPI, PySensors, psutil</li>
              <li>Frontend: Next.js, React, SCSS</li>
            </ul>
            
            <h3 className="mb-2">GitHub</h3>
            <p>
              <a 
                href="https://github.com/AhmarZaidi" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                AhmarZaidi
              </a>
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Version Information</h2>
          </div>
          <div className="card-body">
            <p>Version: 0.1.0</p>
            <p>Last Updated: May 30, 2025</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
