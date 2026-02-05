'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading analytics...
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
                <p className="text-zinc-400 mt-1">Deep dive into your content performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Est. Reach', value: stats.overview.impressions.toLocaleString(), change: 'Real', icon: Eye },
                    { label: 'Engagement Rate', value: stats.overview.engagementRate, change: 'Live', icon: TrendingUp },
                    { label: 'Followers', value: stats.overview.followers, change: 'Mock', icon: Users },
                    { label: 'Posts Published', value: stats.overview.posts, change: 'Total', icon: BarChart3 },
                ].map((stat) => (
                    <div key={stat.label} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <stat.icon className="h-5 w-5 text-indigo-500" />
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-6">Engagement Over Time</h3>
                    <div className="flex items-center justify-center h-full text-zinc-500 pb-12">
                        [Placeholder for Line Chart]
                    </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-6">Platform Performance</h3>
                    <div className="flex items-center justify-center h-full text-zinc-500 pb-12">
                        [Placeholder for Bar Chart]
                    </div>
                </div>
            </div>
        </div>
    );
}
