import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header'; // <-- Import adicionado

export function PerfilScreen() {
    return (
        <View style={styles.container}>
            <Header title="Perfil" /> {/* <-- Header adicionado no topo */}
            
            <View style={styles.content}>
                <Text style={styles.title}>Perfil do Astronauta</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#04100B' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { color: '#10B981', fontSize: 20, fontWeight: 'bold' }
});