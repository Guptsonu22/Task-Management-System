'use client';

import { Task } from '@/types';

interface TaskCardProps {
    task: Task;
    index: number;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onToggle: (task: Task) => void;
}

const statusConfig = {
    PENDING: { label: 'Pending', class: 'badge-pending' },
    IN_PROGRESS: { label: 'In Progress', class: 'badge-in-progress' },
    COMPLETED: { label: 'Completed', class: 'badge-completed' },
};

const priorityConfig = {
    LOW: { label: 'Low', class: 'badge-low' },
    MEDIUM: { label: 'Medium', class: 'badge-medium' },
    HIGH: { label: 'High', class: 'badge-high' },
};

const nextStatusLabel: Record<string, string> = {
    PENDING: 'Start',
    IN_PROGRESS: 'Complete',
    COMPLETED: 'Reset',
};

export default function TaskCard({ task, index, onEdit, onDelete, onToggle }: TaskCardProps) {
    const status = statusConfig[task.status];
    const priority = priorityConfig[task.priority];
    const formattedDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : null;

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

    const statusBorderClass =
        task.status === 'PENDING' ? 'card-status-pending' :
            task.status === 'IN_PROGRESS' ? 'card-status-in-progress' :
                'card-status-completed';

    return (
        <div
            className={`flex flex-col card-hover group animate-slide-up h-full ${statusBorderClass}`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap gap-2">
                    <span className={status.class}>{status.label}</span>
                    <span className={priority.class}>{priority.label}</span>
                </div>
            </div>

            <h3 className={`text-lg font-semibold text-text-primary mb-1 ${task.status === 'COMPLETED' ? 'line-through opacity-60' : ''}`}>
                {task.title}
            </h3>

            {task.description && (
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="mt-auto">
                {formattedDate && (
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-danger font-medium' : ''}`}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {isOverdue ? 'Overdue: ' : ''}{formattedDate}
                        </span>
                    </div>
                )}

                <div className="flex items-center pt-3 border-t border-border">
                    <div className="flex w-full bg-surface-lighter rounded-lg overflow-hidden border border-border">
                        <button
                            onClick={() => onEdit(task)}
                            title="Edit Task"
                            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold text-text-secondary hover:text-orange-500 hover:bg-orange-500/10 transition-all border-r border-border"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={() => onDelete(task)}
                            title="Delete Task"
                            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all border-r border-border"
                        >
                            🗑️ Delete
                        </button>
                        <button
                            onClick={() => onToggle(task)}
                            title={task.status === 'COMPLETED' ? 'Reset Task' : 'Complete Task'}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold transition-all ${task.status === 'COMPLETED'
                                ? 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                                : 'text-text-secondary hover:text-green-500 hover:bg-green-500/10'
                                }`}
                        >
                            {task.status === 'COMPLETED' ? '↩️ Reset' : '✔️ Complete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
