// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente EmptyState
// Placeholder visual para FlatLists vazias
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <FontAwesome5 name={icon} size={40} color={Colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
