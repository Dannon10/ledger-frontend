'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, FileText } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-auth';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/invoices', label: 'Invoices', icon: FileText },
];

function getInitials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function Sidebar() {
    const pathname = usePathname();
    const { data: user } = useCurrentUser();

    return (
        <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6">
            <p className="px-2 text-lg font-semibold text-primary">Ledger</p>

            <nav className="mt-8 flex-1 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active
                                    ? 'bg-primary/10 font-medium text-primary'
                                    : 'text-ink-muted hover:bg-surface'
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {user && (
                <div className="flex items-center gap-3 border-t border-border px-2 pt-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                        {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="text-xs capitalize text-ink-muted">{user.role}</p>
                    </div>
                </div>
            )}
        </aside>
    );
}