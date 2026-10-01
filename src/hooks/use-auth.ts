import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type CurrentUser = {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
};

export function useCurrentUser() {
    return useQuery<CurrentUser>({
        queryKey: ['auth', 'me'],
        queryFn: () => api('/auth/me'),
    });
}