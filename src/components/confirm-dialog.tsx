'use client';

type Props = {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
};

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, isLoading }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-lg">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-ink-muted">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-ink-muted hover:bg-surface">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}