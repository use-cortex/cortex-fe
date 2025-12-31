"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Terminal,
    BrainCircuit,
    Trophy,
    ArrowUpRight,
    CheckCircle2,
    TrendingUp,
    Target,
    Loader2
} from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';
import { useDailyChallenge } from '@/hooks/use-tasks';
import Link from 'next/link';

export default function Dashboard() {
    const { stats, history, loading: progressLoading } = useProgress();
    const { task: dailyTask, loading: taskLoading } = useDailyChallenge();

    if (progressLoading || taskLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
        );
    }

    const statCards = [
        { label: 'Tasks Completed', value: stats?.total_tasks_completed || 0, icon: CheckCircle2 },
        { label: 'Think Score', value: stats?.average_score?.toFixed(1) || '0.0', icon: Target },
        { label: 'Total Score', value: stats?.total_score?.toFixed(0) || 0, icon: BrainCircuit },
        { label: 'Current Streak', value: `${stats?.current_streak || 0}d`, icon: Trophy },
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
        <div className="space-y-10 py-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-2xl border border-white/5 bg-neutral-900/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className="w-4 h-4 text-neutral-500" />
                            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Stats</span>
                        </div>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                        <p className="text-[12px] text-neutral-500 font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Daily Challenge */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-white fill-white" />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Daily Challenge</h2>
                        </div>

                        {dailyTask ? (
                            <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 p-6 transition-all hover:border-white/20">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-105 transition-transform duration-700">
                                    <Terminal className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                                            {dailyTask.difficulty}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                                            {dailyTask.estimated_time_minutes} Mins
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                        {dailyTask.title}
                                    </h3>
                                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed line-clamp-2">
                                        {dailyTask.description}
                                    </p>
                                    <Link href={`/tasks/${dailyTask.id}`} className="inline-flex items-center gap-2 bg-white text-black px-5 py-2 rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors">
                                        Launch Task
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 rounded-2xl border border-dashed border-white/10 flex flex-col items-center text-neutral-500">
                                <p className="text-sm font-medium">No challenges available today.</p>
                            </div>
                        )}
                    </section>

                    {/* Recent History */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest">Recent History</h2>
                            <Link href="/history" className="text-[11px] font-bold text-neutral-500 hover:text-white uppercase tracking-widest transition-colors">View All Analysis</Link>
                        </div>
                        <div className="space-y-2">
                            {history.length > 0 ? history.slice(0, 3).map((resp) => (
                                <Link
                                    key={resp.id}
                                    href={`/responses/${resp.id}`}
                                    className="p-4 rounded-xl border border-white/5 bg-neutral-900/10 flex items-center justify-between hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center font-bold text-xs text-white">
                                            {resp.score?.toFixed(1)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">Architectural Analysis</h4>
                                            <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-bold mt-1">
                                                {new Date(resp.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-2 text-neutral-600 group-hover:text-white transition-colors">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-8 text-center border border-white/5 rounded-xl text-neutral-600 text-xs font-medium">
                                    No activity recorded yet.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    {/* Thinking Drills Card */}
                    <section className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                            <BrainCircuit className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-white">Intuition Warmup</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                                Sharpen your gut feeling with rapid-fire engineering drills.
                            </p>
                            <Link href="/drills" className="w-full py-2.5 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-widest text-center block hover:bg-neutral-200 transition-colors">
                                START DRILLS
                            </Link>
                        </div>
                    </section>

                    <section className="p-5 rounded-2xl border border-white/5 bg-neutral-900/10">
                        <h3 className="text-[12px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-white" />
                            Skill Breakdown
                        </h3>
                        <div className="space-y-5">
                            <SkillProgress label="Clarity" value={averages.clarity} />
                            <SkillProgress label="Constraints" value={averages.constraints} />
                            <SkillProgress label="Trade-offs" value={averages.trade_offs} />
                            <SkillProgress label="Failure" value={averages.failure} />
                        </div>
                        <div className="mt-8 pt-5 border-t border-white/5">
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest mb-3">
                                <span className="text-neutral-500">Overall Rank</span>
                                <span className="text-white">{rank}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${rankProgress}%` }} />
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
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-neutral-500">{label}</span>
                <span className="text-neutral-300">{value}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-neutral-400"
                />
            </div>
        </div>
    );
}
