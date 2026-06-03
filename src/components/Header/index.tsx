import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export type HeaderProps = { title?: string; showBackButton?: boolean; };

const APP_NAME = "Terra Nova";

export function Header({ title, showBackButton }: HeaderProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    
    const paddingTop = Platform.OS === 'android' 
        ? Math.max(insets.top, StatusBar.currentHeight || 24) + 12
        : Math.max(insets.top, 20) + 10;
    
    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.brandContainer}>
                {showBackButton && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, paddingVertical: 4, paddingHorizontal: 2 }}>
                        <FontAwesome5 name="arrow-left" size={16} color="#10B981" />
                    </TouchableOpacity>
                )}
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