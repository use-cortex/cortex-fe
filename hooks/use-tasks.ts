import api from '@/lib/api';
import { Task } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useTasks(role?: string, difficulty?: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (role) params.append('role', role);
                if (difficulty) params.append('difficulty', difficulty);

                const response = await api.get(`/tasks?${params.toString()}`);
                setTasks(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [role, difficulty]);

    return { tasks, loading, error };
}

export function useDailyChallenge() {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDaily = async () => {
            try {
                setLoading(true);
                // API spec says GET /tasks/random/pick
                const response = await api.get('/tasks/random/pick');
                setTask(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Failed to fetch daily challenge');
            } finally {
                setLoading(false);
            }
        };

        fetchDaily();
    }, []);

    return { task, loading, error };
}
