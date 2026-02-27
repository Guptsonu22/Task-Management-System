'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/types';
import { authApi } from '@/lib/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = Cookies.get('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                Cookies.remove('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        const { user: userData, accessToken, refreshToken } = response.data!;

        Cookies.set('accessToken', accessToken, { expires: 1 });
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });

        setUser(userData);
        toast.success('Login successful!');
    };

    const register = async (email: string, name: string, password: string) => {
        const response = await authApi.register(email, name, password);
        const { user: userData, accessToken, refreshToken } = response.data!;

        Cookies.set('accessToken', accessToken, { expires: 1 });
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });

        setUser(userData);
        toast.success('Registration successful!');
    };

    const logout = async () => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        } catch {
            // Ignore logout errors
        } finally {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            setUser(null);
            toast.success('Logged out successfully');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
