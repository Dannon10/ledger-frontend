'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useMutation({
        mutationFn: () => api('/auth/login', {
            method: 'POST',
            body: { email, password },
        }),
        onSuccess: () => {
            router.push('/dashboard');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <h1 className="font-serif text-3xl">Ledger</h1>
                <p className="mt-1 text-sm text-ink/60">Sign in to your account</p>

                {loginMutation.isError && (
                    <p className="mt-6 border-l-2 border-ledger-red pl-3 text-sm text-ledger-red">
                        {loginMutation.error instanceof Error
                            ? loginMutation.error.message
                            : 'Login failed'}
                    </p>
                )}

                <div className="mt-8 space-y-5">
                    <div>
                        <label className="block text-sm text-ink/70">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full border-b border-ink/20 bg-transparent py-1.5 outline-none focus:border-ink"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-ink/70">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full border-b border-ink/20 bg-transparent py-1.5 outline-none focus:border-ink"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="mt-8 w-full bg-ink py-2.5 text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}