export const theme = {
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
  typography: {
    headline: 'Manrope',  // Can be configured with custom fonts via expo-font later
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
    sm: 2, // 0.125rem
    md: 4, // 0.25rem
    lg: 6,
    xl: 8, // 0.5rem
    full: 9999, // 0.75rem doesn't usually make perfect circles in RN, using big number for full round
  }
};
