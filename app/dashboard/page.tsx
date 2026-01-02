"use client";

import { useProgress } from '@/hooks/use-progress';
import { useDailyChallenge } from '@/hooks/use-tasks';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowUpRight,
    BrainCircuit,
    CheckCircle2,
    Loader2,
    Target,
    Terminal,
    TrendingUp,
    Trophy,
    Zap
} from 'lucide-react';
import Link from 'next/link';
export default function Dashboard() {
    const { stats, history, loading: progressLoading } = useProgress();
    const { task: dailyTask, loading: taskLoading } = useDailyChallenge();

    if (progressLoading || taskLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Syncing Intelligence Data</span>
            </div>
        );
    }

    const statCards = [
        { label: 'Analyses Deployed', value: stats?.total_tasks_completed || 0, icon: CheckCircle2, trend: '+2 this week' },
        { label: 'Architectural Index', value: stats?.average_score?.toFixed(1) || '0.0', icon: Target, trend: 'Top 5%' },
        { label: 'Cumulative XP', value: stats?.total_score?.toFixed(0) || 0, icon: BrainCircuit, trend: 'Level 14' },
        { label: 'Thinking Streak', value: `${stats?.current_streak || 0} Days`, icon: Trophy, trend: 'Personal Best' },
    ];

    const calculateAverageBreakdown = () => {
        if (!history || history.length === 0) return { clarity: 0, constraints: 0, trade_offs: 0, failure: 0, simplicity: 0 };

        const totals = history.reduce((acc, resp) => {
            if (!resp.score_breakdown) return acc;
            acc.clarity += resp.score_breakdown.clarity || 0;
            acc.constraints += resp.score_breakdown.constraints_awareness || 0;
            acc.trade_offs += resp.score_breakdown.trade_off_reasoning || 0;
            acc.failure += resp.score_breakdown.failure_anticipation || 0;
            acc.simplicity += resp.score_breakdown.simplicity || 0;
            return acc;
        }, { clarity: 0, constraints: 0, trade_offs: 0, failure: 0, simplicity: 0 });

        const count = history.filter(r => r.score_breakdown).length || 1;
        return {
            clarity: Math.round(totals.clarity / count * 10),
            constraints: Math.round(totals.constraints / count * 10),
            trade_offs: Math.round(totals.trade_offs / count * 10),
            failure: Math.round(totals.failure / count * 10),
        };
    };

    const averages = calculateAverageBreakdown();

    const getRank = (score: number) => {
        if (score >= 9) return "Principal Architect";
        if (score >= 8) return "Senior Architect";
        if (score >= 6) return "Systems Engineer";
        if (score >= 4) return "Associate Engineer";
        return "Novice Analyst";
    };

    const rank = getRank(stats?.average_score || 0);
    const rankProgress = ((stats?.average_score || 0) / 10) * 100;

    return (
        <div className="space-y-12 pb-10">
            {/* Upper Section with Banner */}
            <header className="relative p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700">
                    <Activity className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">System Online</span>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">v2.4.0 Patch Applied</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-4">
                            Welcome back, <br />
                            Architect <span className="text-neutral-500">0x{stats?.user_id?.slice(-4) || '7E2'}</span>
                        </h1>
                        <p className="text-neutral-400 max-w-lg text-sm font-medium leading-relaxed">
                            Your architectural reasoning has improved by <span className="text-white">12%</span> since last month. Keep pushing the boundaries of system design.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/tasks" className="premium-button flex items-center gap-2">
                            <span>Launch Terminal</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="glass-card rounded-3xl p-8 relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <stat.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <p className="text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</p>
                        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.1em]">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Daily Challenge Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-white" />
                                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Priority Assignment</h2>
                            </div>
                        </div>

                        {dailyTask ? (
                            <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group border-white/[0.08]">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-1000">
                                    <Terminal className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-widest border border-white/10 text-neutral-400">
                                            {dailyTask.difficulty}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-neutral-800" />
                                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                                            Estimated {dailyTask.estimated_time_minutes} Mins
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 leading-tight tracking-tighter">
                                        {dailyTask.title}
                                    </h3>
                                    <p className="text-neutral-400 mb-10 leading-relaxed font-medium line-clamp-2 max-w-xl">
                                        {dailyTask.description}
                                    </p>
                                    <Link href={`/tasks/${dailyTask.id}`} className="premium-button inline-flex items-center gap-2">
                                        <span>Initiate Analysis</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-20 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center text-neutral-600">
                                <Activity className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Intelligence Grid Depleted</p>
                                <p className="text-[11px] mt-2">Checking for new assignments...</p>
                            </div>
                        )}
                    </section>

                    {/* History Feed */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Analysis Archive</h2>
                            <Link href="/history" className="text-[10px] font-black text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                                Full History <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="grid gap-3">
                            {history.length > 0 ? history.slice(0, 4).map((resp) => (
                                <Link
                                    key={resp.id}
                                    href={`/responses/${resp.id}`}
                                    className="p-6 rounded-2xl border border-white/[0.03] bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center font-black text-sm text-white shadow-xl">
                                            {resp.score?.toFixed(1)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors">Architectural Submission</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                                                    {new Date(resp.submitted_at).toLocaleDateString()}
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-neutral-800" />
                                                <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 group-hover:text-white group-hover:bg-white/5 transition-all">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-12 text-center glass-card rounded-2xl text-neutral-600 text-[11px] font-bold uppercase tracking-widest">
                                    No archive entries detected.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-10">
                    <section className="glass-card rounded-[2rem] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                            <BrainCircuit className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-white">Neural Conditioning</h3>
                            <p className="text-[13px] text-neutral-500 leading-relaxed mb-8">
                                Rapid-fire scenarios to align your engineering intuition with Staff+ level reasoning.
                            </p>
                            <Link href="/drills" className="premium-button w-full flex items-center justify-center gap-2 py-3">
                                <span>Warmup Grid</span>
                            </Link>
                        </div>
                    </section>

                    <section className="glass-card rounded-[2rem] p-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-white" />
                            Reasoning Matrix
                        </h3>
                        <div className="space-y-6">
                            <SkillProgress label="Structural Clarity" value={averages.clarity} />
                            <SkillProgress label="Constraint Solving" value={averages.constraints} />
                            <SkillProgress label="Trade-off Logic" value={averages.trade_offs} />
                            <SkillProgress label="Failure Defense" value={averages.failure} />
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/[0.05]">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                                <span className="text-neutral-500">Global Rank</span>
                                <span className="text-white bg-white/5 px-2 py-0.5 rounded border border-white/5">{rank}</span>
                            </div>
                            <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                                <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-1000" style={{ width: `${rankProgress}%` }} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SkillProgress({ label, value }: { label: string, value: number }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.1em]">
                <span className="text-neutral-500">{label}</span>
                <span className="text-neutral-300">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden p-0.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-neutral-300 rounded-full"
                />
            </div>
        </div>
    );
}
