import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Invoice } from '@/types';

const KEY = ['invoices'];
const DASHBOARD_KEY = ['dashboard-summary'];

export function useInvoices() {
    return useQuery<Invoice[]>({
        queryKey: KEY,
        queryFn: () => api('/invoices'),
    });
}

export function useCreateInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: Record<string, unknown>) => api('/invoices', { method: 'POST', body }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
        },
    });
}

export function useDeleteInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api(`/invoices/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
        },
    });
}

export function useMarkInvoicePaid() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api(`/invoices/${id}/mark-paid`, { method: 'PATCH' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
        },
    });
}