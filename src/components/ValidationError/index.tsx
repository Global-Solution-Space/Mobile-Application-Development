// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente de Erro de Validação Inline
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface ValidationErrorProps {
  message: string | null | undefined;
  onClear?: () => void;
  timeout?: number;
}

export function ValidationError({ message, onClear, timeout = 5000 }: ValidationErrorProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  // Efeito de Entrada Suave (Fade-In) e Auto-Expiração (Fade-Out)
  useEffect(() => {
    if (message) {
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (onClear) {
        const timer = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClear());
        }, timeout);
        return () => clearTimeout(timer);
      }
    }
  }, [message, onClear, timeout]);

  if (!message) return null;

  return (
    <Animated.View 
      style={[styles.container, { opacity }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <FontAwesome5 name="exclamation-triangle" size={13} color={Colors.danger} />
      <Text style={styles.text}>{message}</Text>
      {onClear && (
        <TouchableOpacity 
          onPress={() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => onClear());
          }} 
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Fechar aviso de erro"
        >
          <FontAwesome5 name="times" size={14} color={Colors.danger} style={{ opacity: 0.7 }} />
        </TouchableOpacity>
      )}
    </Animated.View>
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
