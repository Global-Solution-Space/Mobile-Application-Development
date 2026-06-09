// ═══════════════════════════════════════════════════════════════
// Terra Nova — App Entry Point
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Colors } from './src/theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStack from './src/routes/MainStack';
import { useAppStateSync } from './src/hooks/useAppStateSync';

LogBox.ignoreAllLogs();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.accent,
    background: Colors.bgPrimary,
    card: Colors.bgSecondary,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.danger,
  },
};

export default function App() {
  // Sincroniza dados automaticamente quando o App volta a ficar ativo
  useAppStateSync();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0A1F16" />
      <NavigationContainer theme={DarkTheme}>
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}