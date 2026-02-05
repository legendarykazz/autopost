'use client';

import { useState, useRef } from 'react';
import { Calendar, Image as ImageIcon, Send, Clock, Check, Video, X, UploadCloud, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Platform } from '@/lib/types';

export default function CreatePostPage() {
    const [content, setContent] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    // Scheduling State
    const [scheduleDate, setScheduleDate] = useState('');
    const [isScheduleMode, setIsScheduleMode] = useState(false);

    // Media State
    const [mediaType, setMediaType] = useState<'TEXT' | 'IMAGE' | 'VIDEO'>('TEXT');
    const [mediaUrl, setMediaUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const platforms = [
        { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
        { id: 'twitter', name: 'X (Twitter)', color: 'bg-black' },
        { id: 'facebook', name: 'Facebook', color: 'bg-blue-500' },
        { id: 'instagram', name: 'Instagram', color: 'bg-pink-600' },
    ];

    const togglePlatform = (id: string) => {
        if (selectedPlatforms.includes(id)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
        } else {
            setSelectedPlatforms([...selectedPlatforms, id]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (res.ok) {
                setMediaUrl(data.url);
                setMediaType(data.type);
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setIsUploading(false);
        }
    };

    const clearMedia = () => {
        setMediaUrl('');
        setMediaType('TEXT');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePost = async () => {
        setIsPosting(true);
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    platforms: selectedPlatforms,
                    mediaType,
                    mediaUrl: mediaType !== 'TEXT' ? mediaUrl : undefined,
                    scheduledDate: scheduleDate ? new Date(scheduleDate) : undefined
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(scheduleDate ? 'Post scheduled successfully!' : 'Post dispatched successfully! Check dashboard.');
                setContent('');
                clearMedia();
                setSelectedPlatforms([]);
                setScheduleDate('');
                setIsScheduleMode(false);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Failed to post:', error);
            alert('Failed to connect to server.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Create Post</h1>
                <p className="text-zinc-400 mt-1">Write once, publish everywhere.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-4">

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full h-32 bg-transparent text-lg text-white placeholder-zinc-500 focus:outline-none resize-none"
                        />

                        {/* Media Preview / Upload Area */}
                        <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/30 transition-all">
                            {(mediaUrl || isUploading) ? (
                                <>
                                    {isUploading ? (
                                        <div className="h-48 flex flex-col items-center justify-center text-zinc-500">
                                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
                                            <span className="text-sm font-medium">Uploading media...</span>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <button
                                                onClick={clearMedia}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                                            >
                                                <X size={16} />
                                            </button>

                                            {mediaType === 'IMAGE' && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={mediaUrl} alt="Preview" className="w-full max-h-96 object-contain bg-black/40" />
                                            )}
                                            {mediaType === 'VIDEO' && (
                                                <video src={mediaUrl} controls className="w-full max-h-96 bg-black" />
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Empty State - Click to upload
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-24 border-2 border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/20 rounded-lg flex flex-col items-center justify-center text-zinc-500 cursor-pointer transition-all group"
                                >
                                    <div className="flex items-center space-x-2 group-hover:text-zinc-400">
                                        <UploadCloud className="w-5 h-5" />
                                        <span className="text-sm font-medium">Click to upload photo or video</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 mt-1">Supports JPG, PNG, MP4</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            {/* Hidden Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center text-zinc-400 hover:text-indigo-400 text-sm transition-colors py-2"
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Add Media
                                </button>
                            </div>

                            <div className="text-xs text-zinc-500">
                                {content.length} characters
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsScheduleMode(!isScheduleMode)}
                                    className={clsx(
                                        "flex items-center px-4 py-2 border rounded-lg transition-colors",
                                        isScheduleMode
                                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
                                    )}
                                >
                                    <Clock className="w-4 h-4 mr-2" />
                                    {scheduleDate ? new Date(scheduleDate).toLocaleString() : 'Schedule'}
                                </button>

                                {isScheduleMode && (
                                    <div className="absolute top-full left-0 mt-2 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20 w-72 animate-in fade-in zoom-in-95 duration-200">
                                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                            Pick Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            min={new Date().toISOString().slice(0, 16)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handlePost}
                            disabled={isPosting || (!content && !mediaUrl) || selectedPlatforms.length === 0}
                            className={clsx(
                                "flex items-center px-6 py-2 rounded-lg font-medium transition-all transform active:scale-95",
                                isPosting || (!content && !mediaUrl) || selectedPlatforms.length === 0
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                            )}
                        >
                            {isPosting ? (scheduleDate ? 'Scheduling...' : 'Posting...') : (
                                <>
                                    {scheduleDate ? <Calendar className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                    {scheduleDate ? 'Confirm Schedule' : 'Post Now'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Select Platforms</h3>
                        <div className="space-y-3">
                            {platforms.map((platform) => {
                                const isSelected = selectedPlatforms.includes(platform.id);
                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() => togglePlatform(platform.id)}
                                        className={clsx(
                                            "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                                            isSelected
                                                ? "bg-zinc-800 border-indigo-500/50"
                                                : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <div className={clsx("w-3 h-3 rounded-full mr-3", platform.color)} />
                                            <span className={clsx("text-sm font-medium", isSelected ? "text-white" : "text-zinc-400")}>
                                                {platform.name}
                                            </span>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-indigo-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Preview</h3>
                        <div className="bg-white rounded-lg p-4 min-h-[120px]">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-200" />
                                <div className="ml-2">
                                    <div className="w-24 h-3 bg-zinc-200 rounded" />
                                    <div className="w-16 h-2 bg-zinc-100 rounded mt-1" />
                                </div>
                            </div>

                            <p className="text-zinc-800 text-sm whitespace-pre-wrap leading-relaxed">
                                {content || "Your post content..."}
                            </p>

                            {mediaType === 'IMAGE' && mediaUrl && (
                                <div className="mt-3 rounded-md bg-zinc-100 border border-zinc-200 h-48 flex items-center justify-center overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            {mediaType === 'VIDEO' && mediaUrl && (
                                <div className="mt-3 rounded-md bg-black h-48 flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                        <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                    <video src={mediaUrl} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
