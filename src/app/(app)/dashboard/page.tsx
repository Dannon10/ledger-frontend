'use client';

import { useDashboardSummary } from '@/hooks/use-dashboard';
import { useInvoices } from '@/hooks/use-invoices';
import type { Invoice } from '@/types';
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

const statusStyles: Record<Invoice['status'], string> = {
    draft: 'bg-gray-100 text-gray-600',
    sent: 'bg-blue-50 text-blue-600',
    paid: 'bg-green-50 text-primary',
    overdue: 'bg-rose-50 text-rose-600',
};

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {children}
        </div>
    );
}

export default function DashboardPage() {
    const { data, isError } = useDashboardSummary();
    const { data: invoices } = useInvoices();

    const monthlyRevenue = (() => {
        const months: Record<string, number> = {};
        invoices
            ?.filter((inv) => inv.status === 'paid' || inv.status === 'sent')
            .forEach((inv) => {
                const month = new Date(inv.createdAt || '').toLocaleDateString('en-US', { month: 'short' });
                months[month] = (months[month] || 0) + inv.total;
            });
        return Object.entries(months).map(([month, total]) => ({ month, total }));
    })();

    if (isError) return <p className="text-sm text-rose-600">Couldn&apos;t load dashboard.</p>;
    if (!data) return <p className="text-sm text-ink-muted">Loading…</p>;

    return (
        <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <div className="mt-6 grid grid-cols-3 gap-6">
                <Card>
                    <p className="text-sm text-ink-muted">Total owed</p>
                    <p className="mt-2 text-3xl font-semibold tabular-nums">${data.totalOwed.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-sm text-ink-muted">Overdue invoices</p>
                    <p className={`mt-2 text-3xl font-semibold tabular-nums ${data.overdueCount > 0 ? 'text-rose-600' : ''}`}>
                        {data.overdueCount}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm text-ink-muted">Active projects</p>
                    <p className="mt-2 text-3xl font-semibold tabular-nums">{data.activeProjectsCount}</p>
                </Card>
            </div>

{/* <div className="flex gap-6 mt-6 w-full"> */}

            <div className="mt-6">
                <Card>
                    <h2 className="text-sm font-medium text-ink-muted">Recent invoices</h2>
                    <div className="mt-4 divide-y divide-border">
                        {invoices?.slice(0, 6).map((invoice) => (
                            <div key={invoice._id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="font-medium">{invoice.invoiceNumber}</p>
                                    <p className="text-sm text-ink-muted">{invoice.client?.company || invoice.client?.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}>
                                        {invoice.status}
                                    </span>
                                    <span className="font-semibold tabular-nums">${invoice.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                        {invoices?.length === 0 && <p className="py-6 text-sm text-ink-muted">No invoices yet.</p>}
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <h2 className="text-sm font-medium text-ink-muted">Revenue by month</h2>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRevenue}>
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, 'Revenue']} />
                                    <Bar dataKey="total" fill="#0b4f3c" radius={[6, 6, 0, 0]} maxBarSize={48} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        {/* </div> */}
</div>
    );
}