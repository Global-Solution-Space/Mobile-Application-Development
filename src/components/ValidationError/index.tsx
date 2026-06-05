// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente de Erro de Validação Inline
// ═══════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface ValidationErrorProps {
  message: string;
  onClear?: () => void;
  timeout?: number;
}

export function ValidationError({ message, onClear, timeout = 5000 }: ValidationErrorProps) {
  // Efeito para auto-expirar o erro após os segundos definidos
  useEffect(() => {
    if (message && onClear) {
      const timer = setTimeout(() => {
        onClear();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [message, onClear, timeout]);

  if (!message) return null;

  return (
    <View style={styles.container}>
      <FontAwesome5 name="exclamation-triangle" size={13} color={Colors.danger} />
      <Text style={styles.text}>{message}</Text>
      {onClear && (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <FontAwesome5 name="times" size={14} color={Colors.danger} style={{ opacity: 0.7 }} />
        </TouchableOpacity>
      )}
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
