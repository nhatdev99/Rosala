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
    primary: '#005bbf',
    onPrimary: '#ffffff',
    primaryContainer: '#1a73e8',
    onPrimaryContainer: '#ffffff',
    primaryFixed: '#d8e2ff',
    primaryFixedDim: '#adc7ff',
    onPrimaryFixed: '#001a41',
    onPrimaryFixedVariant: '#004493',
    secondary: '#475e8c',
    onSecondary: '#ffffff',
    secondaryContainer: '#b2c9fe',
    onSecondaryContainer: '#3d5481',
    secondaryFixed: '#d8e2ff',
    secondaryFixedDim: '#afc7fb',
    onSecondaryFixed: '#001a41',
    onSecondaryFixedVariant: '#2e4673',
    tertiary: '#1a6c23',
    onTertiary: '#ffffff',
    tertiaryContainer: '#37863a',
    onTertiaryContainer: '#ffffff',
    tertiaryFixed: '#a3f69c',
    tertiaryFixedDim: '#88d982',
    onTertiaryFixed: '#002204',
    onTertiaryFixedVariant: '#005312',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#93000a',
    background: '#f9f9ff',
    onBackground: '#191c23',
    surface: '#f9f9ff',
    onSurface: '#191c23',
    surfaceVariant: '#e0e2ec',
    onSurfaceVariant: '#414754',
    outline: '#727785',
    outlineVariant: '#c1c6d6',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f2f3fd',
    surfaceContainer: '#ecedf7',
    surfaceContainerHigh: '#e6e8f2',
    surfaceContainerHighest: '#e0e2ec',
    surfaceBright: '#f9f9ff',
    surfaceDim: '#d8d9e3',
    surfaceTint: '#005bc0',
    inverseSurface: '#2d3038',
    inverseOnSurface: '#eff0fa',
    inversePrimary: '#adc7ff',
  },
  ...sharedTokens,
};

export const darkTheme: AppTheme = {
  colors: {
    primary: '#adc7ff',
    onPrimary: '#002f67',
    primaryContainer: '#004493',
    onPrimaryContainer: '#d8e2ff',
    primaryFixed: '#d8e2ff',
    primaryFixedDim: '#adc7ff',
    onPrimaryFixed: '#001a41',
    onPrimaryFixedVariant: '#004493',
    secondary: '#afc7fb',
    onSecondary: '#19305d',
    secondaryContainer: '#2e4673',
    onSecondaryContainer: '#d8e2ff',
    secondaryFixed: '#d8e2ff',
    secondaryFixedDim: '#afc7fb',
    onSecondaryFixed: '#001a41',
    onSecondaryFixedVariant: '#2e4673',
    tertiary: '#88d982',
    onTertiary: '#00390a',
    tertiaryContainer: '#005312',
    onTertiaryContainer: '#a3f69c',
    tertiaryFixed: '#a3f69c',
    tertiaryFixedDim: '#88d982',
    onTertiaryFixed: '#002204',
    onTertiaryFixedVariant: '#005312',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    background: '#111318',
    onBackground: '#e1e2ec',
    surface: '#111318',
    onSurface: '#e1e2ec',
    surfaceVariant: '#414754',
    onSurfaceVariant: '#c1c6d6',
    outline: '#8b90a0',
    outlineVariant: '#414754',
    surfaceContainerLowest: '#0c0e13',
    surfaceContainerLow: '#191c23',
    surfaceContainer: '#1d2027',
    surfaceContainerHigh: '#282b33',
    surfaceContainerHighest: '#33363e',
    surfaceBright: '#373a42',
    surfaceDim: '#111318',
    surfaceTint: '#adc7ff',
    inverseSurface: '#e1e2ec',
    inverseOnSurface: '#2d3038',
    inversePrimary: '#005bbf',
  },
  ...sharedTokens,
};

export function getTheme(mode: Exclude<ThemeMode, 'system'>): AppTheme {
  return mode === 'dark' ? darkTheme : lightTheme;
}

// Backward-compatible export for existing screens
export const theme = lightTheme;
