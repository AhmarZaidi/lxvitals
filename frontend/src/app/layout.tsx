import { Metadata } from 'next';
import './globals.scss';
import { ReactNode } from 'react';
import ThemeProvider from '@/app/providers/ThemeProvider';
import { AppProvider } from '@/app/context/AppContext';

export const metadata: Metadata = {
    title: 'Samba Vitals - Server Dashboard',
    description: 'Monitor your server vitals on the network',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    <AppProvider>{children}</AppProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
