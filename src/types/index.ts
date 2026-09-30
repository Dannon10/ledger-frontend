export type Client = {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
};

export type Project = {
    _id: string;
    title: string;
    description?: string;
    status: 'active' | 'paused' | 'completed';
    deadline?: string;
    client: { _id: string; name: string; company?: string };
};

export type LineItem = { description: string; quantity: number; rate: number };

export type Invoice = {
    _id: string;
    invoiceNumber: string;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    dueDate: string;
    createdAt: string;
    lineItems: LineItem[];
    project: { _id: string; title: string; client: { _id: string } };
    client: { _id: string; name: string; company?: string };
};

export type DashboardSummary = {
    totalOwed: number;
    overdueCount: number;
    activeProjectsCount: number;
};