import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export type HeaderProps = { title?: string; };

export function Header({ title }: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.brandContainer}>
                <FontAwesome5 name="seedling" size={20} color="#10B981" />
                <Text style={styles.brandText}>SIDONIA</Text>
            </View>
            <Text style={styles.pageTitle}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        // O paddingTop dinâmico evita que o header fique escondido atrás do relógio/bateria do celular
        paddingTop: Platform.OS === 'android' ? 40 : 20, 
        paddingBottom: 18,
        backgroundColor: "#0A1F16", // Verde floresta bem escuro
        borderBottomWidth: 1,
        borderBottomColor: "#11422B", // Linha verde sutil para separar do resto da tela
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    brandText: {
        fontSize: 18,
        color: "#F8FAFC", // Branco gelo para dar contraste
        fontWeight: "bold",
        letterSpacing: 1.5 // Deixa o texto com um ar mais tecnológico
    },
    pageTitle: {
        fontSize: 15,
        color: "#94A3B8", 
        fontWeight: "600",
    }
});