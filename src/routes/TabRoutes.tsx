import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { LotesScreen } from '../screens/Lotes/LotesScreen';
import { CadastroScreen } from '../screens/Cadastro/CadastroScreen';
import { EstoqueScreen } from '../screens/Estoque/EstoqueScreen';
import { PerfilScreen } from '../screens/Perfil/PerfilScreen';

const Tab = createBottomTabNavigator();

export function TabRoutes() {
  return (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false, 
            tabBarStyle: {
                backgroundColor: '#0A1F16', 
                borderTopWidth: 1,
                borderTopColor: '#11422B',
                height: 60, 
            },
            tabBarActiveTintColor: '#10B981', 
            tabBarInactiveTintColor: '#64748B',
        }}
    >
        <Tab.Screen 
            name="Dashboard" 
            component={HomeScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} /> }} 
        />
        <Tab.Screen 
            name="Lotes" 
            component={LotesScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="th-large" size={24} color={color} /> }} 
        />
        <Tab.Screen 
            name="Cadastrar" 
            component={CadastroScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="plus-circle" size={28} color={color} /> }} 
        />
        <Tab.Screen 
            name="Estoque" 
            component={EstoqueScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="boxes" size={24} color={color} /> }} 
        />
        <Tab.Screen 
            name="Perfil" 
            component={PerfilScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={24} color={color} /> }} 
        />
    </Tab.Navigator>
  );
}