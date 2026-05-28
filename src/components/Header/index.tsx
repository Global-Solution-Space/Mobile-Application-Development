import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type HeaderProps = { title?: string; };

const APP_NAME = "Terra Nova";

export function Header({ title }: HeaderProps) {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 20 : 0) + 10 }]}>
            <View style={styles.brandContainer}>
                <FontAwesome5 name="seedling" size={20} color="#10B981" />
                <Text style={styles.brandText}>{APP_NAME}</Text>
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
        paddingBottom: 18,
        backgroundColor: "#0A1F16",
        borderBottomWidth: 1,
        borderBottomColor: "#11422B",
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
        color: "#F8FAFC", 
        fontWeight: "bold",
        letterSpacing: 1.5 
    },
    pageTitle: {
        fontSize: 15,
        color: "#94A3B8", 
        fontWeight: "600",
    }
});