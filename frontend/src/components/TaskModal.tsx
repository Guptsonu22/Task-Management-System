'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Task, TaskCreateInput, TaskUpdateInput } from '@/types';
import { taskApi } from '@/lib/tasks';
import toast from 'react-hot-toast';

interface TaskModalProps {
    task: Task | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function TaskModal({ task, onClose, onSaved }: TaskModalProps) {
    const isEditing = !!task;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [status, setStatus] = useState(task?.status || 'PENDING');
    const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
    const [dueDate, setDueDate] = useState(
        task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    );

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Task title is required');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditing) {
                const data: TaskUpdateInput = {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    status,
                    priority,
                    dueDate: dueDate || undefined,
                };
                await taskApi.updateTask(task.id, data);
                toast.success('Task updated successfully');
            } else {
                const data: TaskCreateInput = {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    status,
                    priority,
                    dueDate: dueDate || undefined,
                };
                await taskApi.createTask(data);
                toast.success('Task created successfully');
            }
            onSaved();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} task`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg card p-0 animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-lighter transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-text-secondary mb-2">
                            Title <span className="text-danger">*</span>
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="input-field"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="task-description" className="block text-sm font-medium text-text-secondary mb-2">
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description..."
                            className="input-field resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="task-status" className="block text-sm font-medium text-text-secondary mb-2">
                                Status
                            </label>
                            <select
                                id="task-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="input-field"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="task-priority" className="block text-sm font-medium text-text-secondary mb-2">
                                Priority
                            </label>
                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="input-field"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="task-duedate" className="block text-sm font-medium text-text-secondary mb-2">
                            Due Date
                        </label>
                        <input
                            id="task-duedate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-ghost">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary">
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>{isEditing ? 'Update Task' : 'Create Task'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
