import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { AlertaAgricola } from '../../types';

interface AlertCardProps {
  alerta: AlertaAgricola;
  onResolve: (id: number) => void;
}

export function AlertCard({ alerta, onResolve }: AlertCardProps) {
  return (
    <View style={styles.criticalCard}>
      <View style={styles.criticalHeader}>
        <FontAwesome5 name="exclamation-triangle" size={20} color={Colors.danger} />
        <Text style={styles.criticalTitle}>{alerta.titulo}</Text>
      </View>
      <Text style={styles.criticalDesc}>{alerta.descricao}</Text>
      <View style={styles.criticalMeta}>
        <View style={[styles.severityBadge, styles.severityCritical]}>
          <Text style={styles.severityText}>{alerta.nivelAlerta}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.resolveBtn} onPress={() => onResolve(alerta.id)} activeOpacity={0.8}>
        <FontAwesome5 name="check-circle" size={14} color={Colors.bgPrimary} />
        <Text style={styles.resolveBtnText}>Resolver Evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  criticalCard: {
    backgroundColor: Colors.criticalBg,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.danger,
    marginBottom: 20,
  },
  criticalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  criticalTitle: { fontSize: 16, fontWeight: '700', color: Colors.danger, flex: 1 },
  criticalDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  criticalMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  severityBadge: { backgroundColor: Colors.warningBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  severityCritical: { backgroundColor: Colors.dangerBg },
  severityText: { fontSize: 11, fontWeight: '700', color: Colors.warning },
  resolveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: 10, height: 42, gap: 8,
  },
  resolveBtnText: { fontSize: 14, fontWeight: '700', color: Colors.bgPrimary },
});
