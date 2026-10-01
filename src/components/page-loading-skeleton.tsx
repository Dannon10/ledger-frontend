function SkeletonBlock({ className = '' }: { className?: string }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export function DashboardLoadingSkeleton() {
    return (
        <div role="status" aria-label="Loading dashboard" aria-busy="true">
            <div>
                <SkeletonBlock className="h-8 w-40" />
                <SkeletonBlock className="mt-2 h-4 w-52" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-6">
                {[0, 1, 2].map((item) => (
                    <div key={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <SkeletonBlock className="h-4 w-28" />
                        <SkeletonBlock className="mt-3 h-9 w-32" />
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="mt-5 h-64 w-full" />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <SkeletonBlock className="h-4 w-32" />
                <div className="mt-4 divide-y divide-border">
                    {[0, 1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center justify-between py-3">
                            <div>
                                <SkeletonBlock className="h-4 w-28" />
                                <SkeletonBlock className="mt-2 h-3 w-36" />
                            </div>
                            <SkeletonBlock className="h-6 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ListLoadingSkeleton({ label }: { label: string }) {
    return (
        <div role="status" aria-label={label} aria-busy="true" className="divide-y divide-border">
            {[0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between px-6 py-4">
                    <div>
                        <SkeletonBlock className="h-4 w-36" />
                        <SkeletonBlock className="mt-2 h-3 w-48" />
                    </div>
                    <SkeletonBlock className="h-7 w-24" />
                </div>
            ))}
        </div>
    );
}