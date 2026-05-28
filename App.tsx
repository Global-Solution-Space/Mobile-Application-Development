// ═══════════════════════════════════════════════════════════════
// Terra Nova — App Entry Point
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStack from './src/routes/MainStack';

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#10B981',
    background: '#04100B',
    card: '#0A1F16',
    text: '#F8FAFC',
    border: '#11422B',
    notification: '#EF4444',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0A1F16" />
      <NavigationContainer theme={DarkTheme}>
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}