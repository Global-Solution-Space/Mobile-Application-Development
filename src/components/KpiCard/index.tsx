import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface KpiCardProps {
  icon: ComponentProps<typeof FontAwesome5>['name'];
  color: string;
  value: number | string;
  label: string;
  onPress?: () => void;
}

export function KpiCard({ icon, color, value, label, onPress }: KpiCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 52) / 2;

  const CardContent = (
    <View style={[styles.kpiCard, { minWidth: cardWidth, borderLeftColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
        <FontAwesome5 name={icon} size={16} color={color} />
      </View>
      <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.kpiLabel} numberOfLines={1}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ flex: 1 }}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  kpiCard: {
    flex: 1, 
    backgroundColor: Colors.bgSecondary,
    borderRadius: 14, 
    padding: 16,
    borderWidth: 1, 
    borderColor: Colors.border,
    borderLeftWidth: 4,
    alignItems: 'flex-start', 
    gap: 6,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  kpiValue: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: Colors.textPrimary 
  },
  kpiLabel: { 
    fontSize: 12, 
    fontWeight: '600',
    color: Colors.textSecondary 
  },
});
