'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClient, useClients, useDeleteClient } from '@/hooks/use-clients';
import ClientFormModal from '@/components/client-form-modal';
import ConfirmDialog from '@/components/confirm-dialog';
import type { Client } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function ClientsPage() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [deletingClient, setDeletingClient] = useState<Client | null>(null);

    const { data: clients, isLoading } = useClients();
    const deleteMutation = useDeleteClient();

    const confirmDelete = () => {
        if (deletingClient) {
            deleteMutation.mutate(deletingClient._id, {
                onSuccess: () => setDeletingClient(null),
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Clients</h1>
                <button
                    onClick={() => { setEditingClient(null); setModalOpen(true); }}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                    <Plus size={16} />
                    Add client
                </button>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
                {isLoading && <p className="p-6 text-sm text-ink-muted">Loading…</p>}
                {clients?.length === 0 && <p className="p-6 text-sm text-ink-muted">No clients yet.</p>}

                <div className="divide-y divide-border">
                    {clients?.map((client) => (
                        <div
                            key={client._id}
                            onClick={() => router.push(`/clients/${client._id}`)}
                            className="flex cursor-pointer items-center justify-between px-6 py-4 hover:bg-surface"
                        >
                            <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-ink-muted">
                                    {client.company} {client.email && `· ${client.email}`}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setEditingClient(client); setModalOpen(true); }}
                                    className="rounded-lg p-2 text-ink-muted hover:bg-surface"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeletingClient(client); }}
                                    className="rounded-lg p-2 text-ink-muted hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ClientFormModal open={modalOpen} onClose={() => setModalOpen(false)} client={editingClient} />

            <ConfirmDialog
                open={Boolean(deletingClient)}
                title="Delete client"
                message={`Are you sure you want to delete ${deletingClient?.name}? This cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeletingClient(null)}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}