import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { useAutoSync } from './src/hooks/useAutoSync';

export default function App() {
  useAutoSync();

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
