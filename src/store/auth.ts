import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User } from '../../types/app';

interface AuthState {
  user?: User;
  token?: string;
  role?: Role;
  setSession: (u: User, token: string) => void;
  clear: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    set => ({
      user: undefined,
      token: undefined,
      role: undefined,
      setSession: (u, token) => set({ user: u, token, role: u.role }),
      clear: () => set({ user: undefined, token: undefined, role: undefined }),
    }),
    { name: 'cdss-auth' },
  ),
);
