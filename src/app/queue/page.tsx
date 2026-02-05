'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Trash2, Calendar, GripVertical, FileText, Image as ImageIcon, Video, Clock, Play } from 'lucide-react';
import { Post } from '@/lib/types';
import { clsx } from 'clsx';

// Helper removed in favor of real date
const getScheduledTime = (post: Post, index: number) => {
    if (post.scheduledDate) return new Date(post.scheduledDate);

    // Fallback for queued items without specific date
    const date = new Date();
    date.setDate(date.getDate() + 1 + index);
    date.setHours(10, 0, 0, 0);
    return date;
};

const Countdown = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Due');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else {
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        calculate();
        const interval = setInterval(calculate, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex items-center text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
            <Clock size={12} className="mr-1.5" />
            {timeLeft}
        </div>
    );
};

export default function QueuePage() {
    const [queue, setQueue] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await fetch('/api/queue');
            const data = await res.json();
            setQueue(data);
        } catch (error) {
            console.error('Failed to load queue', error);
        } finally {
            setLoading(false);
        }
    };

    const moveItem = async (index: number, direction: 'up' | 'down') => {
        const newQueue = [...queue];
        if (direction === 'up' && index > 0) {
            [newQueue[index], newQueue[index - 1]] = [newQueue[index - 1], newQueue[index]];
        } else if (direction === 'down' && index < newQueue.length - 1) {
            [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
        } else {
            return;
        }

        // Update local state optimized
        setQueue(newQueue);

        // Prepare API payload with new positions
        const updates = newQueue.map((item, idx) => ({
            id: item.id,
            queuePosition: idx + 1
        }));

        await fetch('/api/queue', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updates })
        });
    };

    const deleteItem = async (id: string) => {
        if (!confirm("Are you sure you want to remove this post from the queue?")) return;

        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setQueue(queue.filter(q => q.id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert('Error deleting post');
        }
    };



    const runScheduler = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/scheduler');
            const data = await res.json();
            alert(`Scheduler Result: ${JSON.stringify(data)}`);
            fetchQueue(); // Refresh queue
        } catch (error) {
            alert('Failed to run scheduler');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading queue...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Weekly Queue</h1>
                    <p className="text-zinc-400 mt-1">Manage your upcoming content pipeline. (Auto-posting daily at 10 AM)</p>
                </div>
                <button
                    onClick={runScheduler}
                    className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium border border-zinc-700"
                >
                    <Play size={14} className="mr-2" />
                    <span>Run Scheduler</span>
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                {queue.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        <p>No posts in the queue.</p>
                        <a href="/create" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">Create one?</a>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800">
                        {queue.map((post, index) => (
                            <div key={post.id} className="p-4 flex items-center group hover:bg-zinc-950/30 transition-colors">
                                <div className="mr-4 text-zinc-600 font-mono text-sm w-6">
                                    #{index + 1}
                                </div>

                                <div className="mr-4 p-2 bg-zinc-800 rounded text-zinc-400">
                                    {post.mediaType === 'VIDEO' ? <Video size={20} /> :
                                        post.mediaType === 'IMAGE' ? <ImageIcon size={20} /> : <FileText size={20} />}
                                </div>

                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="text-white truncate font-medium">{post.content}</p>
                                    <div className="flex items-center text-xs text-zinc-500 mt-1 space-x-2">
                                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded">
                                            {/* @ts-ignore - DB model vs Type mismatch in arrays */}
                                            {post.platforms ? JSON.parse(post.platforms as string).join(', ') : 'No platforms'}
                                        </span>
                                        {post.mediaUrl && <span className="text-indigo-400/80 max-w-[200px] truncate">{post.mediaUrl}</span>}
                                        {post.status === 'scheduled' && <span className="text-emerald-400 bg-emerald-400/10 px-1.5 rounded">Scheduled</span>}
                                    </div>
                                </div>

                                <div className="hidden lg:flex flex-col items-end justify-center mr-6 min-w-[100px]">
                                    <Countdown targetDate={getScheduledTime(post, index)} />
                                    <span className="text-[10px] text-zinc-600 mt-1">
                                        {getScheduledTime(post, index).toLocaleDateString()} {getScheduledTime(post, index).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 opacity-100 lg:opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === queue.length - 1}
                                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <div className="w-px h-4 bg-zinc-800 mx-2" />
                                    <button
                                        onClick={() => deleteItem(post.id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded text-zinc-400 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
