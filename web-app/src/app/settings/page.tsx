'use client';

import { useState } from 'react';
import { Save, Lock, Bell, User, ExternalLink, Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'api-setup'>('api-setup');

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-zinc-400 mt-1">Manage platform connections and application config.</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button
                        onClick={() => setActiveTab('api-setup')}
                        className={clsx("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'api-setup' ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-zinc-300")}
                    >
                        API Setup Guide
                    </button>
                    <button
                        onClick={() => setActiveTab('general')}
                        className={clsx("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'general' ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-zinc-300")}
                    >
                        General Stats
                    </button>
                </div>
            </div>

            {activeTab === 'api-setup' && (
                <div className="space-y-6">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-indigo-200">
                        <h3 className="font-semibold flex items-center mb-2">
                            <Lock className="w-5 h-5 mr-2 text-indigo-500" />
                            How to enable "Real" Posting?
                        </h3>
                        <p className="text-sm opacity-80 leading-relaxed">
                            To allow this app to post on your behalf, you must register it as a "Developer App" with LinkedIn, Facebook, and X.
                            Once registered, you will get a <strong>Client ID</strong> and <strong>Client Secret</strong>.
                            Paste these into the <code className="bg-black/30 px-1.5 py-0.5 rounded text-white font-mono text-xs">.env</code> file in your project folder.
                        </p>
                    </div>

                    <SetupCard
                        platform="LinkedIn"
                        url="https://www.linkedin.com/developers/apps"
                        steps={[
                            "Create a new app in the LinkedIn Developer Portal.",
                            "Under 'Products', request access to 'Sign In with LinkedIn' and 'Share on LinkedIn'.",
                            "In 'Auth', add this Redirect URL: http://localhost:3000/api/auth/linkedin/callback",
                            "Copy Client ID & Secret to your .env file."
                        ]}
                    />

                    <SetupCard
                        platform="Facebook / Instagram"
                        url="https://developers.facebook.com/apps"
                        steps={[
                            "Create an app (Select 'Business' type).",
                            "Add 'Facebook Login' product.",
                            "In 'Facebook Login > Settings', add Redirect URL: http://localhost:3000/api/auth/facebook/callback",
                            "Copy App ID & App Secret from 'Basic Settings' to .env."
                        ]}
                    />

                    <SetupCard
                        platform="X (Twitter)"
                        url="https://developer.twitter.com/en/portal/dashboard"
                        steps={[
                            "Create a Project & App.",
                            "Set 'User authentication settings' to OAuth 2.0.",
                            "Type of App: 'Web App, Automated App or Bot'.",
                            "Callback URL: http://localhost:3000/api/auth/twitter/callback",
                            "Copy API Key & API Key Secret to .env."
                        ]}
                    />
                </div>
            )}

            {activeTab === 'general' && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-indigo-500" />
                            Notifications
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Email Notifications</p>
                                <p className="text-zinc-500 text-sm">Receive a daily digest of posted content.</p>
                            </div>
                            <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SetupCard({ platform, url, steps }: { platform: string, url: string, steps: string[] }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/30">
                <h3 className="font-semibold text-white">{platform} Configuration</h3>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full transition-colors"
                >
                    Open Developer Portal
                    <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
            </div>
            <div className="p-6">
                <ol className="space-y-4">
                    {steps.map((step, i) => (
                        <li key={i} className="flex items-start text-sm text-zinc-400">
                            <span className="flex-shrink-0 w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-mono text-zinc-300 mr-3 mt-0.5">
                                {i + 1}
                            </span>
                            {step}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
