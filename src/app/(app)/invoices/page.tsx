'use client';

import { useState } from 'react';
import { useInvoices, useDeleteInvoice, useMarkInvoicePaid } from '@/hooks/use-invoices';
import InvoiceFormModal from '@/components/invoice-form-modal';
import type { Invoice } from '@/types';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const statusStyles: Record<Invoice['status'], string> = {
    draft: 'bg-gray-100 text-gray-600',
    sent: 'bg-blue-50 text-blue-600',
    paid: 'bg-green-50 text-primary',
    overdue: 'bg-rose-50 text-rose-600',
};

export default function InvoicesPage() {
    const [modalOpen, setModalOpen] = useState(false);

    const { data: invoices, isLoading } = useInvoices();
    const deleteMutation = useDeleteInvoice();
    const markPaidMutation = useMarkInvoicePaid();

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Invoices</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                    <Plus size={16} />
                    New invoice
                </button>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
                {isLoading && <p className="p-6 text-sm text-ink-muted">Loading…</p>}
                {invoices?.length === 0 && <p className="p-6 text-sm text-ink-muted">No invoices yet.</p>}

                <div className="divide-y divide-border">
                    {invoices?.map((invoice) => (
                        <div key={invoice._id} className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="font-medium">{invoice.invoiceNumber}</p>
                                <p className="text-sm text-ink-muted">
                                    {invoice.client?.company || invoice.client?.name} · {invoice.project?.title}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="font-semibold tabular-nums">${invoice.total.toLocaleString()}</span>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}>
                                    {invoice.status}
                                </span>

                                {invoice.status !== 'paid' && (
                                    <button
                                        onClick={() => markPaidMutation.mutate(invoice._id)}
                                        className="rounded-lg p-2 text-ink-muted hover:bg-green-50 hover:text-primary"
                                        title="Mark as paid"
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                )}

                                <button
                                    onClick={() => deleteMutation.mutate(invoice._id)}
                                    className="rounded-lg p-2 text-ink-muted hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <InvoiceFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}