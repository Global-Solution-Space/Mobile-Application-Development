import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { TELEMETRY_CONFIGS } from '../../constants/telemetria';

interface TelemetriaHistoryCardProps {
  id: number;
  type: 'satveg' | 'nasa';
  title: string;
  subtitle: string;
  previewData: { date: string; val: number }[];
  onDelete?: () => void;
  onPressViewAll: () => void;
}

export function TelemetriaHistoryCard({
  id,
  type,
  title,
  subtitle,
  previewData,
  onDelete,
  onPressViewAll
}: TelemetriaHistoryCardProps) {
  const config = TELEMETRY_CONFIGS[type];

  // Calcula o valor máximo dinâmico para a escala da barra
  const maxVal = useMemo(() => {
    if (config.isDynamicScale && previewData && previewData.length > 0) {
      const vals = previewData.map(d => d.val);
      const max = Math.max(...vals);
      return max > 0 ? max : 1.0; // Evita divisão por 0 se todas forem 0
    }
    return 1.0; // maxVal fixo para NDVI
  }, [previewData, config.isDynamicScale]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Deletar Análise"
          >
            <FontAwesome5 name="trash" size={13} color={Colors.danger} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.dataHeading}>{config.previewHeading}</Text>

      {(!previewData || previewData.length === 0) ? (
        <Text style={styles.noDataText}>Nenhum dado temporal disponível.</Text>
      ) : (
        <View style={styles.dataContainer}>
          {previewData.map(({ date, val }) => {
            const percent = Math.min(Math.max(((val || 0) / maxVal) * 100, 0), 100);
            return (
              <View key={date} style={styles.dataRow}>
                <Text style={styles.dataDate}>{date}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { 
                    width: `${percent}%`,
                    backgroundColor: config.badgeColor
                  }]} />
                </View>

                <Text style={[styles.dataVal, { color: config.valColor, fontWeight: config.valFontWeight }]}>
                  {config.formatValue(val)}
                </Text>
              </View>
            );
          })}

          <TouchableOpacity 
            style={styles.viewAllBtn} 
            onPress={onPressViewAll} 
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.viewAllBtnText} numberOfLines={1} adjustsFontSizeToFit>Ver Análise Completa & Gráfico</Text>
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
