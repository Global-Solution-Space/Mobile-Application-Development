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
  activeColor?: string;
}

export function SelectChip({ label, emoji, isActive, onPress, activeColor }: SelectChipProps) {
  const color = activeColor || Colors.accent;

  return (
    <TouchableOpacity style={[styles.chip, isActive && { backgroundColor: `${color}22`, borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.text, isActive && { color, fontWeight: '700' }]} numberOfLines={1}>
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
    flexShrink: 1,
  },
  emoji: {
    fontSize: 14,
  },
  text: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    flexShrink: 1,
  },
});
