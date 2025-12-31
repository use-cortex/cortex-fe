"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useProgress } from '@/hooks/use-progress';
import {
    LayoutDashboard,
    Terminal,
    BrainCircuit,
    Trophy,
    Settings,
    LogOut,
    ChevronRight,
    User,
    Zap,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex min-h-screen bg-black text-white overflow-hidden">
            <div className="bg-gradient" />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '220px' : '72px',
                    x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
                }}
                className={`fixed lg:relative z-50 h-screen flex flex-col bg-black border-r border-white/5 transition-all duration-300`}
            >
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-black fill-black" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-lg tracking-tighter text-white">
                                CORTEX
                            </span>
                        )}
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group
                  ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200'
                                    }
                `}>
                                    <item.icon className="w-4.5 h-4.5 shrink-0" />
                                    {isSidebarOpen && (
                                        <span className="text-[13px] font-medium whitespace-nowrap">{item.name}</span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-white/5 space-y-1">
                    <Link href="/admin">
                        <div className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200 transition-all group
              ${isSidebarOpen ? '' : 'justify-center'}
            `}>
                            <Settings className="w-4.5 h-4.5 shrink-0" />
                            {isSidebarOpen && <span className="text-[13px] font-medium">Admin Ops</span>}
                        </div>
                    </Link>
                    <Link href="/profile">
                        <div className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200 transition-all group
              ${isSidebarOpen ? '' : 'justify-center'}
            `}>
                            <User className="w-4.5 h-4.5 shrink-0" />
                            {isSidebarOpen && <span className="text-[13px] font-medium">Profile</span>}
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`
            flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-500 hover:bg-white/5 hover:text-white transition-all group w-full cursor-pointer
            ${isSidebarOpen ? '' : 'justify-center'}
          `}>
                        <LogOut className="w-4.5 h-4.5 shrink-0" />
                        {isSidebarOpen && <span className="text-[13px] font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-neutral-400 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-sm font-semibold text-neutral-200">
                            {sidebarItems.find(i => i.href === pathname)?.name || 'Cortex'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold">
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>{stats?.current_streak || 0} DAY STREAK</span>
                        </div>

                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-[12px] font-semibold text-neutral-200 leading-none">{user?.full_name || 'Architect'}</p>
                                <p className="text-[10px] text-neutral-500 mt-1">{user?.selected_role || userRank}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white text-[10px] font-black uppercase">
                                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'EX'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-5xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
