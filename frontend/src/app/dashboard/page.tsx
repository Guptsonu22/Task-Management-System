'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { taskApi } from '@/lib/tasks';
import { Task, TaskFilters } from '@/types';
import toast from 'react-hot-toast';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import DeleteModal from '@/components/DeleteModal';
import Navbar from '@/components/Navbar';
import StatsBar from '@/components/StatsBar';

export default function DashboardPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10 });
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');

    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setSearchDebounce(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setFilters((prev) => ({ ...prev, search: searchDebounce || undefined, page: 1 }));
    }, [searchDebounce]);

    // Auth guard
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Fetch tasks
    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoadingTasks(true);
        try {
            const response = await taskApi.getTasks(filters);
            setTasks(response.data || []);
            if (response.meta) setMeta(response.meta);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setIsLoadingTasks(false);
        }
    }, [filters, isAuthenticated]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Handlers
    const handleCreateTask = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = (task: Task) => {
        setDeletingTask(task);
        setIsDeleteModalOpen(true);
    };

    const handleToggleTask = async (task: Task) => {
        try {
            await taskApi.toggleTask(task.id);
            toast.success('Task status updated');
            fetchTasks();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to toggle task');
        }
    };

    const handleTaskSaved = () => {
        setIsTaskModalOpen(false);
        setEditingTask(null);
        fetchTasks();
    };

    const handleTaskDeleted = async () => {
        if (!deletingTask) return;
        try {
            await taskApi.deleteTask(deletingTask.id);
            toast.success('Task deleted successfully');
            setIsDeleteModalOpen(false);
            setDeletingTask(null);
            fetchTasks();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete task');
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
            page: 1,
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-surface">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                    <button
                        onClick={handleCreateTask}
                        className="btn-primary"
                        id="btn-add-task-header"
                    >
                        + Add Task
                    </button>
                </div>

                {/* Stats */}
                <StatsBar tasks={tasks} total={meta.total} />

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks by title..."
                            className="input-field pl-12"
                            id="search-tasks"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 flex-wrap">
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="input-field w-auto min-w-[140px]"
                            id="filter-status"
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <select
                            value={filters.priority || ''}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="input-field w-auto min-w-[140px]"
                            id="filter-priority"
                        >
                            <option value="">All Priority</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                </div>

                {/* Tasks Grid */}
                {isLoadingTasks ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="card h-48 animate-pulse flex flex-col justify-between">
                                <div>
                                    <div className="flex gap-2 mb-4">
                                        <div className="h-6 w-20 bg-surface-lighter rounded"></div>
                                        <div className="h-6 w-16 bg-surface-lighter rounded"></div>
                                    </div>
                                    <div className="h-6 w-3/4 bg-surface-lighter rounded mb-3"></div>
                                    <div className="h-4 w-full bg-surface-lighter rounded mb-2"></div>
                                    <div className="h-4 w-2/3 bg-surface-lighter rounded"></div>
                                </div>
                                <div className="h-8 w-full bg-surface-lighter rounded mt-4"></div>
                            </div>
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <div className="w-20 h-20 bg-surface-light rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">No tasks yet</h3>
                        <p className="text-text-secondary mb-6">
                            Create your first task to get started
                        </p>
                        <button onClick={handleCreateTask} className="btn-primary">
                            + Add Task
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onToggle={handleToggleTask}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col items-center justify-center gap-4 mt-8 animate-fade-in">
                            <p className="text-center text-text-muted text-sm">
                                Showing {tasks.length} of {meta.total} tasks
                            </p>

                            {meta.totalPages > 0 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                                        disabled={meta.page <= 1}
                                        className="btn-outline px-4 py-2"
                                    >
                                        Prev
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setFilters((prev) => ({ ...prev, page }))}
                                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === meta.page
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                                        disabled={meta.page >= meta.totalPages}
                                        className="btn-outline px-4 py-2"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Modals */}
            {isTaskModalOpen && (
                <TaskModal
                    task={editingTask}
                    onClose={() => {
                        setIsTaskModalOpen(false);
                        setEditingTask(null);
                    }}
                    onSaved={handleTaskSaved}
                />
            )}

            {isDeleteModalOpen && deletingTask && (
                <DeleteModal
                    taskTitle={deletingTask.title}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeletingTask(null);
                    }}
                    onConfirm={handleTaskDeleted}
                />
            )}
        </div>
    );
}
