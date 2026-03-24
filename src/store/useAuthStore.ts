import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
  phone?: string;
  avatarId?: string;
}

interface AuthState {
  users: UserProfile[];
  currentUserId?: string;
  register: (payload: Omit<UserProfile, 'id'>) => { ok: boolean; message?: string };
  login: (email: string, password: string) => { ok: boolean; message?: string };
  logout: () => void;
  updateProfile: (patch: Partial<Omit<UserProfile, 'id' | 'email' | 'password'>>) => void;
  updateAvatar: (avatarId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: undefined,
      register: (payload) => {
        const exists = get().users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
        if (exists) return { ok: false, message: 'Email đã được sử dụng.' };

        const user: UserProfile = {
          id: `u_${Date.now()}`,
          ...payload,
        };

        set((state) => ({
          users: [...state.users, user],
          currentUserId: user.id,
        }));

        return { ok: true };
      },
      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) return { ok: false, message: 'Sai email hoặc mật khẩu.' };
        set({ currentUserId: user.id });
        return { ok: true };
      },
      logout: () => set({ currentUserId: undefined }),
      updateProfile: (patch) => {
        const id = get().currentUserId;
        if (!id) return;
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        }));
      },
      updateAvatar: (avatarId) => {
        const id = get().currentUserId;
        if (!id) return;
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, avatarId } : u)),
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useCurrentUser = () =>
  useAuthStore((s) => s.users.find((u) => u.id === s.currentUserId));
