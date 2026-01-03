import api from '@/lib/api';
import { ProgressStats, TaskResponse } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useProgress() {
    const [stats, setStats] = useState<ProgressStats | null>(null);
    const [history, setHistory] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                setLoading(true);
                const [statsRes, historyRes] = await Promise.all([
                    api.get('/progress/stats'),
                    api.get('/responses/user/history')
                ]);
                setStats(statsRes.data);
                setHistory(historyRes.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Failed to fetch progress');
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    return { stats, history, loading, error };
}
