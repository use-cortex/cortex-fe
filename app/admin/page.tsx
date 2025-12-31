"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Plus,
    RefreshCw,
    Users,
    FileText,
    BrainCircuit,
    BarChart3,
    ArrowUpRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Zap
} from 'lucide-react';
import api from '@/lib/api';

interface AdminStats {
    total_users: number;
    total_tasks: number;
    total_drills: number;
    total_responses: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleGenerateDaily = async () => {
        try {
            setGenerating('daily');
            const res = await api.post('/admin/tasks/generate-daily');
            setMessage({ text: res.data.message, type: 'success' });
            fetchStats();
        } catch (err) {
            setMessage({ text: 'Failed to generate daily tasks', type: 'error' });
        } finally {
            setGenerating(null);
        }
    };

    const handleGenerateTask = async (role: string, difficulty: string) => {
        try {
            setGenerating(`task-${role}-${difficulty}`);
            await api.post('/admin/tasks/generate', null, { params: { role, difficulty } });
            setMessage({ text: `Generated ${difficulty} ${role} task`, type: 'success' });
            fetchStats();
        } catch (err) {
            setMessage({ text: 'Failed to generate task', type: 'error' });
        } finally {
            setGenerating(null);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 font-sans pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                            Command Center
                        </span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">•</span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">System Administrator</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Cortex <span className="text-neutral-700">OS</span></h1>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-3 rounded-xl border border-white/5 bg-neutral-900/20 text-neutral-500 hover:text-white transition-all"
                >
                    <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Users', value: stats?.total_users, icon: Users, color: 'text-blue-500' },
                    { label: 'Active Tasks', value: stats?.total_tasks, icon: FileText, color: 'text-purple-500' },
                    { label: 'Thinking Drills', value: stats?.total_drills, icon: BrainCircuit, color: 'text-green-500' },
                    { label: 'Analyses Run', value: stats?.total_responses, icon: BarChart3, color: 'text-amber-500' },
                ].map((s) => (
                    <div key={s.label} className="p-6 rounded-2xl border border-white/5 bg-neutral-900/10 group hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <s.icon className={`w-5 h-5 ${s.color}`} />
                            <ArrowUpRight className="w-4 h-4 text-neutral-800" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">{s.label}</span>
                        <span className="text-3xl font-black text-white leading-none">{s.value ?? 0}</span>
                    </div>
                ))}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Generation Engine */}
                <section className="p-8 rounded-3xl border border-white/5 bg-neutral-900/10 space-y-8">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white mb-2">Generation Engine</h2>
                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">Orchestrate the AI to expand the platform's knowledge base.</p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/5 border-green-500/10 text-green-500' : 'bg-red-500/5 border-red-500/10 text-red-500'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={handleGenerateDaily}
                            disabled={!!generating}
                            className="w-full p-6 rounded-2xl border border-white/5 bg-white text-black flex items-center justify-between group hover:bg-neutral-200 transition-all disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-black rounded-xl">
                                    <Zap className="w-5 h-5 text-white fill-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest leading-none mb-1.5">Daily Burst</h3>
                                    <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Generate tasks for all roles</p>
                                </div>
                            </div>
                            {generating === 'daily' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { role: 'Backend Engineer', diff: 'advanced' },
                                { role: 'Systems Engineer', diff: 'advanced' },
                                { role: 'Frontend Engineer', diff: 'intermediate' },
                                { role: 'Data Engineer', diff: 'advanced' },
                            ].map((cfg) => {
                                const id = `task-${cfg.role}-${cfg.diff}`;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => handleGenerateTask(cfg.role, cfg.diff)}
                                        disabled={!!generating}
                                        className="p-5 rounded-2xl border border-white/5 bg-neutral-900/30 flex flex-col gap-4 hover:border-white/10 hover:bg-white/[0.02] transition-all text-left disabled:opacity-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="px-2 py-0.5 rounded-md bg-neutral-800 text-[8px] font-black uppercase tracking-widest text-neutral-500">{cfg.diff}</div>
                                            {generating === id && <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600" />}
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{cfg.role}</h4>
                                            <p className="text-[9px] text-neutral-600 font-bold uppercase">Manual Trigger</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* System Monitoring */}
                <section className="p-8 rounded-3xl border border-white/5 bg-neutral-900/10 space-y-8">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white mb-2">Platform Health</h2>
                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">Real-time status of service connections and AI model availability.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Gemini 2.5 Flash Lite', status: 'Operational', latency: '1.2s' },
                            { name: 'MongoDB Cluster', status: 'Healthy', latency: '45ms' },
                            { name: 'Expert Protocol Engine', status: 'Operational', latency: 'N/A' },
                            { name: 'Real-time Sync Node', status: 'Operational', latency: '8ms' },
                        ].map((node) => (
                            <div key={node.name} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{node.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
                                    <span className="text-neutral-600">{node.latency}</span>
                                    <span className="text-green-500/60">{node.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-black/60 border border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Recent System Logs</h3>
                        <div className="font-mono text-[9px] text-neutral-700 space-y-2">
                            <p>[2025-12-31 16:50] INFO: Daily task generation completed (4 roles)</p>
                            <p>[2025-12-31 16:48] WARN: Multiple attempts to unlock analysis #429 (rejected)</p>
                            <p>[2025-12-31 16:45] INFO: Gemini-2.5 context window synced successfully</p>
                            <p>[2025-12-31 16:30] STAT: Average UX Latency 142ms | Error Rate 0.02%</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
