// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente PrimaryButton
// Botão de ação principal com ícone e estado de loading
// ═══════════════════════════════════════════════════════════════

import React, { ComponentProps } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

type ButtonVariant = 'primary' | 'outline' | 'danger';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: ComponentProps<typeof FontAwesome5>['name'];
  isLoading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: Colors.accent, text: Colors.bgPrimary },
  outline:  { bg: 'transparent', text: Colors.textSecondary, border: Colors.border },
  danger:   { bg: Colors.dangerBg, text: Colors.danger, border: Colors.danger },
};

export function PrimaryButton({ title, onPress, icon, isLoading, disabled, variant = 'primary' }: PrimaryButtonProps) {
  const v = VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : undefined,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <>
          {icon ? <FontAwesome5 name={icon} size={14} color={v.text} /> : null}
          <Text style={[styles.text, { color: v.text }]}>{title}</Text>
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
  },
});
