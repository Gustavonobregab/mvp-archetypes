import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { DEMO } from '@/lib/demo-config';
import '@mvp/kernel/theme.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: `${DEMO.org.short} ${DEMO.org.product}`,
  description: DEMO.org.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
