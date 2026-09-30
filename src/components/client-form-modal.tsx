'use client';

import { useState, useEffect } from 'react';
import { useCreateClient, useUpdateClient } from '@/hooks/use-clients';
import type { Client } from '@/types';

type Props = {
    open: boolean;
    onClose: () => void;
    client: Client | null;
};

export default function ClientFormModal({ open, onClose, client }: Props) {
    const isEditing = Boolean(client);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');

    useEffect(() => {
        setName(client?.name || '');
        setEmail(client?.email || '');
        setPhone(client?.phone || '');
        setCompany(client?.company || '');
    }, [client, open]);

    const createMutation = useCreateClient();
    const updateMutation = useUpdateClient();
    const mutation = isEditing ? updateMutation : createMutation;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const body = { name, email, phone, company };

        if (isEditing) {
            updateMutation.mutate({ id: client!._id, body }, { onSuccess: onClose });
        } else {
            createMutation.mutate(body, { onSuccess: onClose });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
                <h2 className="text-lg font-semibold">{isEditing ? 'Edit client' : 'Add client'}</h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm text-ink-muted">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm text-ink-muted">Company</label>
                        <input value={company} onChange={(e) => setCompany(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm text-ink-muted">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm text-ink-muted">Phone</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-rose-600">
                            {mutation.error instanceof Error ? mutation.error.message : 'Something went wrong'}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-ink-muted hover:bg-surface">
                            Cancel
                        </button>
                        <button type="submit" disabled={mutation.isPending}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                            {mutation.isPending ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}