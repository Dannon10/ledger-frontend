'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ClientFormModal from '@/components/client-form-modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export type Client = {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
};

export default function ClientsPage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const { data: clients, isLoading } = useQuery<Client[]>({
        queryKey: ['clients'],
        queryFn: () => api('/clients'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api(`/clients/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    const openCreateModal = () => {
        setEditingClient(null);
        setModalOpen(true);
    };

    const openEditModal = (client: Client) => {
        setEditingClient(client);
        setModalOpen(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Clients</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                    <Plus size={16} />
                    Add client
                </button>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
                {isLoading && <p className="p-6 text-sm text-ink-muted">Loading…</p>}

                {clients?.length === 0 && (
                    <p className="p-6 text-sm text-ink-muted">No clients yet.</p>
                )}

                <div className="divide-y divide-border">
                    {clients?.map((client) => (
                        <div key={client._id} className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-ink-muted">
                                    {client.company} {client.email && `· ${client.email}`}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEditModal(client)}
                                    className="rounded-lg p-2 text-ink-muted hover:bg-surface"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(client._id)}
                                    className="rounded-lg p-2 text-ink-muted hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ClientFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                client={editingClient}
            />
        </div>
    );
}