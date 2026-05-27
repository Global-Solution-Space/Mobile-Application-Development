import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

// Importamos as telas aqui para dentro das abas
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
            tabBarShowLabel: false, // <-- A mágica que esconde os textos
            tabBarStyle: {
                backgroundColor: '#0A1F16', // Verde escuro Sidonia
                borderTopWidth: 1,
                borderTopColor: '#11422B',
                height: 60, // Altura reduzida para ficar elegante
                // O React Navigation já centraliza os ícones automaticamente quando tiramos o texto!
            },
            tabBarActiveTintColor: '#10B981', // Verde neon quando ativo
            tabBarInactiveTintColor: '#64748B', // Cinza apagado quando inativo
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
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="user-astronaut" size={24} color={color} /> }} 
        />
    </Tab.Navigator>
  );
}