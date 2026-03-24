import { ThemeMode } from '../store/useThemeStore';

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

export const lightTheme: AppTheme = {
  colors: {
    primary: '#7a8cff',
    onPrimary: '#ffffff',
    primaryContainer: '#cfd5ff',
    onPrimaryContainer: '#ffffff',
    primaryFixed: '#d8e2ff',
    primaryFixedDim: '#adc7ff',
    onPrimaryFixed: '#001a41',
    onPrimaryFixedVariant: '#004493',
    secondary: '#8f86d8',
    onSecondary: '#ffffff',
    secondaryContainer: '#e1dcff',
    onSecondaryContainer: '#3d5481',
    secondaryFixed: '#d8e2ff',
    secondaryFixedDim: '#afc7fb',
    onSecondaryFixed: '#001a41',
    onSecondaryFixedVariant: '#2e4673',
    tertiary: '#5da989',
    onTertiary: '#ffffff',
    tertiaryContainer: '#d2f3e7',
    onTertiaryContainer: '#ffffff',
    tertiaryFixed: '#a3f69c',
    tertiaryFixedDim: '#88d982',
    onTertiaryFixed: '#002204',
    onTertiaryFixedVariant: '#005312',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#93000a',
    background: '#fff9fc',
    onBackground: '#191c23',
    surface: '#fff9fc',
    onSurface: '#191c23',
    surfaceVariant: '#f1e9f5',
    onSurfaceVariant: '#414754',
    outline: '#9b93a8',
    outlineVariant: '#e4ddea',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#fdf2fa',
    surfaceContainer: '#faeef8',
    surfaceContainerHigh: '#f6e9f4',
    surfaceContainerHighest: '#f1e3ee',
    surfaceBright: '#f9f9ff',
    surfaceDim: '#d8d9e3',
    surfaceTint: '#7a8cff',
    inverseSurface: '#2d3038',
    inverseOnSurface: '#eff0fa',
    inversePrimary: '#cfd5ff',
  },
  ...sharedTokens,
};

export const darkTheme: AppTheme = {
  colors: {
    primary: '#c7ccff',
    onPrimary: '#2d2a57',
    primaryContainer: '#6c70c6',
    onPrimaryContainer: '#eef0ff',
    primaryFixed: '#d8e2ff',
    primaryFixedDim: '#adc7ff',
    onPrimaryFixed: '#001a41',
    onPrimaryFixedVariant: '#004493',
    secondary: '#d8c9ff',
    onSecondary: '#3a2d63',
    secondaryContainer: '#5d4b96',
    onSecondaryContainer: '#efe8ff',
    secondaryFixed: '#d8e2ff',
    secondaryFixedDim: '#afc7fb',
    onSecondaryFixed: '#001a41',
    onSecondaryFixedVariant: '#2e4673',
    tertiary: '#93d9bf',
    onTertiary: '#173a34',
    tertiaryContainer: '#3f7b6f',
    onTertiaryContainer: '#ddfff5',
    tertiaryFixed: '#a3f69c',
    tertiaryFixedDim: '#88d982',
    onTertiaryFixed: '#002204',
    onTertiaryFixedVariant: '#005312',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    background: '#17141f',
    onBackground: '#e1e2ec',
    surface: '#17141f',
    onSurface: '#f2edf8',
    surfaceVariant: '#3a3448',
    onSurfaceVariant: '#cdc4db',
    outline: '#9f94b0',
    outlineVariant: '#4a425b',
    surfaceContainerLowest: '#0c0e13',
    surfaceContainerLow: '#211c2d',
    surfaceContainer: '#272131',
    surfaceContainerHigh: '#30293e',
    surfaceContainerHighest: '#3a334a',
    surfaceBright: '#373a42',
    surfaceDim: '#111318',
    surfaceTint: '#c7ccff',
    inverseSurface: '#e1e2ec',
    inverseOnSurface: '#2d3038',
    inversePrimary: '#7a8cff',
  },
  ...sharedTokens,
};

export function getTheme(mode: Exclude<ThemeMode, 'system'>): AppTheme {
  return mode === 'dark' ? darkTheme : lightTheme;
}

// Backward-compatible export for existing screens
export const theme = lightTheme;
