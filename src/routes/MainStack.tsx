import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppStore }        from '../store/useAppStore';
import { LoginScreen }        from '../screens/Auth/LoginScreen';
import { RegisterScreen }     from '../screens/Auth/RegisterScreen';
import { TabRoutes }          from './TabRoutes';
import { EstufasScreen }      from '../screens/Estufas/EstufasScreen';
import { ColheitasScreen }    from '../screens/Colheitas/ColheitasScreen';
import { LogsScreen }         from '../screens/Logs/LogsScreen';
import { TarefasScreen }      from '../screens/Tarefas/TarefasScreen';
import { EditarPerfilScreen } from '../screens/Perfil/EditarPerfilScreen';
import { FaqScreen }          from '../screens/Faq/FaqScreen';
import { SobreScreen }        from '../screens/Sobre/SobreScreen';
import { AlertasScreen } from '../screens/Alertas/AlertasScreen';
import { SuporteScreen } from '../screens/Suporte/SuporteScreen';

const Stack = createNativeStackNavigator<any>();

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
          <Stack.Screen name="Estufas"      component={EstufasScreen} />
          <Stack.Screen name="Colheitas"    component={ColheitasScreen} />
          <Stack.Screen name="Logs"         component={LogsScreen} />
          <Stack.Screen name="Tarefas"      component={TarefasScreen} />
          <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
          <Stack.Screen name="Faq"          component={FaqScreen} />
          <Stack.Screen name="Sobre"        component={SobreScreen} />
          <Stack.Screen name="Alertas" component={AlertasScreen} />
          <Stack.Screen name="Suporte" component={SuporteScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}