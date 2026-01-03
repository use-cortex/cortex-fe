"use client";

import api from '@/lib/api';
import { Drill } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    Info,
    Loader2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DrillsPage() {
    const [drill, setDrill] = useState<Drill | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<{ is_correct: boolean, explanation: string, correct_answer: string } | null>(null);

    const fetchDrill = async () => {
        try {
            setLoading(true);
            setIsSubmitted(false);
            setSelectedOption(null);
            setResult(null);
            const response = await api.get('/drills/random');
            setDrill(response.data);
        } catch (err) {
            console.error('Failed to fetch drill:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrill();
    }, []);

    const handleSubmit = async () => {
        if (!drill || !selectedOption) return;
        try {
            const response = await api.post('/drills/submit', {
                drill_id: drill.id,
                user_answer: selectedOption
            });
            setResult(response.data);
            setIsSubmitted(true);
        } catch (err) {
            console.error('Submission failed:', err);
        }
    };

    if (loading && !drill) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-700" />
            </div>
        );
    }

    if (!drill) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-neutral-500">
                <p className="text-sm font-medium">No more drills available today.</p>
                <Link href="/dashboard" className="mt-4 text-white font-bold text-xs underline uppercase tracking-widest">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter">Thinking Drills</h1>
                        <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Rapid technical intuition warmup.</p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Session</span>
                    <div className="flex gap-1">
                        {[1, 1, 0, 0, 0].map((s, i) => (
                            <div key={i} className={`w-4 h-1 rounded-full ${s === 1 ? 'bg-white' : 'bg-neutral-900'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl border border-white/5 bg-neutral-900/10 p-8"
                    >
                        <div className="mb-8">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-4 inline-block">
                                {drill.drill_type.replace('_', ' ')}
                            </span>
                            <h2 className="text-lg font-bold leading-relaxed text-neutral-200">
                                "{drill.question}"
                            </h2>
                        </div>

                        <div className="space-y-2 mb-8">
                            {drill.options.map((option, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedOption(option)}
                                    className={`
                                        w-full px-5 py-4 rounded-xl border text-left transition-all flex items-center justify-between group
                                        ${selectedOption === option
                                            ? 'bg-white border-white text-black'
                                            : 'bg-neutral-900/50 border-white/5 text-neutral-500 hover:border-white/10 hover:text-neutral-300'
                                        }
                                    `}
                                >
                                    <span className="text-sm font-semibold">{option}</span>
                                    <div className={`
                                        w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black
                                        ${selectedOption === option ? 'bg-black text-white border-black' : 'border-neutral-800 text-neutral-700'}
                                    `}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={!selectedOption}
                            onClick={handleSubmit}
                            className={`
                                w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                                ${selectedOption
                                    ? 'bg-white text-black shadow-lg shadow-white/5 hover:bg-neutral-200'
                                    : 'bg-neutral-900 text-neutral-700 cursor-not-allowed border border-white/5'
                                }
                            `}
                        >
                            Finalize Selection
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-2xl border p-8 relative overflow-hidden ${result?.is_correct ? 'border-white/20 bg-neutral-900/20' : 'border-white/10 bg-neutral-900/10'}`}
                    >
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result?.is_correct ? 'bg-white text-black' : 'bg-neutral-900 text-white border border-white/10'}`}>
                                {result?.is_correct ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tighter text-white">
                                    {result?.is_correct ? 'Outstanding Intuition' : 'Refinement Required'}
                                </h3>
                                <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                                    {result?.is_correct ? 'System analysis verified.' : 'Architectural oversight detected.'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/40 p-5 rounded-xl border border-white/5 mb-8 relative z-10">
                            <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest mb-3">
                                <Info className="w-3.5 h-3.5 text-neutral-500" />
                                Expert Breakdown
                            </div>
                            <p className="text-[13px] text-neutral-400 font-medium leading-relaxed">
                                {result?.explanation}
                            </p>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            <button
                                onClick={fetchDrill}
                                className="flex-1 py-3 rounded-lg bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                            >
                                Next Drill
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
