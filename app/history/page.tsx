"use client";

import { useProgress } from '@/hooks/use-progress';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowUpRight,
    BrainCircuit,
    Calendar,
    Database,
    Loader2,
    Search,
    Shield
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
    const { history, loading } = useProgress();

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Querying Architecture Logs</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Database className="w-3.5 h-3.5 text-neutral-600" />
                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.3em]">Telemetry Database</span>
                        </div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Analysis History</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-white/20 transition-all">
                    <Search className="w-4 h-4 text-neutral-600" />
                    <input
                        type="text"
                        placeholder="FILTER_LOGS_..."
                        className="bg-transparent border-none text-[11px] font-black text-white placeholder:text-neutral-800 focus:outline-none w-48 uppercase tracking-widest"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {history.length > 0 ? history.map((resp, i) => (
                    <motion.div
                        key={resp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href={`/responses/${resp.id}`}
                            className="group relative block p-2 rounded-[2rem] hover:bg-white/[0.02] transition-all duration-500"
                        >
                            <div className="glass-card rounded-[1.8rem] p-8 border-white/[0.05] group-hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex flex-col items-center justify-center shadow-2xl group-hover:border-white/20 transition-all">
                                        <span className="text-2xl font-black text-white tracking-tighter">{resp.score?.toFixed(1)}</span>
                                        <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">AIX</span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">COMPLETED</span>
                                            <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest select-none">•</span>
                                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">SID: 0x{resp.id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-neutral-200 group-hover:text-white transition-colors tracking-tight">
                                            Architectural Training Session #{resp.id.slice(-4)}
                                        </h3>
                                        <div className="flex items-center gap-6 mt-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                                                <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                {new Date(resp.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest">
                                                <BrainCircuit className="w-3.5 h-3.5 text-neutral-500" />
                                                Critique Available
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 pr-4">
                                    <div className="hidden lg:flex flex-col items-end gap-2">
                                        <div className="flex gap-1.5">
                                            {[1, 1, 1, 1, 0].map((s, idx) => (
                                                <div key={idx} className={`w-4 h-1 rounded-full ${s === 1 ? 'bg-white/40' : 'bg-neutral-800'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">Reasoning_Verified</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500 group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )) : (
                    <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-white/[0.03] bg-white/[0.01]">
                        <Shield className="w-16 h-16 text-neutral-800 mx-auto mb-8 opacity-20" />
                        <h3 className="text-lg font-black text-neutral-500 uppercase tracking-[0.3em] mb-4">Archive Empty</h3>
                        <p className="text-[11px] text-neutral-700 uppercase tracking-[0.2em] mb-10">No verified training sessions found in the telemetry logs.</p>
                        <Link href="/dashboard" className="premium-button text-[11px] px-10 py-4">
                            Initialize Training Session
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
