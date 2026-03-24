import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  syncProfileToFirebase,
  UserProfile,
} from '../services/firebaseProfileSync';

interface ProfileState {
  profile: UserProfile;
  updateProfile: (
    payload: Partial<UserProfile>
  ) => void;
  syncFirebase: () => Promise<{
    ok: boolean;
    skipped?: boolean;
    message?: string;
  }>;
}

const defaultProfile: UserProfile = {
  fullName: 'Người dùng',
  phone: '',
  email: '',
  department: 'Nhân viên',
};

export const useProfileStore =
  create<ProfileState>()(
    persist(
      (set, get) => ({
        profile: defaultProfile,
        updateProfile: (payload) =>
          set((state) => ({
            profile: {
              ...state.profile,
              ...payload,
            },
          })),
        syncFirebase: async () => {
          try {
            return await syncProfileToFirebase(
              get().profile
            );
          } catch (e: any) {
            return {
              ok: false,
              skipped: false,
              message:
                e?.message ||
                'Lỗi đồng bộ Firebase',
            };
          }
        },
      }),
      {
        name: 'profile-storage',
        storage: createJSONStorage(
          () => AsyncStorage
        ),
      }
    )
  );
