"use client";

import { useUser } from '@/hooks/use-user';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AuthPage({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userLoading && user) {
            router.push('/dashboard');
        }
    }, [user, userLoading, router]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'Backend Engineer'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const response = await api.post('/auth/signup', {
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName,
                    selected_role: formData.role
                });
                localStorage.setItem('cortex_token', response.data.access_token);
            } else {
                const response = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('cortex_token', response.data.access_token);
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background patterns */}
            <div className="fixed inset-0 -z-10 dot-pattern opacity-40" />
            <div className="fixed inset-0 -z-10 hero-gradient" />

            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[400px]"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl mb-6 shadow-2xl">
                        <Zap className="w-6 h-6 text-black fill-black" />
                    </div>
                    <h1 className="text-3xl font-serif mb-2 tracking-tight">
                        {mode === 'login' ? 'Welcome back.' : 'Create an account.'}
                    </h1>
                    <p className="text-sm text-neutral-500 font-medium">
                        {mode === 'login'
                            ? 'Enter your credentials to access the lab.'
                            : 'Start your journey into system architecture.'}
                    </p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-[12px] font-bold text-red-500 tracking-tight text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {mode === 'signup' && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest px-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-medium placeholder:text-neutral-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest px-1">Designation</label>
                                    <div className="relative">
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all appearance-none font-medium cursor-pointer placeholder:text-neutral-700 hover:bg-black/60"
                                        >
                                            <option value="Backend Engineer">Backend Engineer</option>
                                            <option value="Frontend Engineer">Frontend Engineer</option>
                                            <option value="Systems Engineer">Systems Engineer</option>
                                            <option value="Data Engineer">Data Engineer</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest px-1">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-medium placeholder:text-neutral-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Password</label>
                                {mode === 'login' && (
                                    <Link href="#" className="text-[11px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">Forgot?</Link>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-medium placeholder:text-neutral-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {mode === 'login' ? 'Sign in' : 'Create account'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-neutral-500 font-medium tracking-tight">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                            <Link
                                href={mode === 'login' ? '/signup' : '/login'}
                                className="text-white hover:underline transition-all ml-1"
                            >
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale filter">
                    {/* Simplified brand lockups */}
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">L4 ARCHITECT</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">S5 SYSTEMS</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">E3 DISTRIBUTED</span>
                </div>
            </motion.div>
        </div>
    );
}
