import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutoPost - Social Automation',
  description: 'Manage all your social media in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} h-full overflow-hidden flex`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
