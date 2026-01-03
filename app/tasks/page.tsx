"use client";

import { useTasks } from '@/hooks/use-tasks';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronDown,
    Clock,
    Loader2,
    MessageSquare,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const roles = ['All Roles', 'Backend Engineer', 'Frontend Engineer', 'Systems Engineer', 'Data Engineer'];
const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function TasksPage() {
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedDiff, setSelectedDiff] = useState('All Levels');
    const [searchQuery, setSearchQuery] = useState('');

    const roleParam = selectedRole === 'All Roles' ? undefined : selectedRole;
    const diffParam = selectedDiff === 'All Levels' ? undefined : selectedDiff.toLowerCase();

    const { tasks, loading, error } = useTasks(roleParam, diffParam);

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 py-4">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black mb-1 uppercase tracking-tighter">Engineering Tasks</h1>
                    <p className="text-[13px] text-neutral-500 font-medium">Apply your architectural thinking to real-world scenarios.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-neutral-900 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-[12px] focus:outline-none focus:border-white/10 w-48 transition-all"
                        />
                    </div>

                    <FilterDropdown label={selectedRole} items={roles} onSelect={setSelectedRole} />
                    <FilterDropdown label={selectedDiff} items={difficulties} onSelect={setSelectedDiff} />
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-700" />
                </div>
            ) : error ? (
                <div className="p-12 text-center rounded-2xl border border-white/5 bg-neutral-900/10 text-neutral-500 text-sm">
                    {error}
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="p-20 text-center rounded-2xl border border-dashed border-white/5 text-neutral-600 text-[13px] font-medium uppercase tracking-widest">
                    No tasks found matching your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.map((task, i) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 rounded-2xl border border-white/5 bg-neutral-900/10 hover:bg-neutral-900/30 transition-all group relative"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                                    {task.difficulty}
                                </span>
                                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{task.role}</span>
                            </div>

                            <h3 className="text-lg font-bold text-neutral-200 mb-6 group-hover:text-white transition-colors">
                                {task.title}
                            </h3>

                            <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 group-hover:text-neutral-400 transition-colors">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-bold">{task.estimated_time_minutes}m</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-neutral-600 group-hover:text-neutral-400 transition-colors">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-bold">1.2k</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/tasks/${task.id}`}
                                    className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white text-neutral-400 hover:text-black text-[11px] font-bold transition-all flex items-center gap-2"
                                >
                                    START
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function FilterDropdown({ label, items, onSelect }: { label: string, items: string[], onSelect: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-neutral-900 border border-white/5 rounded-lg px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-colors"
            >
                {label}
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full mt-1.5 right-0 min-w-[160px] bg-neutral-900 border border-white/10 rounded-xl shadow-2xl py-2 z-20 overflow-hidden">
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
