import Link from 'next/link';
import { ArrowRight, Layout, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Antigravity</span>
          </div>
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <span className="flex w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
            Now in Public Beta
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-500 text-transparent bg-clip-text pb-2">
            Automate your <br /> Social Presence.
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Connect your accounts, queue your content, and let our Antigravity Engine handle the rest. Secure, fast, and multi-user ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="group px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-all transform hover:scale-105 flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com/your-repo"
              className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <Feature
            icon={Shield}
            title="Secure by Design"
            desc="Your tokens are isolated. Multi-user architecture ensures your data stays yours."
          />
          <Feature
            icon={Layout}
            title="Unified Dashboard"
            desc="Write once, post everywhere. Drag-and-drop queue management built in."
          />
          <Feature
            icon={Zap}
            title="Antigravity Engine"
            desc="High-performance background dispatching to LinkedIn, X, FB, and Instagram."
          />
        </div>
      </main>

      <footer className="border-t border-zinc-900 py-8 text-center text-zinc-600 text-sm">
        &copy; 2024 Antigravity App. Built for creators.
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-white">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  )
}
