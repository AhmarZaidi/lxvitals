'use client';

import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CPU from '@/app/components/cpu';
import GPU from '@/app/components/gpu';
import Memory from '@/app/components/memory';
import Drives from '@/app/components/drives';
import Battery from '@/app/components/battery';
import Wifi from '@/app/components/wifi';
import Speed from '@/app/components/speed'
import FloatingActions from '@/app/components/FloatingActions';

export default function Dashboard() {
    const [collapsedSections, setCollapsedSections] = useLocalStorage('collapsedSections', {
        cpu: false,
        gpu: false,
        memory: false,
        drives: false,
        battery: false,
        wifi: false,
        speed: false,
    });

    // Card order state
    const [cardOrder, setCardOrder] = useLocalStorage('cardOrder', ['cpu', 'gpu', 'memory', 'speed', 'battery', 'network', 'wifi', 'drives']);

    const toggleCollapse = (section: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="container">
            <Header title='Linux Vitals' showDarkModeToggle={true} showHomeButton={false}/>
            <div className="grid">
                {cardOrder.map(section => {
                    switch (section) {
                        case 'cpu':
                            return (
                                <CPU key="cpu" collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} setCardOrder={setCardOrder} />
                            );
                        case 'gpu':
                            return (
                                <GPU key="gpu" collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} setCardOrder={setCardOrder} />
                            );

                        case 'memory':
                            return (
                                <Memory key="memory" collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} setCardOrder={setCardOrder} />
                            );

                        case 'drives':
                            return (
                                <Drives key="drives" collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} setCardOrder={setCardOrder} />
                            );

                        case 'battery':
                            return (
                                <Battery key="battery" collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} setCardOrder={setCardOrder} />
                            );
                        
                        case 'wifi':
                            return (
                                <Wifi key="wifi" collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} setCardOrder={setCardOrder} />
                            );
                        
                        case 'speed':
                            return (
                                <Speed key="speed" collapsedSections={collapsedSections} toggleCollapse={toggleCollapse} setCardOrder={setCardOrder} />
                            );

                        default:
                            return null;
                    }
                })}
            </div>
            <Footer />
            <FloatingActions />
        </div>
    );
}
