import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isProUser: boolean;
  userType: 'pro' | 'lite' | null;
  setUser: (user: User | null) => void;
  setProUser: (isProUser: boolean) => void;
  setUserType: (type: 'pro' | 'lite' | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isProUser: false,
      userType: null,
      setUser: (user) => set({ user }),
      setProUser: (isProUser) => set({ isProUser }),
      setUserType: (type) => set({ userType: type, isProUser: type === 'pro' }),
      logout: () => set({ user: null, isProUser: false, userType: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isProUser: state.isProUser,
        userType: state.userType,
      }),
    }
  )
);