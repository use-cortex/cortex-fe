"use client";

import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Authenticating</span>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
