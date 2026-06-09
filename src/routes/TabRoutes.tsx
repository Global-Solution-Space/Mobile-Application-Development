import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { TalhoesScreen } from '../screens/Talhoes/TalhoesScreen';
import { AnaliseScreen } from '../screens/Analise/AnaliseScreen';
import { PerfilScreen } from '../screens/Perfil/PerfilScreen';

const Tab = createBottomTabNavigator();

export function TabRoutes() {
  return (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false, 
            tabBarStyle: {
                backgroundColor: Colors.bgPrimary, 
                borderTopWidth: 1,
                borderTopColor: Colors.border,
                height: 60, 
            },
            tabBarActiveTintColor: Colors.accent, 
            tabBarInactiveTintColor: Colors.textMuted,
        }}
    >
        <Tab.Screen 
            name="Dashboard" 
            component={HomeScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} /> }} 
        />
        <Tab.Screen 
            name="Talhões" 
            component={TalhoesScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="th-large" size={24} color={color} /> }} 
        />
        <Tab.Screen 
            name="Analise" 
            component={AnaliseScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="chart-bar" size={24} color={color} /> }} 
        />
        <Tab.Screen 
            name="Perfil" 
            component={PerfilScreen} 
            options={{ tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={24} color={color} /> }} 
        />
    </Tab.Navigator>
  );
}