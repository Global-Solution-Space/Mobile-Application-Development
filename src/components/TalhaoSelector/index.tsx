import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Talhao } from '../../types';

interface TalhaoSelectorProps {
  talhoes: Talhao[];
  selectedTalhaoId: number | null;
  onSelect: (id: number) => void;
}

export function TalhaoSelector({ talhoes, selectedTalhaoId, onSelect }: TalhaoSelectorProps) {
  return (
    <View style={styles.talhaoSelectorContainer}>
      <Text style={styles.selectorLabel}>Selecione o Talhão para Análise:</Text>
      {talhoes.length === 0 ? (
        <Text style={styles.noTalhaoText}>Nenhum talhão cadastrado no sistema.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {talhoes.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.talhaoChip,
                selectedTalhaoId === t.id && styles.talhaoChipActive
              ]}
              onPress={() => onSelect(t.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipEmoji}>🌱</Text>
              <Text
                style={[
                  styles.talhaoChipText,
                  selectedTalhaoId === t.id && styles.talhaoChipTextActive
                ]}
              >
                {t.nomeTalhao}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  talhaoSelectorContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgSecondary,
  },
  selectorLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  noTalhaoText: {
    fontSize: 13,
    color: Colors.danger,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  selectorScroll: {
    flexDirection: 'row',
  },
  talhaoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  talhaoChipActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent,
  },
  chipEmoji: {
    marginRight: 6,
    fontSize: 14,
  },
  talhaoChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  talhaoChipTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
});
