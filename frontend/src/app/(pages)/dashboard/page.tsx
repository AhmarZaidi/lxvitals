'use client';

import React from 'react'; 
import { useAppContext } from '@/app/context/AppContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CPU from '@/app/components/cpu';
import GPU from '@/app/components/gpu';
import Memory from '@/app/components/memory';
import Drives from '@/app/components/drives';
import Battery from '@/app/components/battery';
import Wifi from '@/app/components/wifi';
import Speed from '@/app/components/speed';
import FloatingActions from '@/app/components/FloatingActions';

export default function Dashboard() {
    const { cardOrder } = useAppContext();

    const componentMap: Record<string, React.ReactElement> = {
        cpu: <CPU key="cpu" />,
        gpu: <GPU key="gpu" />,
        memory: <Memory key="memory" />,
        wifi: <Wifi key="wifi" />,
        drives: <Drives key="drives" />,
        battery: <Battery key="battery" />,
        speed: <Speed key="speed" />
    };

    return (
        <div className="container">
            <Header title="Linux Vitals" showDarkModeToggle={true} showHomeButton={false} />

            {cardOrder ? (
                <div className="grid">
                    {cardOrder.map(section =>
                        componentMap[section] ? componentMap[section] : null
                    )}
                </div>
            ) : (
                <div className="loading-container">
                    <p>Loading dashboard...</p>
                </div>
            )}

            <Footer />
            <FloatingActions />
        </div>
    );
}