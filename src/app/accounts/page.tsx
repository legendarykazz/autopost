'use client';

import { useState, useEffect } from 'react';
import { Share2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Platform } from '@/lib/types';

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/accounts');
            let connectedAccounts: any[] = [];

            if (res.ok) {
                connectedAccounts = await res.json();
            }

            const platforms = [
                { id: 'linkedin', name: 'LinkedIn', connected: false, username: '', color: 'bg-blue-600' },
                { id: 'twitter', name: 'X (Twitter)', connected: false, username: '', color: 'bg-black' },
                { id: 'facebook', name: 'Facebook', connected: false, username: '', color: 'bg-blue-500' },
                { id: 'instagram', name: 'Instagram', connected: false, username: '', color: 'bg-pink-600' },
            ];

            const merged = platforms.map(p => {
                const match = connectedAccounts.find((acc: any) => acc.platform === p.id);
                if (match) {
                    return {
                        ...p,
                        connected: true,
                        username: match.platformUser || 'Connected'
                    };
                }
                return p;
            });

            setAccounts(merged);
        } catch (error) {
            console.error('Failed to fetch accounts', error);
        } finally {
            setLoading(false);
        }
    };

    const [isConnecting, setIsConnecting] = useState<string | null>(null);

    const handleConnect = (platformId: string) => {
        // Redirect to our generic Auth handler
        // This will eventually take the user to LinkedIn/FB login screens
        window.location.href = `/api/auth/${platformId}/login`;
    };

    const handleDisconnect = (platformId: string) => {
        if (confirm('Are you sure you want to disconnect this account?')) {
            setAccounts(accounts.map(acc => {
                if (acc.id === platformId) {
                    return { ...acc, connected: false, username: '' };
                }
                return acc;
            }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Connected Accounts</h1>
                <p className="text-zinc-400 mt-1">Manage your social media connections and API tokens.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                    <div
                        key={account.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-white", account.color)}>
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg">{account.name}</h3>
                                    {account.connected ? (
                                        <p className="text-sm text-zinc-400">{account.username}</p>
                                    ) : (
                                        <p className="text-sm text-zinc-500">Not connected</p>
                                    )}
                                </div>
                            </div>

                            {account.connected ? (
                                <div className="flex items-center text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Active
                                </div>
                            ) : (
                                <div className="flex items-center text-zinc-500 text-xs font-medium bg-zinc-800 px-2 py-1 rounded-full">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Disconnected
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-800">
                            {account.connected ? (
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500">
                                        Auto-renews in 28 days
                                    </div>
                                    <button
                                        onClick={() => handleDisconnect(account.id)}
                                        className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleConnect(account.id)}
                                    disabled={isConnecting === account.id}
                                    className="w-full flex items-center justify-center py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isConnecting === account.id ? 'Connecting...' : 'Connect Account'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6">
                <h3 className="text-indigo-400 font-medium mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Developer Note
                </h3>
                <p className="text-sm text-zinc-400">
                    Since this is a local MVP, "Connecting" above simulates a successful API handshake.
                    To post for real, we will need to input actual App IDs and Secrets in a `.env` file or a secure settings modal.
                </p>
            </div>
        </div>
    );
}
