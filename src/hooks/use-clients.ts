import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Client } from '@/types';

const KEY = ['clients'];

export function useClients() {
    return useQuery<Client[]>({
        queryKey: KEY,
        queryFn: () => api('/clients'),
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: Partial<Client>) => api('/clients', { method: 'POST', body }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: Partial<Client> }) =>
            api(`/clients/${id}`, { method: 'PUT', body }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api(`/clients/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    });
}