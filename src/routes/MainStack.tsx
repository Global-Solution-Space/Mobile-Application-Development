import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabRoutes } from './TabRoutes'; 
import { EditarPerfilScreen } from '../screens/Perfil/EditarPerfilScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabRoutes} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
    </Stack.Navigator>
  );
}