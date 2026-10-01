'use client';

import { useParams, useRouter } from 'next/navigation';
import { useClient } from '@/hooks/use-clients';
import { useProjects } from '@/hooks/use-projects';
import { ArrowLeft } from 'lucide-react';

const statusStyles: Record<string, string> = {
    active: 'bg-green-50 text-primary',
    paused: 'bg-amber-50 text-amber-600',
    completed: 'bg-gray-100 text-gray-600',
};

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: client, isLoading } = useClient(id);
    const { data: projects } = useProjects(id);

    if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>;
    if (!client) return <p className="text-sm text-rose-600">Client not found.</p>;

    return (
        <div>
            <button
                onClick={() => router.push('/clients')}
                className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
            >
                <ArrowLeft size={16} />
                Back to clients
            </button>

            <div className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">{client.name}</h1>
                {client.company && <p className="mt-1 text-ink-muted">{client.company}</p>}

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    {client.email && (
                        <div>
                            <p className="text-ink-muted">Email</p>
                            <p className="mt-0.5">{client.email}</p>
                        </div>
                    )}
                    {client.phone && (
                        <div>
                            <p className="text-ink-muted">Phone</p>
                            <p className="mt-0.5">{client.phone}</p>
                        </div>
                    )}
                </div>

                {client.notes && (
                    <div className="mt-4 border-t border-border pt-4 text-sm">
                        <p className="text-ink-muted">Notes</p>
                        <p className="mt-1">{client.notes}</p>
                    </div>
                )}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
                <h2 className="px-6 pt-6 text-sm font-medium text-ink-muted">Projects</h2>

                <div className="mt-4 divide-y divide-border">
                    {projects?.map((project) => (
                        <div key={project._id} className="flex items-center justify-between px-6 py-4">
                            <p className="font-medium">{project.title}</p>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[project.status]}`}>
                                {project.status}
                            </span>
                        </div>
                    ))}

                    {projects?.length === 0 && (
                        <p className="px-6 py-6 text-sm text-ink-muted">No projects for this client yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}