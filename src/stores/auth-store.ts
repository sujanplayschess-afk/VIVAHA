import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    profileId: string;
    email: string;
    role: string;
    subscription?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setAuth: (user: User, accessToken: string) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: true,

            setAuth: (user, accessToken) => set({
                user,
                accessToken,
                isAuthenticated: true,
                isLoading: false
            }),

            logout: () => set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            }),

            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isLoading = false;
                }
            },
        }
    )
);
