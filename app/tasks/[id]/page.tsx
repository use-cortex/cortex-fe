"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Send,
    Clock,
    ShieldAlert,
    Lightbulb,
    Layers,
    Timer,
    BrainCircuit,
    Loader2,
    Maximize2,
    Minimize2,
    Sparkles,
    Lock,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Task } from '@/lib/types';
import ArchitectureEditor from '@/components/ArchitectureEditor';
import { toast } from 'sonner';

const steps = [
    { id: 'assumptions', label: 'Assumptions', icon: Lightbulb },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'trade-offs', label: 'Trade-offs', icon: ShieldAlert },
    { id: 'failure-modes', label: 'Failure Modes', icon: Timer },
];

export default function TaskWorkspace() {
    const params = useParams();
    const router = useRouter();
    const taskId = params.id as string;

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('assumptions');
    const [isMaximized, setIsMaximized] = useState(false);

    const [answers, setAnswers] = useState({
        assumptions: '',
        architecture: '',
        architecture_data: '',
        architecture_image: '',
        'trade-offs': '',
        'failure-modes': '',
    });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await api.get(`/tasks/${taskId}`);
                setTask(response.data);
            } catch (err) {
                console.error('Failed to fetch task:', err);
                toast.error('Failed to load task details');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    const handleInputChange = (val: string) => {
        setAnswers({ ...answers, [activeTab]: val });
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await api.post('/responses', {
                task_id: taskId,
                assumptions: answers.assumptions,
                architecture: answers.architecture || 'Visual Architecture Submitted',
                architecture_data: answers.architecture_data,
                architecture_image: answers.architecture_image,
                trade_offs: answers['trade-offs'],
                failure_scenarios: answers['failure-modes']
            });
            toast.success('Analysis submitted successfully!');
            router.push('/dashboard');
        } catch (err) {
            console.error('Submission failed:', err);
            toast.error('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Initializing Secure Environment</span>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-neutral-500">
                <p>Task not found.</p>
                <Link href="/dashboard" className="mt-4 text-white font-bold text-sm underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col max-w-[1700px] mx-auto w-full">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-3 text-neutral-500 hover:text-white transition-all group">
                        <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-white/5 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-[10px] uppercase tracking-[0.3em] leading-none mb-1">Exit Node</span>
                            <span className="text-[9px] text-neutral-600 font-bold uppercase">Return to Core</span>
                        </div>
                    </Link>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Terminal_v2.0_Active</span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest">SID: 0x{taskId.slice(-8)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pr-6 border-r border-white/10 hidden md:flex">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{task.estimated_time_minutes}m Duration</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="premium-button flex items-center gap-3 disabled:opacity-50 !bg-white !text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        <span className="font-black uppercase tracking-widest text-[11px]">Deploy To Review</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0 relative">
                {/* Left Side: Scenario - Hidden when maximized */}
                <AnimatePresence>
                    {!isMaximized && (
                        <motion.div
                            initial={{ opacity: 0, x: -30, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 480 }}
                            exit={{ opacity: 0, x: -30, width: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-4 shrink-0 min-h-0"
                        >
                            <div className="glass-card rounded-[2.5rem] flex-1 p-12 overflow-y-auto custom-scrollbar relative overflow-hidden group border-white/[0.08]">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                                    <Shield className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                    <div className="mb-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">Incident Briefing</span>
                                            <div className="w-1 h-1 rounded-full bg-neutral-800" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500/80">Critical Priority</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.05] mb-8 tracking-tighter">
                                            {task.title}
                                        </h1>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                                <Layers className="w-3.5 h-3.5 text-neutral-500" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{task.role}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{task.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <section>
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-white/20" />
                                                Intelligence Context
                                            </h3>
                                            <p className="text-[15px] text-neutral-400 leading-[1.7] font-medium selection:bg-white/10">
                                                {task.scenario}
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-white/20" />
                                                Operational Constraints
                                            </h3>
                                            <div className="grid gap-4">
                                                {task.description.split('\n').filter(l => l.trim()).map((line, i) => (
                                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] group/item hover:bg-white/[0.05] transition-all duration-300">
                                                        <span className="text-neutral-700 font-black text-[10px] mt-0.5 font-mono">#{i + 1}</span>
                                                        <p className="text-[13px] text-neutral-300 leading-relaxed font-medium group-hover/item:text-white transition-colors">
                                                            {line}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Side: Workspace */}
                <div className="flex-1 flex flex-col min-h-0 relative">
                    <div className="glass-card rounded-[2.5rem] flex-1 flex flex-col overflow-hidden relative border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                        {/* Tabs & Controls */}
                        <div className="flex items-center justify-between px-10 py-2 border-b border-white/[0.05] shrink-0 bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                                {steps.map((step) => {
                                    const isActive = activeTab === step.id;
                                    return (
                                        <button
                                            key={step.id}
                                            onClick={() => setActiveTab(step.id)}
                                            className={`
                                                relative px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all
                                                ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}
                                            `}
                                        >
                                            <step.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-30'}`} />
                                            {step.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-tab-glow"
                                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
                                title={isMaximized ? "Restore Layout (ESC)" : "Immersive Focus Mode (CMD+F)"}
                            >
                                {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                            </button>
                        </div>

                        {/* Editor Canvas */}
                        <div className={`flex-1 min-h-0 transition-all duration-700 ease-[0.16, 1, 0.3, 1] ${activeTab === 'architecture' ? '' : 'p-16'}`}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="h-full flex flex-col"
                                >
                                    {activeTab === 'architecture' ? (
                                        <div className="flex-1 h-full min-h-0">
                                            <ArchitectureEditor
                                                data={answers.architecture_data}
                                                onChange={(data, image) => setAnswers({
                                                    ...answers,
                                                    architecture_data: data,
                                                    architecture_image: image
                                                })}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-8 h-[1px] bg-white/20" />
                                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">
                                                    Architectural Reasoning Console
                                                </span>
                                            </div>
                                            <textarea
                                                autoFocus
                                                value={(answers as any)[activeTab]}
                                                onChange={(e) => handleInputChange(e.target.value)}
                                                placeholder={`[awaiting_input] Describe your ${activeTab.replace('-', ' ')} with extreme technical rigor. Focus on scalability, security, and operational simplicity...`}
                                                className="flex-1 bg-transparent border-none text-neutral-200 text-xl md:text-2xl leading-[1.6] placeholder:text-neutral-800 focus:outline-none resize-none custom-scrollbar selection:bg-white/10 font-bold tracking-tight"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Status Bar */}
                        <div className="px-10 py-6 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <BrainCircuit className="w-4 h-4 opacity-30" />
                                    <span>AI Engine: Cortex-Ultra</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 opacity-30 text-emerald-500" />
                                    <span className="text-emerald-500/80">End-to-End Encrypted</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="opacity-40">System State: Nominal</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
