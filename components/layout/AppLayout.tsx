"use client";

import { useProgress } from '@/hooks/use-progress';
import { useUser } from '@/hooks/use-user';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BrainCircuit,
    Globe,
    LayoutDashboard,
    LogOut,
    Menu,
    ShieldCheck,
    Terminal,
    Trophy,
    User,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Engineering Tasks', icon: Terminal, href: '/tasks' },
    { name: 'Thinking Drills', icon: BrainCircuit, href: '/drills' },
    { name: 'Achievements', icon: Trophy, href: '/achievements' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { user } = useUser();
    const { stats } = useProgress();

    const getRank = (score: number) => {
        if (score >= 9) return "Principal Architect";
        if (score >= 8) return "Elite Architect";
        if (score >= 6) return "Senior Architect";
        if (score >= 4) return "Systems Architect";
        return "Field Analyst";
    };

    const userRank = getRank(stats?.average_score || 0);

    const handleLogout = () => {
        localStorage.removeItem('cortex_token');
        router.push('/login');
    };

    // If we are on public pages, we don't want the sidebar
    const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

    if (isPublicPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <div className="fixed inset-0 dot-pattern opacity-40 pointer-events-none" />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '260px' : '88px',
                    x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
                }}
                className={`fixed lg:relative z-[70] h-screen flex flex-col bg-black border-r border-white/[0.05] transition-all duration-300 shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden`}
            >
                <div className="p-8 flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <Zap className="w-6 h-6 text-black fill-black" />
                    </div>
                    {isSidebarOpen && (
                        <span className="font-black text-xl tracking-tighter text-white">
                            CORTEX
                        </span>
                    )}
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`
                                    flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                        : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                    }
                                `}>
                                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-black' : ''}`} />
                                    {isSidebarOpen && (
                                        <span className="text-[13px] font-bold uppercase tracking-widest whitespace-nowrap">{item.name}</span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    {user?.is_admin && (
                        <Link href="/admin">
                            <div className={`
                                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                                ${pathname === '/admin'
                                    ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                    : 'text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/5'
                                }
                            `}>
                                <ShieldCheck className="w-5 h-5 shrink-0" />
                                {isSidebarOpen && (
                                    <span className="text-[13px] font-bold uppercase tracking-widest whitespace-nowrap">Admin Core</span>
                                )}
                            </div>
                        </Link>
                    )}
                </nav>

                {/* Secure Environment Badge */}
                {isSidebarOpen && (
                    <div className="mx-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Environment Secure</span>
                        </div>
                        <p className="text-[10px] text-neutral-600 font-medium leading-relaxed">
                            Encrypted session active via Cortex Shield-v2
                        </p>
                    </div>
                )}

                <div className="p-4 border-t border-white/[0.05] space-y-2">
                    <Link href="/profile">
                        <div className={`
                            flex items-center gap-4 px-4 py-3 rounded-2xl text-neutral-500 hover:bg-white/5 hover:text-white transition-all group
                            ${isSidebarOpen ? '' : 'justify-center'}
                        `}>
                            <User className="w-5 h-5 shrink-0" />
                            {isSidebarOpen && <span className="text-[13px] font-bold uppercase tracking-widest">Profile</span>}
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`
                            flex items-center gap-4 px-4 py-3 rounded-2xl text-neutral-500 hover:bg-red-500/10 hover:text-red-500 transition-all group w-full cursor-pointer
                            ${isSidebarOpen ? '' : 'justify-center'}
                        `}>
                        <LogOut className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span className="text-[13px] font-bold uppercase tracking-widest">Terminate</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-10 border-b border-white/[0.05] bg-black/50 backdrop-blur-xl z-[50] shrink-0">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 1024) setMobileMenuOpen(true);
                                else setSidebarOpen(!isSidebarOpen);
                            }}
                            className="p-3 -ml-3 text-neutral-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-white/10 hidden md:block" />
                        <h1 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">
                            {sidebarItems.find(i => i.href === pathname)?.name || 'Cortex Core'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden xl:flex items-center gap-3 pr-6 border-r border-white/10">
                            <Globe className="w-4 h-4 text-neutral-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Region: Global_Edge</span>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="text-right hidden md:block">
                                <p className="text-[12px] font-black text-white leading-none uppercase tracking-widest">{user?.full_name || 'Architect'}</p>
                                <p className="text-[9px] text-neutral-500 mt-1.5 font-bold uppercase tracking-wider">{user?.selected_role || userRank}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white text-xs font-black uppercase shadow-xl ring-1 ring-white/10">
                                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'EX'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
                    <div className="p-10 max-w-[1600px] mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full"
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
