import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { AlertaAgricola } from '../../types';

interface AlertCardProps {
  alerta: AlertaAgricola;
  onResolve: (id: number) => void;
}

const getSeverityConfig = (nivel: string) => {
  switch (nivel) {
    case 'BAIXO': return { color: Colors.info, bg: Colors.infoBg, icon: 'info-circle' };
    case 'MEDIO': return { color: Colors.warning, bg: Colors.warningBg, icon: 'exclamation-circle' };
    case 'ALTO': return { color: Colors.danger, bg: Colors.dangerBg, icon: 'exclamation-triangle' };
    case 'CRITICO': return { color: Colors.critical, bg: Colors.criticalBg, icon: 'biohazard' };
    default: return { color: Colors.textSecondary, bg: Colors.bgTertiary, icon: 'bell' };
  }
};

export function AlertCard({ alerta, onResolve }: AlertCardProps) {
  const config = getSeverityConfig(alerta.nivelAlerta);
  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.color }]}>
      <View style={styles.header}>
        <FontAwesome5 name={config.icon} size={20} color={config.color} />
        <Text style={[styles.title, { color: config.color }]}>{alerta.titulo}</Text>
      </View>

      <Text style={styles.desc}>{alerta.descricao}</Text>

      <View style={styles.meta}>
        <View style={[styles.badge, { backgroundColor: config.bg }]}>
          <Text style={[styles.badgeText, { color: config.color }]}>{alerta.nivelAlerta}</Text>
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
  card: { borderRadius: 14, padding: 18, borderWidth: 1, marginBottom: 20, },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '700', flex: 1 },
  desc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent, borderRadius: 10, height: 42, gap: 8, },
  resolveBtnText: { fontSize: 14, fontWeight: '700', color: Colors.bgPrimary },
});
