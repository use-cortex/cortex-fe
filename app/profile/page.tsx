"use client";

import { useProgress } from '@/hooks/use-progress';
import { useUser } from '@/hooks/use-user';
import { Role, User as UserType } from '@/lib/types';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    Edit2,
    Loader2,
    Mail,
    Save,
    ShieldCheck,
    User,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { user, loading, updateUser } = useUser();
    const { stats } = useProgress();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserType>>({
        full_name: '',
        selected_role: null
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                selected_role: user.selected_role
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateUser(formData);
            setIsEditing(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Update failed:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (!user) return null;

    const getRankInfo = (score: number) => {
        if (score >= 9) return { title: "Principal Architect", rank: "Top 0.1%" };
        if (score >= 8) return { title: "Elite Architect", rank: "Top 1%" };
        if (score >= 6) return { title: "Senior Architect", rank: "Top 10%" };
        if (score >= 4) return { title: "Systems Architect", rank: "Top 25%" };
        return { title: "Field Analyst", rank: "Active" };
    };

    const rankInfo = getRankInfo(stats?.average_score || 0);

    const roles = [
        "Backend Engineer",
        "Frontend Engineer",
        "Fullstack Engineer",
        "Systems Engineer",
        "Data Engineer",
        "DevOps Engineer",
        "Security Engineer"
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-neutral-900 border border-white/5 flex items-center justify-center relative group">
                        <User className="w-12 h-12 text-neutral-700" />
                        <div className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{user.full_name}</h1>
                            {success && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                </motion.div>
                            )}
                        </div>
                        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            {rankInfo.title} • {rankInfo.rank}
                        </p>
                    </div>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2.5 rounded-xl border border-white/5 bg-neutral-900 text-neutral-500 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                {/* Information Card */}
                <section className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-600">Core Identity</h3>
                    <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                Email Address
                            </label>
                            <p className="text-sm font-medium text-neutral-300">{user.email}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3" />
                                Display Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                            ) : (
                                <p className="text-sm font-medium text-white">{user.full_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="w-3 h-3" />
                                Professional Focus
                            </label>
                            {isEditing ? (
                                <select
                                    value={formData.selected_role || ''}
                                    onChange={(e) => setFormData({ ...formData, selected_role: (e.target.value as Role) || null })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 appearance-none"
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            ) : (
                                <p className="text-sm font-medium text-white">{user.selected_role || 'No role selected'}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Metadata Card */}
                <section className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-600">Training Metadata</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-black rounded-xl border border-white/5">
                                    <Calendar className="w-4 h-4 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Cortex Tenure</p>
                                    <p className="text-sm font-black text-white">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-black rounded-xl border border-white/5">
                                    <ShieldCheck className="w-4 h-4 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Account Security</p>
                                    <p className="text-sm font-black text-white">Architect Clearance Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
