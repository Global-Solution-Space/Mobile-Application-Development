import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface PropriedadeCardProps {
  nome: string;
  tamanhoTotal: number;
  ativos: number;
  cap: number;
  children?: ReactNode;
}

export function PropriedadeCard({ nome, tamanhoTotal, ativos, cap, children }: PropriedadeCardProps) {
  return (
    <View style={styles.propCard}>
      <View style={styles.propHeader}>
        <View style={styles.propNameRow}>
          <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.propNome}>{nome}</Text>
        </View>
        <View style={styles.propTypeBadge}>
          <Text style={styles.propTypeText}>{tamanhoTotal} ha</Text>
        </View>
      </View>

      <View style={styles.barContainer}>
        <View style={styles.barLabel}>
          <Text style={styles.barLabelText}>Ocupação</Text>
          <Text style={styles.barLabelValue}>{ativos}/{cap}</Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, {
            width: `${Math.min((ativos / cap) * 100, 100)}%`,
            backgroundColor: ativos / cap > 0.8 ? Colors.warning : Colors.accent,
          }]} />
        </View>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  propCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 12,
  },
  propHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  propNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  propNome: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  propTypeBadge: {
    backgroundColor: Colors.accentGlow, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  propTypeText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },

  barContainer: { marginTop: 4 },
  barLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabelText: { fontSize: 11, color: Colors.textMuted },
  barLabelValue: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  barTrack: { height: 6, backgroundColor: Colors.white05, borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 }
});
