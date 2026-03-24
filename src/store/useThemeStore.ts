import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePaletteName =
  | 'pastel_pink_soft'
  | 'pastel_blue_calm'
  | 'pastel_green_mint'
  | 'pastel_purple_dream'
  | 'pastel_yellow_soft'
  | 'pastel_peach'
  | 'pastel_mix_cute';

interface ThemeState {
  mode: ThemeMode;
  palette: ThemePaletteName;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePaletteName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      palette: 'pastel_mix_cute',
      setMode: (mode) => set({ mode }),
      setPalette: (palette) => set({ palette }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
