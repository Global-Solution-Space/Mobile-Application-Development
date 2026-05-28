// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente StatusBadge
// Pílula de status com dot colorido (Saudável, Crítico, etc)
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

type Variant = 'success' | 'warning' | 'danger' | 'info';

const variantColors: Record<Variant, string> = {
  success: Colors.success,
  warning: Colors.warning,
  danger: Colors.danger,
  info: Colors.info,
};

interface StatusBadgeProps {
  label: string;
  variant: Variant;
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  const color = variantColors[variant];

  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
