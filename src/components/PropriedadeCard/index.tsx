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
  // Previne divisão por zero (Proteção contra Tela Vermelha: Infinity/NaN)
  const ratio = cap > 0 ? ativos / cap : 0;
  const fillPercent = Math.min(ratio * 100, 100);
  
  // Lógica inteligente de Status
  let statusColor: string = Colors.success;
  if (ratio >= 1) statusColor = Colors.danger;
  else if (ratio >= 0.8) statusColor = Colors.warning;

  return (
    <View style={styles.propCard}>
      <View style={styles.propHeader}>
        <View style={styles.propNameRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.propNome} numberOfLines={1}>{nome}</Text>
        </View>
        <View style={styles.propTypeBadge}>
          <Text style={styles.propTypeText}>{tamanhoTotal} ha</Text>
        </View>
      </View>

      <View style={styles.barContainer}>
        <View style={styles.barLabel}>
          <Text style={styles.barLabelText}>Ocupação</Text>
          <Text style={styles.barLabelValue}>{ativos}/{cap} ha</Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, {
            width: `${fillPercent}%`,
            backgroundColor: statusColor,
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
    borderRadius: 14, 
    padding: 16,
    borderWidth: 1, 
    borderColor: Colors.border,
    marginBottom: 12,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  propHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 14,
    gap: 12 
  },
  propNameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    flex: 1
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  propNome: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: Colors.textPrimary,
    flexShrink: 1
  },
  propTypeBadge: {
    backgroundColor: Colors.accentGlow, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 6,
  },
  propTypeText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },

  barContainer: { marginTop: 4 },
  barLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabelText: { fontSize: 11, color: Colors.textMuted },
  barLabelValue: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  barTrack: { height: 6, backgroundColor: Colors.white05, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 }
});
