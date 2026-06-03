import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface TelemetriaHistoryCardProps {
  id: number;
  type: 'satveg' | 'nasa';
  title: string;
  subtitle: string;
  dados: Record<string, number>;
  onDelete?: () => void;
  onPressViewAll: () => void;
}

const CARD_CONFIG = {
  nasa: {
    heading: 'Dados de Precipitação (preview):',
    showProgress: false,
    formatValue: (val: number) => `${(val || 0).toFixed(1)} mm`,
    valColor: Colors.info,
    fontWeight: 'bold' as const,
  },
  satveg: {
    heading: 'Índice de Vegetação NDVI (preview):',
    showProgress: true,
    formatValue: (val: number) => (val || 0).toFixed(3),
    valColor: Colors.textPrimary,
    fontWeight: 'normal' as const,
  }
};

export function TelemetriaHistoryCard({
  id,
  type,
  title,
  subtitle,
  dados,
  onDelete,
  onPressViewAll
}: TelemetriaHistoryCardProps) {
  const sortedEntries = Object.entries(dados || {})
    .map(([date, val]) => ({ date, val: Number(val) }))
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  const previewData = sortedEntries.slice(0, 5);
  const config = CARD_CONFIG[type];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="trash" size={13} color={Colors.danger} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.dataHeading}>{config.heading}</Text>

      {sortedEntries.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum dado temporal disponível.</Text>
      ) : (
        <View style={styles.dataContainer}>
          {previewData.map(({ date, val }) => (
            <View key={date} style={styles.dataRow}>
              <Text style={styles.dataDate}>{date}</Text>
              
              {config.showProgress ? (
                // Progress bar for NDVI (0 to 1)
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${Math.min(Math.max((val || 0) * 100, 0), 100)}%` }]} />
                </View>
              ) : (
                <View style={styles.flexSpacer} />
              )}

              <Text style={[styles.dataVal, { color: config.valColor, fontWeight: config.fontWeight }]}>
                {config.formatValue(val)}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.viewAllBtn} onPress={onPressViewAll} activeOpacity={0.8}>
            <Text style={styles.viewAllBtnText}>Ver Análise Completa & Gráfico</Text>
            <FontAwesome5 name="chart-bar" size={12} color={Colors.accent} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 10,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: Colors.dangerBg,
    marginLeft: 12,
  },
  dataHeading: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  dataContainer: {
    gap: 8,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    width: 85,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgTertiary,
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  flexSpacer: {
    flex: 1,
  },
  dataVal: {
    fontSize: 11,
    textAlign: 'right',
    width: 55,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.bgTertiary,
  },
  viewAllBtnText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '700',
  },
});
