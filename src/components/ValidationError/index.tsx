// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente de Erro de Validação Inline
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface ValidationErrorProps {
  message: string;
}

export function ValidationError({ message }: ValidationErrorProps) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <FontAwesome5 name="exclamation-triangle" size={13} color={Colors.danger} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dangerBg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.danger,
    marginTop: 12,
  },
  text: {
    color: Colors.danger,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});
