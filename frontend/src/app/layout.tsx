import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Server Dashboard',
  description: 'Monitor your server vitals on the network',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}