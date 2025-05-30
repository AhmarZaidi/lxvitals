import { Metadata } from 'next';
import './globals.scss';
import { ReactNode } from 'react';
import ThemeProvider from '@/app/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'Samba Vitals - Server Dashboard',
  description: 'Monitor your server vitals on the network',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
