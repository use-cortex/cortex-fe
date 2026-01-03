"use client";

import api from '@/lib/api';
import { User } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('cortex_token') : null;
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/auth/me');
            setUser(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch user:', err);
            setError(err.response?.data?.detail || 'Failed to load profile');
            // If token is invalid, clear it
            if (err.response?.status === 401) {
                localStorage.removeItem('cortex_token');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const updateUser = async (data: Partial<User>) => {
        try {
            const response = await api.put('/users/profile', data);
            setUser(response.data);
            return response.data;
        } catch (err: any) {
            console.error('Failed to update user:', err);
            throw err;
        }
    };

    return { user, loading, error, fetchUser, updateUser };
}
