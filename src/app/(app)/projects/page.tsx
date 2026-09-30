'use client';

import { useState } from 'react';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import ProjectFormModal from '@/components/project-form-modal';
import type { Project } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const statusStyles: Record<Project['status'], string> = {
    active: 'bg-green-50 text-primary',
    paused: 'bg-amber-50 text-amber-600',
    completed: 'bg-gray-100 text-gray-600',
};

export default function ProjectsPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { data: projects, isLoading } = useProjects();
    const deleteMutation = useDeleteProject();

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Projects</h1>
                <button
                    onClick={() => { setEditingProject(null); setModalOpen(true); }}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                    <Plus size={16} />
                    Add project
                </button>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
                {isLoading && <p className="p-6 text-sm text-ink-muted">Loading…</p>}
                {projects?.length === 0 && <p className="p-6 text-sm text-ink-muted">No projects yet.</p>}

                <div className="divide-y divide-border">
                    {projects?.map((project) => (
                        <div key={project._id} className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="font-medium">{project.title}</p>
                                <p className="text-sm text-ink-muted">
                                    {project.client?.company || project.client?.name}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[project.status]}`}>
                                    {project.status}
                                </span>
                                <button
                                    onClick={() => { setEditingProject(project); setModalOpen(true); }}
                                    className="rounded-lg p-2 text-ink-muted hover:bg-surface"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(project._id)}
                                    className="rounded-lg p-2 text-ink-muted hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ProjectFormModal open={modalOpen} onClose={() => setModalOpen(false)} project={editingProject} />
        </div>
    );
}