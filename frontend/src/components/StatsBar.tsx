'use client';

import { Task } from '@/types';

interface StatsBarProps {
    tasks: Task[];
    total: number;
}

export default function StatsBar({ tasks, total }: StatsBarProps) {
    const pending = tasks.filter((t) => t.status === 'PENDING').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;

    const stats = [
        {
            label: 'Total Tasks',
            value: total,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            ),
            color: 'text-primary',
            bg: 'bg-primary/15',
            border: 'border-primary/20',
        },
        {
            label: 'Pending',
            value: pending,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-warning',
            bg: 'bg-warning/15',
            border: 'border-warning/20',
        },
        {
            label: 'In Progress',
            value: inProgress,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'text-info',
            bg: 'bg-info/15',
            border: 'border-info/20',
        },
        {
            label: 'Completed',
            value: completed,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-success',
            bg: 'bg-success/15',
            border: 'border-success/20',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={`card py-4 px-5 border ${stat.border} flex items-center gap-4`}
                >
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        <p className="text-xs text-text-muted font-medium">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
