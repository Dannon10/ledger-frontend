import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Project } from '@/types';

const KEY = ['projects'];

export function useProjects() {
    return useQuery<Project[]>({
        queryKey: KEY,
        queryFn: () => api('/projects'),
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: Record<string, unknown>) => api('/projects', { method: 'POST', body }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
            api(`/projects/${id}`, { method: 'PUT', body }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api(`/projects/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    });
}