"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/profile');
            setUser(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch user:', err);
            setError(err.response?.data?.detail || 'Failed to load profile');
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
