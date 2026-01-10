"use client";

import { useUser } from '@/hooks/use-user';
import api from '@/lib/api';
import { Difficulty, DrillType, Role, Task } from '@/lib/types';
import {
    AlertCircle,
    ArrowUpRight,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    Edit2,
    FileText,
    Loader2,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Users,
    X,
    Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AdminStats {
    total_users: number;
    total_tasks: number;
    total_drills: number;
    total_responses: number;
}

interface Drill {
    id: string;
    title: string;
    drill_type: DrillType;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    created_at: string;
}

type TabType = 'overview' | 'tasks' | 'drills';

export default function AdminDashboard() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [drills, setDrills] = useState<Drill[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [deleteModal, setDeleteModal] = useState<{ type: 'task' | 'drill', id: string, title: string } | null>(null);
    const [editTaskModal, setEditTaskModal] = useState<Task | null>(null);
    const [editDrillModal, setEditDrillModal] = useState<Drill | null>(null);
    const [saving, setSaving] = useState(false);

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

    const fetchTasks = async () => {
        try {
            const res = await api.get('/admin/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    };

    const fetchDrills = async () => {
        try {
            const res = await api.get('/admin/drills');
            setDrills(res.data);
        } catch (err) {
            console.error('Failed to fetch drills:', err);
        }
    };

    useEffect(() => {
        if (!userLoading) {
            if (!user || !user.is_admin) {
                router.push('/');
                return;
            }
            fetchStats();
        }
    }, [user, userLoading, router]);

    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchTasks();
        } else if (activeTab === 'drills') {
            fetchDrills();
        }
    }, [activeTab]);

    const handleGenerateDaily = async () => {
        try {
            setGenerating('daily');
            const res = await api.post('/admin/tasks/generate-daily');
            setMessage({ text: res.data.message, type: 'success' });
            fetchStats();
            if (activeTab === 'tasks') fetchTasks();
        } catch (err) {
            setMessage({ text: 'Failed to generate daily tasks', type: 'error' });
        } finally {
            setGenerating(null);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal) return;

        try {
            if (deleteModal.type === 'task') {
                await api.delete(`/admin/tasks/${deleteModal.id}`);
                setMessage({ text: 'Task deleted successfully', type: 'success' });
                fetchTasks();
            } else {
                await api.delete(`/admin/drills/${deleteModal.id}`);
                setMessage({ text: 'Drill deleted successfully', type: 'success' });
                fetchDrills();
            }
            fetchStats();
            setDeleteModal(null);
        } catch (err) {
            setMessage({ text: `Failed to delete ${deleteModal.type}`, type: 'error' });
        }
    };

    const handleUpdateTask = async () => {
        if (!editTaskModal) return;

        try {
            setSaving(true);
            await api.put(`/admin/tasks/${editTaskModal.id}`, {
                title: editTaskModal.title,
                description: editTaskModal.description,
                role: editTaskModal.role,
                difficulty: editTaskModal.difficulty,
                estimated_time_minutes: editTaskModal.estimated_time_minutes,
                scenario: editTaskModal.scenario,
                prompts: editTaskModal.prompts
            });
            setMessage({ text: 'Task updated successfully', type: 'success' });
            fetchTasks();
            setEditTaskModal(null);
        } catch (err) {
            setMessage({ text: 'Failed to update task', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateDrill = async () => {
        if (!editDrillModal) return;

        try {
            setSaving(true);
            await api.put(`/admin/drills/${editDrillModal.id}`, {
                title: editDrillModal.title,
                drill_type: editDrillModal.drill_type,
                question: editDrillModal.question,
                options: editDrillModal.options,
                correct_answer: editDrillModal.correct_answer,
                explanation: editDrillModal.explanation
            });
            setMessage({ text: 'Drill updated successfully', type: 'success' });
            fetchDrills();
            setEditDrillModal(null);
        } catch (err) {
            setMessage({ text: 'Failed to update drill', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading || userLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
        );
    }

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDrills = drills.filter(drill =>
        drill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drill.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto py-12 px-4 font-sans pb-24">
                {/* Delete Confirmation Modal */}
                {deleteModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Confirm Deletion</h3>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-sm text-neutral-400 mb-6">
                                Are you sure you want to delete <span className="text-white font-bold">"{deleteModal.title}"</span>?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal(null)}
                                    className="flex-1 py-3 rounded-xl bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Task Modal */}
                {editTaskModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full my-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Edit Task</h3>
                                <button onClick={() => setEditTaskModal(null)} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={editTaskModal.title}
                                        onChange={(e) => setEditTaskModal({ ...editTaskModal, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Description</label>
                                    <textarea
                                        value={editTaskModal.description}
                                        onChange={(e) => setEditTaskModal({ ...editTaskModal, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Role</label>
                                        <select
                                            value={editTaskModal.role}
                                            onChange={(e) => setEditTaskModal({ ...editTaskModal, role: e.target.value as Role })}
                                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                        >
                                            <option value="Backend Engineer">Backend Engineer</option>
                                            <option value="Frontend Engineer">Frontend Engineer</option>
                                            <option value="Fullstack Engineer">Fullstack Engineer</option>
                                            <option value="Systems Engineer">Systems Engineer</option>
                                            <option value="Data Engineer">Data Engineer</option>
                                            <option value="DevOps Engineer">DevOps Engineer</option>
                                            <option value="Security Engineer">Security Engineer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Difficulty</label>
                                        <select
                                            value={editTaskModal.difficulty}
                                            onChange={(e) => setEditTaskModal({ ...editTaskModal, difficulty: e.target.value as Difficulty })}
                                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Estimated Time (minutes)</label>
                                    <input
                                        type="number"
                                        value={editTaskModal.estimated_time_minutes}
                                        onChange={(e) => setEditTaskModal({ ...editTaskModal, estimated_time_minutes: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditTaskModal(null)}
                                    className="flex-1 py-3 rounded-xl bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateTask}
                                    disabled={saving}
                                    className="flex-1 py-3 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Drill Modal */}
                {editDrillModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full my-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Edit Drill</h3>
                                <button onClick={() => setEditDrillModal(null)} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={editDrillModal.title}
                                        onChange={(e) => setEditDrillModal({ ...editDrillModal, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Question</label>
                                    <textarea
                                        value={editDrillModal.question}
                                        onChange={(e) => setEditDrillModal({ ...editDrillModal, question: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Drill Type</label>
                                    <select
                                        value={editDrillModal.drill_type}
                                        onChange={(e) => setEditDrillModal({ ...editDrillModal, drill_type: e.target.value as DrillType })}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    >
                                        <option value="spot_assumptions">Spot Assumptions</option>
                                        <option value="rank_failures">Rank Failures</option>
                                        <option value="predict_scaling">Predict Scaling</option>
                                        <option value="choose_tradeoffs">Choose Tradeoffs</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Options (one per line)</label>
                                    <textarea
                                        value={editDrillModal.options.join('\n')}
                                        onChange={(e) => setEditDrillModal({ ...editDrillModal, options: e.target.value.split('\n').filter(o => o.trim()) })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Correct Answer</label>
                                    <input
                                        type="text"
                                        value={editDrillModal.correct_answer}
                                        onChange={(e) => setEditDrillModal({ ...editDrillModal, correct_answer: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Explanation</label>
                                    <textarea
                                        value={editDrillModal.explanation}
                                        onChange={(e) => setEditDrillModal({ ...editDrillModal, explanation: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditDrillModal(null)}
                                    className="flex-1 py-3 rounded-xl bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateDrill}
                                    disabled={saving}
                                    className="flex-1 py-3 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-white/5">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'tasks', label: 'Tasks', icon: FileText },
                        { id: 'drills', label: 'Drills', icon: BrainCircuit },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'text-white border-b-2 border-white'
                                : 'text-neutral-600 hover:text-neutral-400'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 border mb-8 ${message.type === 'success' ? 'bg-green-500/5 border-green-500/10 text-green-500' : 'bg-red-500/5 border-red-500/10 text-red-500'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
                    </div>
                )}

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
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

                        {/* Generation Engine */}
                        <section className="p-8 rounded-3xl border border-white/5 bg-neutral-900/10 space-y-8">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-white mb-2">Generation Engine</h2>
                                <p className="text-xs text-neutral-500 leading-relaxed font-medium">Orchestrate the AI to expand the platform's knowledge base.</p>
                            </div>

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
                            </div>
                        </section>
                    </>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-900/50 border border-white/5 text-white text-sm focus:outline-none focus:border-white/20"
                            />
                        </div>

                        {/* Tasks List */}
                        <div className="space-y-3">
                            {filteredTasks.length === 0 ? (
                                <div className="p-12 text-center text-neutral-600 text-sm">
                                    No tasks found
                                </div>
                            ) : (
                                filteredTasks.map((task) => (
                                    <div key={task.id} className="p-6 rounded-2xl border border-white/5 bg-neutral-900/10 hover:border-white/10 transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest">
                                                        {task.difficulty}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                                                        {task.role}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-white mb-2">{task.title}</h3>
                                                <p className="text-xs text-neutral-500 line-clamp-2">{task.description}</p>
                                                <p className="text-[10px] text-neutral-700 mt-2 font-medium">
                                                    Created: {new Date(task.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditTaskModal(task)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ type: 'task', id: task.id, title: task.title })}
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Drills Tab */}
                {activeTab === 'drills' && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                            <input
                                type="text"
                                placeholder="Search drills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-900/50 border border-white/5 text-white text-sm focus:outline-none focus:border-white/20"
                            />
                        </div>

                        {/* Drills List */}
                        <div className="space-y-3">
                            {filteredDrills.length === 0 ? (
                                <div className="p-12 text-center text-neutral-600 text-sm">
                                    No drills found
                                </div>
                            ) : (
                                filteredDrills.map((drill) => (
                                    <div key={drill.id} className="p-6 rounded-2xl border border-white/5 bg-neutral-900/10 hover:border-white/10 transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-widest">
                                                        {drill.drill_type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-white mb-2">{drill.title}</h3>
                                                <p className="text-xs text-neutral-500 line-clamp-2">{drill.question}</p>
                                                <p className="text-[10px] text-neutral-700 mt-2 font-medium">
                                                    {drill.options.length} options • Created: {new Date(drill.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditDrillModal(drill)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ type: 'drill', id: drill.id, title: drill.title })}
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
