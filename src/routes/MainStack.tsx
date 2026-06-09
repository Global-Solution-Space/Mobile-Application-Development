import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppStore }        from '../store/useAppStore';
import { LoginScreen }        from '../screens/Auth/LoginScreen';
import { RegisterScreen }     from '../screens/Auth/RegisterScreen';
import { TabRoutes }          from './TabRoutes';
import { PropriedadesScreen }          from '../screens/Propriedades/PropriedadesScreen';
import { GerenciarPropriedadesScreen } from '../screens/Propriedades/GerenciarPropriedadesScreen';
import { LogsScreen }         from '../screens/Logs/LogsScreen';
import { EditarPerfilScreen } from '../screens/Perfil/EditarPerfilScreen';
import { FaqScreen }          from '../screens/Faq/FaqScreen';
import { SobreScreen }        from '../screens/Sobre/SobreScreen';
import { AlertasScreen }      from '../screens/Alertas/AlertasScreen';
import { CriarAlertaScreen }  from '../screens/Alertas/CriarAlertaScreen';
import { GerenciarTalhoesScreen }  from '../screens/Talhoes/GerenciarTalhoesScreen';
import { AnaliseDetalhesScreen } from '../screens/Analise/AnaliseDetalhesScreen';

import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  const { isLoggedIn } = useAppStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs"         component={TabRoutes} />
          <Stack.Screen name="Propriedades"           component={PropriedadesScreen} />
          <Stack.Screen name="GerenciarPropriedades"  component={GerenciarPropriedadesScreen} />
          <Stack.Screen name="Logs"         component={LogsScreen} />
          <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
          <Stack.Screen name="Faq"          component={FaqScreen} />
          <Stack.Screen name="Sobre"        component={SobreScreen} />
          <Stack.Screen name="Alertas"      component={AlertasScreen} />
          <Stack.Screen name="CriarAlerta"  component={CriarAlertaScreen} />
          <Stack.Screen name="GerenciarTalhoes"  component={GerenciarTalhoesScreen} />
          <Stack.Screen name="AnaliseDetalhes" component={AnaliseDetalhesScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}