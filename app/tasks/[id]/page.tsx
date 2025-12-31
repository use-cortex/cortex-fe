"use client";

import React, { useState, useEffect, use } from 'react';
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
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Task } from '@/lib/types';
import DiagramEditor from '@/components/DiagramEditor';

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
    const [answers, setAnswers] = useState({
        assumptions: '',
        architecture: '',
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
            const response = await api.post('/responses', {
                task_id: taskId,
                assumptions: answers.assumptions,
                architecture: answers.architecture,
                trade_offs: answers['trade-offs'],
                failure_scenarios: answers['failure-modes']
            });
            // Redirect to dashboard or response view
            router.push('/dashboard');
        } catch (err) {
            console.error('Submission failed:', err);
            alert('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
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
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-xs uppercase tracking-widest">Dashboard</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-white text-black py-2 px-6 rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        SUBMIT ANALYSIS
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left Side: Scenario */}
                <div className="flex flex-col gap-4 w-[380px] min-h-0">
                    <div className="rounded-2xl border border-white/5 bg-neutral-900/10 flex-1 p-6 overflow-y-auto custom-scrollbar">
                        <div className="mb-6 pb-6 border-b border-white/5">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3 block">System Scenario</span>
                            <h1 className="text-2xl font-black text-white leading-tight mb-4">{task.title}</h1>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {task.estimated_time_minutes}m</span>
                                <span className="w-1 h-1 rounded-full bg-neutral-800" />
                                <span>{task.role}</span>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-sm text-neutral-400 leading-relaxed space-y-4">
                            <p>{task.scenario}</p>
                            <h3 className="text-white font-bold text-[13px] uppercase tracking-wider pt-2">Requirements</h3>
                            <ul className="list-disc pl-4 space-y-1 text-[13px]">
                                {task.description.split('\n').map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Side: Workspace */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="rounded-2xl border border-white/5 bg-neutral-900/20 flex-1 flex flex-col overflow-hidden">
                        {/* Tabs */}
                        <div className="flex items-center px-4 pt-3 border-b border-white/5 gap-1 shrink-0">
                            {steps.map((step) => {
                                const isActive = activeTab === step.id;
                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => setActiveTab(step.id)}
                                        className={`
                                            px-4 py-2 rounded-t-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative
                                            ${isActive ? 'bg-white/5 text-white' : 'text-neutral-500 hover:text-neutral-300'}
                                        `}
                                    >
                                        <step.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                                        {step.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-tab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>



                        {/* Editor */}
                        <div className="flex-1 p-6 min-h-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="h-full flex flex-col"
                                >
                                    {activeTab === 'architecture' ? (
                                        <DiagramEditor
                                            value={answers.architecture}
                                            onChange={(val) => setAnswers({ ...answers, architecture: val })}
                                        />
                                    ) : (
                                        <>
                                            <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4 block">
                                                Drafting <span className="text-neutral-400">{activeTab.replace('-', ' ')}</span>
                                            </label>
                                            <textarea
                                                autoFocus
                                                value={(answers as any)[activeTab]}
                                                onChange={(e) => handleInputChange(e.target.value)}
                                                placeholder="Structure your architectural reasoning here..."
                                                className="flex-1 bg-transparent border-none text-neutral-200 text-sm leading-relaxed placeholder:text-neutral-800 focus:outline-none resize-none custom-scrollbar"
                                            />
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Status Bar */}
                        <div className="px-4 py-2 bg-white/2 border-t border-white/5 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-neutral-600">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-3 h-3" />
                                Interactive AI Context Sync
                            </div>
                            <div>
                                Char Count: {(answers as any)[activeTab].length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
