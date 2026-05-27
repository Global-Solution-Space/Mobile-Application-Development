import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';

export function HomeScreen() {
    return (
        <View style={styles.container}>
            <Header title="Dashboard" />
            
            <View style={styles.content}>
                <Text style={styles.title}>HomeScreen</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#04100B' 
    },
    content: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    title: { 
        color: '#10B981', 
        fontSize: 20, 
        fontWeight: 'bold' 
    }
});