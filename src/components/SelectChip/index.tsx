// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente SelectChip
// Pílula selecionável para filtros e formulários
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface SelectChipProps {
  label: string;
  emoji?: string;
  isActive: boolean;
  onPress: () => void;
  /** Cor customizada quando ativo (por padrão usa Colors.accent) */
  activeColor?: string;
}

export function SelectChip({ label, emoji, isActive, onPress, activeColor }: SelectChipProps) {
  const color = activeColor || Colors.accent;

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isActive && { backgroundColor: color + '22', borderColor: color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.text, isActive && { color, fontWeight: '700' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  emoji: {
    fontSize: 16,
  },
  text: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
