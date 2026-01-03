"use client";

import { useProgress } from '@/hooks/use-progress';
import { motion } from 'framer-motion';
import { BrainCircuitIcon, Loader2, Shield, Star, Target, Trophy, Zap } from 'lucide-react';

const achievementsList = [
    { id: 1, title: 'First Analysis', desc: 'Successfully submitted your first engineering task.', icon: Zap, unlocked: true },
    { id: 2, title: 'Thinker Level 5', desc: 'Achieved an average think score above 8.0.', icon: BrainCircuitIcon, unlocked: true },
    { id: 3, title: 'Streak Master', desc: 'Maintained a 7-day training streak.', icon: Star, unlocked: false },
    { id: 4, title: 'System Architect', desc: 'Completed 10 advanced difficulty tasks.', icon: Shield, unlocked: false },
    { id: 5, title: 'Drill Sergeant', desc: 'Achieved 100% accuracy in 5 consecutive drills.', icon: Target, unlocked: false },
];

export default function AchievementsPage() {
    const { loading } = useProgress();

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-700" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Trophy className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tighter">Engineering Awards</h1>
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Milestones in technical cognitive growth.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievementsList.map((ach, i) => (
                    <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-6 rounded-2xl border ${ach.unlocked ? 'border-white/10 bg-neutral-900/20' : 'border-white/5 bg-neutral-900/5 opacity-50 grayscale'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ach.unlocked ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-600'}`}>
                                <ach.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-black uppercase tracking-tight text-white">{ach.title}</h3>
                                    {!ach.unlocked && <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest border border-neutral-800 px-1.5 py-0.5 rounded">Locked</span>}
                                </div>
                                <p className="text-[12px] text-neutral-500 font-medium leading-relaxed">
                                    {ach.desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

import { BrainCircuit } from 'lucide-react';
