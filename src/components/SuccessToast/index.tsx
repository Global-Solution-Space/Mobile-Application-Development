// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente SuccessToast
// Feedback visual temporário de sucesso
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface SuccessToastProps {
  message: string;
  visible: boolean;
}

export function SuccessToast({ message, visible }: SuccessToastProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <FontAwesome5 name="check-circle" size={16} color={Colors.success} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.successBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  text: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
    flex: 1,
  },
});
