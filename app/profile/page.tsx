"use client";

import { useProgress } from '@/hooks/use-progress';
import { useUser } from '@/hooks/use-user';
import { Role, Difficulty, User as UserType } from '@/lib/types';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    ChevronDown,
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
        selected_role: null,
        selected_level: null
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                selected_role: user.selected_role,
                selected_level: user.selected_level
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
                                <ProfileDropdown
                                    label={formData.selected_role || 'Select Role'}
                                    items={roles}
                                    onSelect={(val) => setFormData({ ...formData, selected_role: (val as Role) || null })}
                                    placeholder="Select Role"
                                />
                            ) : (
                                <p className="text-sm font-medium text-white">{user.selected_role || 'No role selected'}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                Difficulty Level
                            </label>
                            {isEditing ? (
                                <ProfileDropdown
                                    label={formData.selected_level || 'Select Level'}
                                    items={['Beginner', 'Intermediate', 'Advanced']}
                                    onSelect={(val) => setFormData({ ...formData, selected_level: (val as Difficulty) || null })}
                                    placeholder="Select Level"
                                />
                            ) : (
                                <p className="text-sm font-medium text-white">{user.selected_level || 'No level selected'}</p>
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

function ProfileDropdown({ label, items, onSelect, placeholder }: { label: string, items: string[], onSelect: (val: string) => void, placeholder: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-neutral-900 border border-white/5 rounded-lg px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest flex items-center justify-between hover:bg-neutral-800 transition-colors text-left"
            >
                <span className={label === placeholder ? 'text-neutral-500' : 'text-white'}>{label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full mt-1.5 left-0 right-0 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl py-2 z-20 overflow-hidden">
                        <button
                            onClick={() => {
                                onSelect('');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-[11px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors ${label === placeholder ? 'text-white bg-white/5' : 'text-neutral-500'}`}
                        >
                            {placeholder}
                        </button>
                        {items.map(item => (
                            <button
                                key={item}
                                onClick={() => {
                                    onSelect(item);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-[11px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors ${label === item ? 'text-white bg-white/5' : 'text-neutral-500'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
