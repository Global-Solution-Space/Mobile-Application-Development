// ═══════════════════════════════════════════════════════════════
// Terra Nova — Navegação Principal (Stack)
// Auth flow + Tab Navigator + Telas empilhadas (Estufas, Logs, etc)
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppStore } from '../store/useAppStore';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { TabRoutes } from './TabRoutes';
import { EstufasScreen } from '../screens/Estufas/EstufasScreen';
import { ColheitasScreen } from '../screens/Colheitas/ColheitasScreen';
import { LogsScreen } from '../screens/Logs/LogsScreen';
import { TarefasScreen } from '../screens/Tarefas/TarefasScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  const { isLoggedIn } = useAppStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        // ── Fluxo de Autenticação ───
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // ── Fluxo Principal ───
        <>
          <Stack.Screen name="Tabs" component={TabRoutes} />
          <Stack.Screen name="Estufas" component={EstufasScreen} />
          <Stack.Screen name="Colheitas" component={ColheitasScreen} />
          <Stack.Screen name="Logs" component={LogsScreen} />
          <Stack.Screen name="Tarefas" component={TarefasScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}