import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

interface KpiCardProps {
  icon: string;
  color: string;
  value: number | string;
  label: string;
}

export function KpiCard({ icon, color, value, label }: KpiCardProps) {
  return (
    <View style={[styles.kpiCard, { borderLeftColor: color }]}>
      <FontAwesome5 name={icon} size={18} color={color} />
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kpiCard: {
    flex: 1, minWidth: (width - 52) / 2,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
    borderLeftWidth: 3,
    alignItems: 'center', gap: 6,
  },
  kpiValue: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  kpiLabel: { fontSize: 11, color: Colors.textSecondary },
});
