// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente FormInput
// Input estilizado com ícone lateral (padrão do Design System)
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface FormInputProps extends TextInputProps {
  iconName?: string;
  label?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export function FormInput({ iconName, label, rightIcon, onRightIconPress, style, ...rest }: FormInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.container}>
        {iconName ? (
          <FontAwesome5 name={iconName} size={16} color={Colors.textMuted} style={styles.icon} />
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          {...rest}
        />
        {rightIcon && onRightIconPress ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightBtn}>
            <FontAwesome5 name={rightIcon} size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 52,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  rightBtn: {
    padding: 8,
  },
});
