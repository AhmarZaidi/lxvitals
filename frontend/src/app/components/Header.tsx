'use client';

import { useEffect } from 'react';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    title: string;
    showDarkModeToggle?: boolean;
    showHomeButton?: boolean;
}

export default function Header({ title, showDarkModeToggle = true, showHomeButton = false }: HeaderProps) {
    const router = useRouter();
    const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="flex justify-between items-center mb-6">
            <h1>{title}</h1>
             <div className="header-buttons-container">
                {showDarkModeToggle && (
                    <button
                        type="button"
                        onClick={() => setDarkMode(!darkMode)}
                        className="button secondary"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                )}
                {showHomeButton && (
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="button secondary"
                    >
                        🏠 Home
                    </button>
                )}
            </div>
        </div>
    );
}