import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header'; // <-- Importar o Header

export function LotesScreen() {
    return (
        <View style={styles.container}>
            <Header title="Lotes" /> {/* <-- Adicionar o Header com o título da página */}
            
            <View style={styles.content}>
                <Text style={styles.title}>Monitoramento de Lotes</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#04100B' }, // Fundo verde escuro preenche tudo
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { color: '#10B981', fontSize: 20, fontWeight: 'bold' }
});