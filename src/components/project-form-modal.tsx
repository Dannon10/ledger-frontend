'use client';

import { useState, useEffect } from 'react';
import { useClients } from '@/hooks/use-clients';
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects';
import type { Project } from '@/types';

type Props = {
    open: boolean;
    onClose: () => void;
    project: Project | null;
};

export default function ProjectFormModal({ open, onClose, project }: Props) {
    const isEditing = Boolean(project);

    const { data: clients } = useClients();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Project['status']>('active');
    const [deadline, setDeadline] = useState('');
    const [client, setClient] = useState('');

    useEffect(() => {
        setTitle(project?.title || '');
        setDescription(project?.description || '');
        setStatus(project?.status || 'active');
        setDeadline(project?.deadline?.slice(0, 10) || '');
        setClient(project?.client?._id || '');
    }, [project, open]);

    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject();
    const mutation = isEditing ? updateMutation : createMutation;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const body = { title, description, status, deadline, client };

        if (isEditing) {
            updateMutation.mutate({ id: project!._id, body }, { onSuccess: onClose });
        } else {
            createMutation.mutate(body, { onSuccess: onClose });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
                <h2 className="text-lg font-semibold">{isEditing ? 'Edit project' : 'Add project'}</h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm text-ink-muted">Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>

                    <div>
                        <label className="block text-sm text-ink-muted">Client</label>
                        <select value={client} onChange={(e) => setClient(e.target.value)} required
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary">
                            <option value="" disabled>Select a client</option>
                            {clients?.map((c) => (
                                <option key={c._id} value={c._id}>{c.company || c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-ink-muted">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-ink-muted">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value as Project['status'])}
                                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary">
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-ink-muted">Deadline</label>
                            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>
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