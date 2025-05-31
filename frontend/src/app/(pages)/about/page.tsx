'use client';

import { useEffect } from 'react';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import Header from '@/app/components/Header';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import Card from '@/app/components/Card';

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
    <div className="container">
        <Header title='About Linux Vitals' showDarkModeToggle={true} showHomeButton={true}/>

        <div className='general-cards-container'>
            <Card title="Linux Vitals">
                <div className="card-content">
                <p>
                    Linux Vitals is a system monitoring tool that provides real-time hardware statistics
                    for your server or computer. It displays CPU/GPU usage, temperatures, fan speeds, memory 
                    usage, external drive storage details, battery stats and network information.
                </p>
                <p className="mt-4">
                    For more information, visit the 
                    <Link href="/settings" className="link ml-1"> Settings </Link> page.
                </p>

                <h4 className="mt-4">
                    Drop a like on 
                    <Link href="https://github.com/AhmarZaidi" className="link ml-1"> github/AhmarZaidi </Link>
                </h4>

                </div>
            </Card>
            <Card title='Version Information'>
                <div className="card-content">
                    <p>Version: 1.0</p>
                    <p>Last Updated: May 30, 2025</p>
                </div>
            </Card>
        </div> 

        <Footer />
    </div>
  );
}
