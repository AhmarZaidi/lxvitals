'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import Dashboard from './(pages)/dashboard/page';
import BackendUrlPopup from '@/app/components/BackendUrlPopup';

export default function Home() {
    const { backendUrl, setBackendUrl } = useAppContext();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!backendUrl) {
            // Show popup if no URL is set
            setShowPopup(true);
        }
    }, [backendUrl, setBackendUrl]);

    const handleSave = (url: string) => {
        setBackendUrl(url);
        setShowPopup(false);
    };

    return (
        <>
            <main>
                <Dashboard />
            </main>
            {showPopup && (
                <BackendUrlPopup
                    onClose={() => setShowPopup(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}