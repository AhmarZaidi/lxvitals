'use client';

import { useEffect } from 'react';
import { ReactNode } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, []);

    return <>{children}</>;
}
