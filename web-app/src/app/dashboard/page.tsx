import { BarChart3, Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth'; // Ensure we use server check if needed, or rely on middleware

export default async function DashboardPage() {
    const user = await getCurrentUser();

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-zinc-400 mt-1">Welcome back, {user?.name || 'Creator'}.</p>
                </div>
                <Link
                    href="/create"
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Post
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Posts" value="-" icon={Share2} trend="Syncing..." />
                <StatsCard title="Total Likes" value="-" icon={Heart} trend="Syncing..." />
                <StatsCard title="Comments" value="-" icon={MessageCircle} trend="Syncing..." />
                <StatsCard title="Avg. Engagement" value="-" icon={BarChart3} trend="Syncing..." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
                        Activity stream requires real data (Coming in Phase 3)
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Limits</h3>
                    <div className="space-y-4 text-zinc-400 text-sm">
                        <div className="flex justify-between">
                            <span>Daily Posts</span>
                            <span className="text-white">0 / 10</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full w-[0%]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-500" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    {trend}
                </span>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
    );
}
