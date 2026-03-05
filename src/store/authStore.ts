import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setLoading: (v: boolean) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'plantiq-auth',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
