"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    BrainCircuit,
    Clock,
    Target,
    ShieldAlert,
    Layers,
    Lightbulb,
    Loader2,
    Activity,
    CheckCircle2,
    ChevronDown,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { TaskResponse, Task } from '@/lib/types';
import MermaidRenderer from '@/components/MermaidRenderer';

export default function ResponseDetail() {
    const params = useParams();
    const responseId = params.id as string;

    const [response, setResponse] = useState<TaskResponse | null>(null);
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestingFeedback, setRequestingFeedback] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const fetchData = async () => {
        try {
            const res = await api.get(`/responses/${responseId}`);
            setResponse(res.data);

            // Now fetch the task details
            const taskRes = await api.get(`/tasks/${res.data.task_id}`);
            setTask(taskRes.data);

            // Calculate time left if feedback isn't unlocked
            if (!res.data.ai_feedback) {
                const submittedAt = new Date(res.data.submitted_at).getTime();
                const now = new Date().getTime();
                const diff = Math.max(0, 300 - Math.floor((now - submittedAt) / 1000));
                setTimeLeft(diff);
            }
        } catch (err) {
            console.error('Failed to fetch response details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [responseId]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleRequestFeedback = async () => {
        try {
            setRequestingFeedback(true);
            await api.post(`/responses/${responseId}/feedback`);
            // Refresh to get the new feedback
            await fetchData();
        } catch (err: any) {
            console.error('Failed to request feedback:', err);
            alert(err.response?.data?.detail || 'Wait for cooldown to expire');
        } finally {
            setRequestingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (!response || !task) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-neutral-500">
                <p>Analysis not found.</p>
                <Link href="/history" className="mt-4 text-white font-bold text-sm underline">Return to History</Link>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const scores = [
        { label: 'Clarity', value: response.score_breakdown.clarity, icon: Activity },
        { label: 'Constraints', value: response.score_breakdown.constraints_awareness, icon: Target },
        { label: 'Trade-offs', value: response.score_breakdown.trade_off_reasoning, icon: ShieldAlert },
        { label: 'Failure Resilience', value: response.score_breakdown.failure_anticipation, icon: BrainCircuit },
        { label: 'Simplicity', value: response.score_breakdown.simplicity, icon: Zap },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 font-sans pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <Link href="/history" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                                Evaluation Report
                            </span>
                            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest leading-none">•</span>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                {new Date(response.submitted_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{task.title}</h1>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-2">Overall AIX™</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{response.score.toFixed(1)}</span>
                        <span className="text-sm font-bold text-neutral-700">/ 10</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Score Breakdown & Feedback */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Score Matrix */}
                    <section className="p-8 rounded-3xl border border-white/5 bg-neutral-900/10">
                        <h2 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-8">Architectural Dimension Matrix</h2>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {scores.map((s) => (
                                <div key={s.label} className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center mb-4 group hover:border-white/20 transition-all">
                                        <s.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{s.label}</span>
                                    <span className="text-xl font-black text-white">{s.value.toFixed(1)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* AI Feedback */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="w-4 h-4 text-white" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">Engineering Critique</h2>
                            </div>

                            {!response.ai_feedback && (
                                <div className="flex items-center gap-3">
                                    {timeLeft > 0 ? (
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5" />
                                            Cooldown: {formatTime(timeLeft)}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleRequestFeedback}
                                            disabled={requestingFeedback}
                                            className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {requestingFeedback ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-black" />}
                                            Unlock Feedback
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                                <BrainCircuit className="w-48 h-48" />
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none relative z-10 leading-relaxed text-neutral-300">
                                {response.ai_feedback ? (
                                    <div className="whitespace-pre-wrap font-medium">
                                        {response.ai_feedback}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-12 text-neutral-600">
                                        <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">
                                            {timeLeft > 0 ? "Expert review cooling down..." : "Expert review ready to unlock"}
                                        </p>
                                        <p className="text-[10px] text-neutral-800 uppercase tracking-[0.2em] mt-2">
                                            High-fidelity analysis requires processing cycles
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Your Submission Review */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 px-4 pt-8">
                            <Activity className="w-4 h-4 text-neutral-500" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">Submission Archives</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Assumptions', value: response.assumptions, icon: Lightbulb },
                                { label: 'Architecture', value: response.architecture, icon: Layers },
                                { label: 'Trade-offs', value: response.trade_offs, icon: ShieldAlert },
                                { label: 'Failure Scenarios', value: response.failure_scenarios, icon: Clock },
                            ].map((section) => (
                                <div key={section.label} className="p-6 rounded-2xl border border-white/5 bg-neutral-900/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <section.icon className="w-4 h-4 text-neutral-600" />
                                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{section.label}</h3>
                                    </div>
                                    {section.label === 'Architecture' && section.value.includes('graph') ? (
                                        <MermaidRenderer code={section.value} />
                                    ) : (
                                        <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-wrap">{section.value || "No input provided for this section."}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Side: Task Context */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-8 space-y-6">
                        <section className="p-6 rounded-2xl border border-white/5 bg-neutral-900/20">
                            <h3 className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4">Challenge Profile</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Role</p>
                                    <p className="text-sm font-bold text-white">{task.role}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Difficulty</p>
                                    <p className="text-sm font-bold text-white capitalize">{task.difficulty}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Scenario Brief</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{task.scenario}</p>
                                </div>
                            </div>
                        </section>

                        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/10">
                            <div className="flex items-center gap-2 text-green-500 mb-4">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Training Verified</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed mb-6">
                                This analysis has been factored into your global Architectural Index. Continue training to refine your trade-off reasoning.
                            </p>
                            <Link href="/dashboard" className="w-full py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest text-center block hover:bg-neutral-200 transition-colors">
                                NEXT CHALLENGE
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
