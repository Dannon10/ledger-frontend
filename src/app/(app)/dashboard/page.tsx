'use client';

import { useDashboardSummary } from '@/hooks/use-dashboard';
import { useInvoices } from '@/hooks/use-invoices';
import { useCurrentUser } from '@/hooks/use-auth';
import { DashboardLoadingSkeleton } from '@/components/page-loading-skeleton';
import type { Invoice } from '@/types';
import {
    AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { Wallet, AlertCircle, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';

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
    const { data, isError, isLoading } = useDashboardSummary();
    const { data: invoices, isLoading: invoicesLoading } = useInvoices();
    const { data: user } = useCurrentUser();

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

    const lastTwo = monthlyRevenue.slice(-2);
    const change = lastTwo.length === 2 && lastTwo[0].total > 0
        ? ((lastTwo[1].total - lastTwo[0].total) / lastTwo[0].total) * 100
        : null;

    if (isError) return <p className="text-sm text-rose-600">Couldn&apos;t load dashboard.</p>;
    if (isLoading || invoicesLoading || !data) return <DashboardLoadingSkeleton />;

    return (
        <div>
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                {user && <p className="mt-1 text-sm text-ink-muted">Welcome back, {user.name.split(' ')[0]}</p>}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center gap-2 text-ink-muted">
                        <Wallet size={16} />
                        <p className="text-sm">Total owed</p>
                    </div>
                    <p className="mt-2 text-3xl font-semibold tabular-nums">${data.totalOwed.toLocaleString()}</p>
                </Card>

                <Card>
                    <div className="flex items-center gap-2 text-ink-muted">
                        <AlertCircle size={16} />
                        <p className="text-sm">Overdue invoices</p>
                    </div>
                    <p className={`mt-2 text-3xl font-semibold tabular-nums ${data.overdueCount > 0 ? 'text-rose-600' : ''}`}>
                        {data.overdueCount}
                    </p>
                </Card>

                <Card>
                    <div className="flex items-center gap-2 text-ink-muted">
                        <Briefcase size={16} />
                        <p className="text-sm">Active projects</p>
                    </div>
                    <p className="mt-2 text-3xl font-semibold tabular-nums">{data.activeProjectsCount}</p>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-ink-muted">Revenue by month</h2>
                        {change !== null && (
                            <span className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-primary' : 'text-rose-600'}`}>
                                {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                        )}
                    </div>

                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyRevenue}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0b4f3c" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0b4f3c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, 'Revenue']} />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#0b4f3c"
                                    strokeWidth={2}
                                    fill="url(#revenueGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

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
        </div>
    );
}