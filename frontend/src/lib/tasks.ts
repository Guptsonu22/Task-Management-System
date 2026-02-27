import api from './api';
import { ApiResponse, Task, TaskCreateInput, TaskUpdateInput, TaskFilters } from '@/types';

export const taskApi = {
    getTasks: async (filters: TaskFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await api.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`);
        return response.data;
    },

    getTask: async (id: string) => {
        const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (data: TaskCreateInput) => {
        const response = await api.post<ApiResponse<Task>>('/tasks', data);
        return response.data;
    },

    updateTask: async (id: string, data: TaskUpdateInput) => {
        const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: string) => {
        const response = await api.delete<ApiResponse>(`/tasks/${id}`);
        return response.data;
    },

    toggleTask: async (id: string) => {
        const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
        return response.data;
    },
};
