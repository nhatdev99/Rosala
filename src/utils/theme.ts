import { ThemeMode, ThemePaletteName } from '../store/useThemeStore';

export interface PaletteBase {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text_primary: string;
  text_secondary: string;
  border: string;
}

export interface AppTheme {
  colors: {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    primaryFixed: string;
    primaryFixedDim: string;
    onPrimaryFixed: string;
    onPrimaryFixedVariant: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    secondaryFixed: string;
    secondaryFixedDim: string;
    onSecondaryFixed: string;
    onSecondaryFixedVariant: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    tertiaryFixed: string;
    tertiaryFixedDim: string;
    onTertiaryFixed: string;
    onTertiaryFixedVariant: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceBright: string;
    surfaceDim: string;
    surfaceTint: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
  };
  typography: {
    headline: string;
    body: string;
    label: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

export const pastelPalettes: Record<ThemePaletteName, PaletteBase> = {
  pastel_pink_soft: {
    primary: '#FFB7C5',
    secondary: '#FFDDE2',
    accent: '#FFC8DD',
    background: '#FFF5F7',
    surface: '#FFFFFF',
    text_primary: '#5A3E42',
    text_secondary: '#8C6A70',
    border: '#F3C6CE',
  },
  pastel_blue_calm: {
    primary: '#A7C7E7',
    secondary: '#D6E6F5',
    accent: '#B5D8FF',
    background: '#F4F9FF',
    surface: '#FFFFFF',
    text_primary: '#2F4F6F',
    text_secondary: '#6C8AA6',
    border: '#CFE0F5',
  },
  pastel_green_mint: {
    primary: '#B5EAD7',
    secondary: '#E2F7F1',
    accent: '#C7F0E3',
    background: '#F6FFFB',
    surface: '#FFFFFF',
    text_primary: '#2E5D50',
    text_secondary: '#6FA79A',
    border: '#D4F1E8',
  },
  pastel_purple_dream: {
    primary: '#CDB4DB',
    secondary: '#E9D8F1',
    accent: '#D8C2E8',
    background: '#FAF7FC',
    surface: '#FFFFFF',
    text_primary: '#4B3F5C',
    text_secondary: '#7E6F95',
    border: '#E0D2EC',
  },
  pastel_yellow_soft: {
    primary: '#FFF1A8',
    secondary: '#FFF7D6',
    accent: '#FFE8A3',
    background: '#FFFCF2',
    surface: '#FFFFFF',
    text_primary: '#6B5E2E',
    text_secondary: '#9A8E5A',
    border: '#F5E8B8',
  },
  pastel_peach: {
    primary: '#FFD6A5',
    secondary: '#FFE8CC',
    accent: '#FFCAA0',
    background: '#FFF8F2',
    surface: '#FFFFFF',
    text_primary: '#6A4E3B',
    text_secondary: '#A07A5F',
    border: '#F2D5C2',
  },
  pastel_mix_cute: {
    primary: '#FFAFCC',
    secondary: '#BDE0FE',
    accent: '#A2D2FF',
    background: '#F8FBFF',
    surface: '#FFFFFF',
    text_primary: '#3A3A3A',
    text_secondary: '#7A7A7A',
    border: '#E0E7FF',
  },
  pastel_gray_black: {
    primary: '#5B616E',
    secondary: '#2E333C',
    accent: '#747B8A',
    background: '#171A20',
    surface: '#1E232C',
    text_primary: '#F3F5F8',
    text_secondary: '#B1B7C4',
    border: '#3D4452',
  },
};

const sharedTokens = {
  typography: {
    headline: 'Manrope',
    body: 'Inter',
    label: 'Inter',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radii: {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    full: 9999,
  },
};

function hexToRgb(hex: string) {
  const raw = hex.replace('#', '');
  const num = parseInt(raw, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const c = (n: number) => n.toString(16).padStart(2, '0');
  return `#${c(Math.max(0, Math.min(255, Math.round(r))))}${c(Math.max(0, Math.min(255, Math.round(g))))}${c(Math.max(0, Math.min(255, Math.round(b))))}`;
}

function mix(c1: string, c2: string, ratio: number) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex(
    a.r * (1 - ratio) + b.r * ratio,
    a.g * (1 - ratio) + b.g * ratio,
    a.b * (1 - ratio) + b.b * ratio
  );
}

function buildTheme(palette: PaletteBase, dark: boolean): AppTheme {
  const bg = dark ? mix(palette.background, '#0f1013', 0.75) : palette.background;
  const surface = dark ? mix(palette.surface, '#12141a', 0.78) : palette.surface;
  const onSurface = dark ? mix(palette.text_primary, '#FFFFFF', 0.6) : palette.text_primary;
  const outline = dark ? mix(palette.border, '#6f7380', 0.45) : palette.border;

  return {
    colors: {
      primary: dark ? mix(palette.primary, '#9FA8FF', 0.35) : palette.primary,
      onPrimary: dark ? '#1f2230' : palette.text_primary,
      primaryContainer: dark ? mix(palette.primary, '#2b2f3c', 0.55) : mix(palette.primary, '#FFFFFF', 0.35),
      onPrimaryContainer: dark ? '#F3F4FF' : palette.text_primary,
      primaryFixed: mix(palette.primary, '#FFFFFF', 0.4),
      primaryFixedDim: palette.primary,
      onPrimaryFixed: palette.text_primary,
      onPrimaryFixedVariant: palette.text_secondary,
      secondary: dark ? mix(palette.secondary, '#A8B7CC', 0.35) : palette.secondary,
      onSecondary: dark ? '#1f2230' : palette.text_primary,
      secondaryContainer: dark ? mix(palette.secondary, '#2b2f3c', 0.55) : mix(palette.secondary, '#FFFFFF', 0.3),
      onSecondaryContainer: dark ? '#EBF1FF' : palette.text_primary,
      secondaryFixed: mix(palette.secondary, '#FFFFFF', 0.35),
      secondaryFixedDim: palette.secondary,
      onSecondaryFixed: palette.text_primary,
      onSecondaryFixedVariant: palette.text_secondary,
      tertiary: dark ? mix(palette.accent, '#96B6D4', 0.25) : palette.accent,
      onTertiary: dark ? '#1f2230' : palette.text_primary,
      tertiaryContainer: dark ? mix(palette.accent, '#2b2f3c', 0.6) : mix(palette.accent, '#FFFFFF', 0.4),
      onTertiaryContainer: dark ? '#EAF4FF' : palette.text_primary,
      tertiaryFixed: mix(palette.accent, '#FFFFFF', 0.3),
      tertiaryFixedDim: palette.accent,
      onTertiaryFixed: palette.text_primary,
      onTertiaryFixedVariant: palette.text_secondary,
      error: dark ? '#ffb4ab' : '#ba1a1a',
      onError: dark ? '#690005' : '#ffffff',
      errorContainer: dark ? '#93000a' : '#ffdad6',
      onErrorContainer: dark ? '#ffdad6' : '#93000a',
      background: bg,
      onBackground: onSurface,
      surface,
      onSurface,
      surfaceVariant: dark ? mix(surface, '#2a2d35', 0.65) : mix(surface, '#F3F2F7', 0.85),
      onSurfaceVariant: dark ? mix(palette.text_secondary, '#E4E6EE', 0.35) : palette.text_secondary,
      outline,
      outlineVariant: dark ? mix(outline, '#343743', 0.6) : mix(outline, '#FFFFFF', 0.45),
      surfaceContainerLowest: dark ? mix(surface, '#0D0E12', 0.7) : '#FFFFFF',
      surfaceContainerLow: dark ? mix(surface, '#161922', 0.65) : mix(surface, '#F9FAFF', 0.8),
      surfaceContainer: dark ? mix(surface, '#1B1E28', 0.62) : mix(surface, '#F7F8FF', 0.7),
      surfaceContainerHigh: dark ? mix(surface, '#222632', 0.58) : mix(surface, '#F3F5FF', 0.58),
      surfaceContainerHighest: dark ? mix(surface, '#2A2E3A', 0.55) : mix(surface, '#EEF1FF', 0.5),
      surfaceBright: dark ? mix(surface, '#3A3F4D', 0.35) : surface,
      surfaceDim: dark ? mix(surface, '#0E1015', 0.7) : mix(surface, '#EEEFF6', 0.6),
      surfaceTint: palette.primary,
      inverseSurface: dark ? '#eceef6' : '#2d3038',
      inverseOnSurface: dark ? '#2d3038' : '#eff0fa',
      inversePrimary: dark ? palette.primary : mix(palette.primary, '#9AA7FF', 0.25),
    },
    ...sharedTokens,
  };
}

export function getTheme(mode: Exclude<ThemeMode, 'system'>, palette: ThemePaletteName): AppTheme {
  return buildTheme(pastelPalettes[palette], mode === 'dark');
}

export const lightTheme = getTheme('light', 'pastel_mix_cute');
export const darkTheme = getTheme('dark', 'pastel_mix_cute');
export const theme = lightTheme;
