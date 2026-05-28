// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente PrimaryButton
// Botão de ação principal com ícone e estado de loading
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function PrimaryButton({ title, onPress, icon, isLoading, disabled }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.bgPrimary} size="small" />
      ) : (
        <>
          {icon ? <FontAwesome5 name={icon} size={16} color={Colors.bgPrimary} /> : null}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 52,
    gap: 10,
    marginTop: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.bgPrimary,
  },
});
