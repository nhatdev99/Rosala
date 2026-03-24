import { useColorScheme } from 'react-native';
import { getTheme, AppTheme } from '../utils/theme';
import { useThemeStore } from '../store/useThemeStore';

export function useAppTheme(): AppTheme {
  const mode = useThemeStore((s) => s.mode);
  const palette = useThemeStore((s) => s.palette);
  const systemScheme = useColorScheme();
  const resolvedMode =
    mode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : mode;

  return getTheme(resolvedMode, palette);
}
