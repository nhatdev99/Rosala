import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  fullName: string;
  employeeCode: string;
  email: string;
  avatarUri: string | null;
}

interface ProfileState {
  profile: UserProfile;
  updateProfile: (payload: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  fullName: 'Nguoi dung',
  employeeCode: '',
  email: '',
  avatarUri: null,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (payload) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...payload,
          },
        })),
      resetProfile: () =>
        set({
          profile: defaultProfile,
        }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
