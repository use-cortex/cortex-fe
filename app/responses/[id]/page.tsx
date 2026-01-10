"use client";

import MermaidRenderer from '@/components/MermaidRenderer';
import api from '@/lib/api';
import { parseApiError } from '@/lib/error-utils';
import { Task, TaskResponse } from '@/lib/types';
import {
    Activity,
    ArrowLeft,
    BrainCircuit,
    Clock,
    Download,
    Layers,
    Lightbulb,
    Loader2,
    Lock,
    Maximize2,
    Shield,
    ShieldAlert,
    Target,
    TrendingUp,
    X,
    Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ResponseDetail() {
    const params = useParams();
    const responseId = params.id as string;

    const [response, setResponse] = useState<TaskResponse | null>(null);
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestingFeedback, setRequestingFeedback] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get(`/responses/${responseId}`);
            setResponse(res.data);

            const taskRes = await api.get(`/tasks/${res.data.task_id}`);
            setTask(taskRes.data);

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
            toast.success('System analysis complete.');
            await fetchData();
        } catch (err: any) {
            console.error('Failed to request feedback:', err);
            toast.error(parseApiError(err, 'Retry after cooldown'));
        } finally {
            setRequestingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Retrieving Archive Node</span>
            </div>
        );
    }

    if (!response || !task) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-neutral-500">
                <p className="font-bold text-sm tracking-widest uppercase">Analysis node not found.</p>
                <Link href="/history" className="mt-6 premium-button text-[10px]">Return to History</Link>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const scores = [
        { label: 'Structural Clarity', value: response.score_breakdown.clarity, icon: Activity },
        { label: 'Constraint Depth', value: response.score_breakdown.constraints_awareness, icon: Target },
        { label: 'Trade-off Logic', value: response.score_breakdown.trade_off_reasoning, icon: ShieldAlert },
        { label: 'Failure Resilience', value: response.score_breakdown.failure_anticipation, icon: BrainCircuit },
        { label: 'Architectural Elegance', value: response.score_breakdown.simplicity, icon: Zap },
    ];

    return (
        <ProtectedRoute>
            <div className="max-w-[1400px] mx-auto pb-24">
                {/* Header / Banner */}
                <div className="relative p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] overflow-hidden group mb-12">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                        <TrendingUp className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-1">Session Archive</span>
                                    <span className="text-[10px] text-white font-bold tracking-widest uppercase">ID: 0x{responseId.slice(-8)}</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-4">
                                {task.title}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Training Verified</span>
                                </div>
                                <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                                    Submitted {new Date(response.submitted_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4">Architectural Index</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-7xl font-black text-white tracking-tighter shadow-sm">{response.score.toFixed(1)}</span>
                                <span className="text-xl font-black text-neutral-800">/ 10.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Side: Score Breakdown & Feedback */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Score Matrix */}
                        <section className="glass-card rounded-[2.5rem] p-10">
                            <h2 className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-10 border-b border-white/5 pb-6">Evaluation Matrix</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
                                {scores.map((s) => (
                                    <div key={s.label} className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 shadow-xl">
                                            <s.icon className="w-6 h-6 text-neutral-400" />
                                        </div>
                                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest text-center mb-2 leading-tight">{s.label}</span>
                                        <span className="text-3xl font-black text-white tracking-tighter">{s.value.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* AI Feedback Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-6">
                                <div className="flex items-center gap-4">
                                    <BrainCircuit className="w-5 h-5 text-white" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Engineering Critique</h2>
                                </div>

                                {!response.ai_feedback && (
                                    <div className="flex items-center gap-4">
                                        {timeLeft > 0 ? (
                                            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-4 py-2 bg-white/5 rounded-full border border-white/5">
                                                Processing: {formatTime(timeLeft)}s
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleRequestFeedback}
                                                disabled={requestingFeedback}
                                                className="premium-button text-[10px] flex items-center gap-2 px-8 py-3"
                                            >
                                                {requestingFeedback ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Zap className="w-4 h-4 text-black fill-black" />}
                                                Run Analysis
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="glass-card rounded-[2.5rem] p-12 relative overflow-hidden border-white/[0.08]">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                                    <BrainCircuit className="w-64 h-64" />
                                </div>
                                <div className="relative z-10 prose prose-invert prose-lg max-w-none">
                                    {response.ai_feedback ? (
                                        <div className="text-neutral-300 space-y-4">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-6 mb-4" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-lg font-black text-white uppercase tracking-widest mt-6 mb-3 border-b border-white/10 pb-2 flex items-center gap-2" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-white mt-4 mb-2 uppercase tracking-wider" {...props} />,
                                                    p: ({ node, ...props }) => <p className="leading-relaxed text-[15px] font-medium" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 my-4 marker:text-emerald-500" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2 my-4 marker:text-emerald-500" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-emerald-500 pl-4 py-1 my-4 bg-emerald-500/5 italic text-emerald-400 rounded-r-lg" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                                                    code: ({ node, ...props }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-400" {...props} />,
                                                    pre: ({ node, ...props }) => <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto border border-white/10 my-4" {...props} />,
                                                }}
                                            >
                                                {response.ai_feedback}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-20">
                                            <Loader2 className="w-12 h-12 animate-spin text-white opacity-20 mb-8" />
                                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">Awaiting Intelligence Feed</h3>
                                            <p className="text-[11px] text-neutral-700 uppercase tracking-[0.2em] mt-4">High-fidelity reports require additional compute time</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Submissions Archives */}
                        <section className="space-y-6 pt-10">
                            <div className="flex items-center gap-4 px-6 opacity-40">
                                <Activity className="w-4 h-4 text-white" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Full Submission Archive</h2>
                            </div>
                            <div className="grid gap-6">
                                {[
                                    { label: 'Strategic Assumptions', value: response.assumptions, icon: Lightbulb },
                                    { label: 'System Topology', value: response.architecture, icon: Layers },
                                    { label: 'Critical Trade-offs', value: response.trade_offs, icon: ShieldAlert },
                                    { label: 'Resilience Planning', value: response.failure_scenarios, icon: Clock },
                                ].map((section) => (
                                    <div key={section.label} className="glass-card rounded-[2rem] p-10">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                                <section.icon className="w-4 h-4 text-neutral-500" />
                                            </div>
                                            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">{section.label}</h3>
                                        </div>
                                        {section.label === 'System Topology' && response.architecture_image ? (
                                            <div
                                                className="relative group/image bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 shadow-2xl cursor-zoom-in"
                                                onClick={() => setIsImageModalOpen(true)}
                                            >
                                                {/* Grid Pattern Background to match Excalidraw Dark Mode */}
                                                <div className="absolute inset-0 opacity-[0.05]"
                                                    style={{
                                                        backgroundImage: 'linear-gradient(#404040 1px, transparent 1px), linear-gradient(90deg, #404040 1px, transparent 1px)',
                                                        backgroundSize: '20px 20px'
                                                    }}
                                                />

                                                <div className="relative p-8 flex justify-center">
                                                    <img
                                                        src={response.architecture_image}
                                                        alt="System Architecture"
                                                        className="relative z-10 max-h-[600px] w-auto h-auto object-contain rounded-sm shadow-lg transition-transform duration-500 group-hover/image:scale-[1.02]"
                                                    />
                                                </div>

                                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/image:opacity-100 transition-all z-20">
                                                    <button
                                                        className="p-3 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-xl backdrop-blur-md border border-white/10 shadow-xl"
                                                    >
                                                        <Maximize2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : section.label === 'System Topology' && section.value.includes('graph') ? (
                                            <div className="bg-black/20 rounded-3xl p-8 border border-white/5 backdrop-blur-xl">
                                                <MermaidRenderer code={section.value} />
                                            </div>
                                        ) : (
                                            <p className="text-[16px] text-neutral-400 leading-relaxed font-medium whitespace-pre-wrap pl-4 border-l-2 border-white/5">{section.value || "No telemetry data recorded."}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Context & Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-10 space-y-8">
                            <section className="glass-card rounded-[2.5rem] p-10">
                                <h3 className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-8">Incident Brief</h3>
                                <div className="space-y-10">
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">Target Role</p>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">{task.role}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">Complexity Level</p>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 w-fit">
                                            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{task.difficulty}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">Briefing Detail</p>
                                        <p className="text-[13px] text-neutral-500 leading-relaxed font-medium">{task.scenario}</p>
                                    </div>
                                </div>
                            </section>

                            <section className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                                    <Shield className="w-32 h-32 text-emerald-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 text-emerald-500 mb-6">
                                        <Lock className="w-5 h-5" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Secure Session</span>
                                    </div>
                                    <p className="text-[13px] text-neutral-500 leading-relaxed font-medium mb-10">
                                        This analysis is permanently logged in your training profile. Refine your Reasoning Matrix to achieve the <strong>Principal Architect</strong> rank.
                                    </p>
                                    <Link href="/dashboard" className="premium-button w-full flex items-center justify-center py-4">
                                        <span>Continue Training</span>
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isImageModalOpen && response?.architecture_image && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsImageModalOpen(false)}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6 md:p-12"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative max-w-full max-h-full w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden"
                            >
                                {/* Grid Pattern Background */}
                                <div className="absolute inset-0 opacity-[0.05]"
                                    style={{
                                        backgroundImage: 'linear-gradient(#404040 1px, transparent 1px), linear-gradient(90deg, #404040 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />

                                <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
                                    <a
                                        href={response.architecture_image}
                                        download={`architecture-${responseId.slice(-8)}.png`}
                                        className="p-3 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-xl backdrop-blur-md border border-white/10 shadow-xl transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                    <button
                                        onClick={() => setIsImageModalOpen(false)}
                                        className="p-3 bg-neutral-900/80 hover:bg-red-500/10 hover:text-red-500 text-white rounded-xl backdrop-blur-md border border-white/10 shadow-xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <img
                                    src={response.architecture_image}
                                    alt="System Architecture Fullscreen"
                                    className="relative z-10 w-full h-full object-contain p-8 md:p-16"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ProtectedRoute>
    );
}
