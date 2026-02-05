'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenSquare, Settings, Share2, BarChart3, CloudLightning, ListOrdered } from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Create Post', href: '/create', icon: PenSquare },
    { name: 'Queue', href: '/queue', icon: ListOrdered },
    { name: 'Accounts', href: '/accounts', icon: Share2 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-zinc-900 border-r border-zinc-800">
            <div className="flex h-16 items-center px-6 border-b border-zinc-800">
                <CloudLightning className="h-6 w-6 text-indigo-500 mr-2" />
                <span className="text-xl font-bold text-white tracking-tight">AutoPost</span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    isActive
                                        ? 'bg-zinc-800 text-white'
                                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white',
                                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        isActive ? 'text-indigo-500' : 'text-zinc-500 group-hover:text-white',
                                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                        U
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">User</p>
                        <p className="text-xs text-zinc-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
