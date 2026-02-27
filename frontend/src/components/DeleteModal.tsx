'use client';

import { useState } from 'react';

interface DeleteModalProps {
    taskTitle: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteModal({ taskTitle, onClose, onConfirm }: DeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md card animate-scale-in text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-danger/15 border border-danger/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-2">Delete Task</h3>
                <p className="text-text-secondary mb-6">
                    Are you sure you want to delete <strong className="text-text-primary">&quot;{taskTitle}&quot;</strong>? This action cannot be undone.
                </p>

                <div className="flex items-center justify-center gap-3">
                    <button onClick={onClose} className="btn-ghost px-6" disabled={isDeleting}>
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className="btn-danger px-6" disabled={isDeleting}>
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
