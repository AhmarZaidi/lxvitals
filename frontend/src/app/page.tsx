'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import Dashboard from './(pages)/dashboard/page';
import BackendUrlPopup from '@/app/components/BackendUrlPopup';
import { isValidUrl } from '@/app/utils';

export default function Home() {
    const { backendUrl, setBackendUrl, clearCache } = useAppContext();
    const [showPopup, setShowPopup] = useState(false);

    const isBrowser = typeof window !== 'undefined';

    useEffect(() => {
        if(!isBrowser) return;

        const savedUrl = window.localStorage.getItem('backendUrl');
        if (!backendUrl || !isValidUrl(backendUrl)) {
            // If backend URL is not set, check localStorage
            if (savedUrl && isValidUrl(savedUrl)) {
                setBackendUrl(savedUrl);
            } else {
                // If no URL is set, show the popup
                setShowPopup(true);
            }
        } else {
            setShowPopup(false);
        }
    }, [backendUrl, setBackendUrl, isBrowser, clearCache]);

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