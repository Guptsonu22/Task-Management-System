import api from './api';
import { ApiResponse, AuthResponse, TokenResponse } from '@/types';

export const authApi = {
    register: async (email: string, name: string, password: string) => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
            email,
            name,
            password,
        });
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    refresh: async (refreshToken: string) => {
        const response = await api.post<ApiResponse<TokenResponse>>('/auth/refresh', {
            refreshToken,
        });
        return response.data;
    },

    logout: async (refreshToken: string) => {
        const response = await api.post<ApiResponse>('/auth/logout', {
            refreshToken,
        });
        return response.data;
    },
};
