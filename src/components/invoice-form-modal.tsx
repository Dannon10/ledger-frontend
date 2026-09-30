'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, X } from 'lucide-react';

type Props = {
    open: boolean;
    onClose: () => void;
};

type LineItem = { description: string; quantity: number; rate: number };
type ProjectOption = { _id: string; title: string; client: { _id: string } };

export default function InvoiceFormModal({ open, onClose }: Props) {
    const queryClient = useQueryClient();

    const { data: projects } = useQuery<ProjectOption[]>({
        queryKey: ['projects'],
        queryFn: () => api('/projects'),
        enabled: open,
    });

    const [project, setProject] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { description: '', quantity: 1, rate: 0 },
    ]);

    useEffect(() => {
        if (open) {
            setProject('');
            setDueDate('');
            setLineItems([{ description: '', quantity: 1, rate: 0 }]);
        }
    }, [open]);

    const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
        setLineItems((items) =>
            items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    const addLineItem = () => {
        setLineItems((items) => [...items, { description: '', quantity: 1, rate: 0 }]);
    };

    const removeLineItem = (index: number) => {
        setLineItems((items) => items.filter((_, i) => i !== index));
    };

    const total = lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);

    const mutation = useMutation({
        mutationFn: () => {
            const selectedProject = projects?.find((p) => p._id === project);
            return api('/invoices', {
                method: 'POST',
                body: {
                    project,
                    client: selectedProject?.client._id,
                    dueDate,
                    lineItems,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            onClose();
        },
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-lg">
                <h2 className="text-lg font-semibold">New invoice</h2>

                <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm text-ink-muted">Project</label>
                        <select
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                        >
                            <option value="" disabled>Select a project</option>
                            {projects?.map((p) => (
                                <option key={p._id} value={p._id}>{p.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-ink-muted">Due date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-ink-muted">Line items</label>
                        <div className="mt-2 space-y-2">
                            {lineItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                                        required
                                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                                    />
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                                        className="w-16 rounded-lg border border-border px-2 py-2 text-sm outline-none focus:border-primary"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        value={item.rate}
                                        onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                                        className="w-24 rounded-lg border border-border px-2 py-2 text-sm outline-none focus:border-primary"
                                    />
                                    {lineItems.length > 1 && (
                                        <button type="button" onClick={() => removeLineItem(index)} className="text-ink-muted hover:text-rose-600">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addLineItem}
                            className="mt-2 flex items-center gap-1 text-sm text-primary"
                        >
                            <Plus size={14} /> Add line item
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm text-ink-muted">Total</span>
                        <span className="text-lg font-semibold tabular-nums">${total.toLocaleString()}</span>
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
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Creating…' : 'Create invoice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}