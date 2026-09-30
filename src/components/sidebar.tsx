'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, FileText } from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/invoices', label: 'Invoices', icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-60 shrink-0 border-r border-border bg-card px-4 py-6">
            <p className="px-2 text-lg font-semibold text-primary">Ledger</p>

            <nav className="mt-8 space-y-1">
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
        </aside>
    );
}