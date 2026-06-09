import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

export type HeaderProps = { 
    title?: string; 
    showBackButton?: boolean; 
    rightComponent?: ReactNode; 
};

const APP_NAME = "Terra Nova";

export function Header({ title, showBackButton, rightComponent }: HeaderProps) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const paddingTop = Platform.OS === 'android' 
        ? Math.max(insets.top, StatusBar.currentHeight || 24) + 12
        : Math.max(insets.top, 20) + 10;
    
    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.brandContainer}>
                {showBackButton && (
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.backBtn}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        activeOpacity={0.7}
                    >
                        <FontAwesome5 name="arrow-left" size={18} color={Colors.accent} />
                    </TouchableOpacity>
                )}
                <FontAwesome5 name="seedling" size={20} color={Colors.accent} />
                <Text style={styles.brandText} numberOfLines={1}>{APP_NAME}</Text>
            </View>
            
            <View style={styles.rightContainer}>
                {title ? <Text style={styles.pageTitle} numberOfLines={1}>{title}</Text> : null}
                {rightComponent}
            </View>
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
        backgroundColor: Colors.bgPrimary,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        elevation: 6,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        zIndex: 100,
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    backBtn: {
        marginRight: 8, 
        paddingVertical: 4, 
        paddingHorizontal: 2 
    },
    brandText: {
        fontSize: 18,
        color: Colors.textPrimary, 
        fontWeight: "bold",
        letterSpacing: 1.5,
        flexShrink: 1,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        flexShrink: 1,
    },
    pageTitle: {
        fontSize: 15,
        color: Colors.textSecondary, 
        fontWeight: "600",
        flexShrink: 1,
    }
});