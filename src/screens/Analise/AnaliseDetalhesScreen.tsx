// ═══════════════════════════════════════════════════════════════
// Terra Nova — Detalhes da Telemetria e Visualização Gráfica
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface AnaliseDetalhesScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AnaliseDetalhes'>;
  route: RouteProp<RootStackParamList, 'AnaliseDetalhes'>;
}

interface DataEntry {
  date: string;
  val: number;
}

export function AnaliseDetalhesScreen({ route }: AnaliseDetalhesScreenProps) {
  const { type, id, title, subtitle, dados } = route.params || {};
  
  const isNasa = type === 'nasa';
  // Memoiza os cálculos pesados matemáticos e extração do maxVal
  const { dataEntries, tableEntries, chartMax } = useMemo(() => {
    const typed: Record<string, number> = dados || {};
    const entries = Object.entries(typed)
      .map(([date, val]) => ({ date, val: Number(val) }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Ordem cronológica
      
    const tEntries = [...entries].reverse(); // Mais novos primeiro na tabela
    
    const values = entries.map(d => d.val);
    const maxVal = values.length > 0 ? Math.max(...values) : 1;
    const cMax = isNasa ? Math.max(maxVal * 1.1, 10) : 1.0;
    
    return { dataEntries: entries, tableEntries: tEntries, chartMax: cMax };
  }, [dados, isNasa]);

  const renderChartBar = useCallback(({ item }: { item: DataEntry }) => {
    const percent = Math.min((item.val / chartMax) * 100, 100);

    return (
      <View style={styles.barColumn}>
        <View style={styles.barWrapper}>
          <View
            style={[
              styles.barFill,
              { height: `${percent}%` },
              isNasa ? styles.barFillNasa : styles.barFillSatveg
            ]}
          />
        </View>
        <Text style={styles.barLabel}>
          {item.date.substring(8, 10)}/{item.date.substring(5, 7)}
        </Text>
      </View>
    );
  }, [chartMax, isNasa]);

  const renderTableRow = useCallback(({ item, index }: { item: DataEntry; index: number }) => {
    const isLast = index === tableEntries.length - 1;
    return (
      <View style={[styles.tableRowWrapper, isLast && styles.tableRowLast]}>
        <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt, isLast && { borderBottomWidth: 0 }]}>
          <View style={styles.tableCellDateContainer}>
            <FontAwesome5 name="calendar-alt" size={11} color={Colors.textMuted} />
            <Text style={styles.tableDate}>{item.date}</Text>
          </View>
          <Text style={[styles.tableVal, isNasa && styles.tableValNasa]}>
            {isNasa ? `${item.val.toFixed(2)} mm` : item.val.toFixed(4)}
          </Text>
        </View>
      </View>
    );
  }, [tableEntries.length, isNasa]);

  return (
    <View style={styles.container}>
      <Header title="Detalhes da Telemetria" showBackButton />

      <FlatList
        data={tableEntries}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.content}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        ListHeaderComponent={
          <>
            {/* Info Card header */}
            <View style={styles.summaryCard}>
              <View style={styles.badgeRow}>
                <View style={[styles.typeBadge, { backgroundColor: isNasa ? Colors.info : Colors.accent }]}>
                  <FontAwesome5 name={isNasa ? 'cloud-sun-rain' : 'satellite'} size={11} color={Colors.textPrimary} />
                  <Text style={styles.typeBadgeText}>
                    {isNasa ? 'NASA Power' : 'Embrapa SATveg'}
                  </Text>
                </View>
                <Text style={styles.analysisId}>Registro #{id}</Text>
              </View>
              
              <Text style={styles.mainTitle}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

             {/* ── SEÇÃO: GRÁFICO INTERATIVO */}
             <View style={styles.chartContainer}>
               <Text style={styles.sectionTitle}>📈 Visualização Temporal</Text>
 
               {dataEntries.length === 0 ? (
                 <View style={styles.emptyChart}>
                   <Text style={styles.emptyText}>Sem dados temporais disponíveis.</Text>
                 </View>
               ) : (
                 <View>
                   {/* Bar Chart Area */}
                   <View style={styles.chartArea}>
                    {/* Y-Axis Grid Lines */}
                    <View style={styles.gridLinesContainer}>
                      <View style={styles.gridLineRow}>
                        <Text style={styles.gridText}>{chartMax.toFixed(1)}</Text>
                        <View style={styles.gridLine} />
                      </View>
                      <View style={styles.gridLineRow}>
                        <Text style={styles.gridText}>{(chartMax * 0.75).toFixed(1)}</Text>
                        <View style={styles.gridLine} />
                      </View>
                      <View style={styles.gridLineRow}>
                        <Text style={styles.gridText}>{(chartMax * 0.5).toFixed(1)}</Text>
                        <View style={styles.gridLine} />
                      </View>
                      <View style={styles.gridLineRow}>
                        <Text style={styles.gridText}>{(chartMax * 0.25).toFixed(1)}</Text>
                        <View style={styles.gridLine} />
                      </View>
                      <View style={styles.gridLineRow}>
                        <Text style={styles.gridText}>0.0</Text>
                        <View style={styles.gridLine} />
                      </View>
                    </View>

                    {/* Horizontal Scrollable Bars */}
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.barsScrollContainer}
                      data={tableEntries}
                      keyExtractor={(item) => item.date}
                      initialNumToRender={10}
                      maxToRenderPerBatch={5}
                      renderItem={renderChartBar}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* ── SEÇÃO: TABELA DETALHADA ─────────────────────────── */}
            <View style={styles.tableContainerHeader}>
              <Text style={styles.sectionTitle}>📋 Série de Medições Completa</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.thDate}>Período / Dia</Text>
                <Text style={styles.thValue}>{isNasa ? 'Chuva (mm)' : 'NDVI (Média)'}</Text>
              </View>
            </View>
          </>
        }
        renderItem={renderTableRow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  summaryCard: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  analysisId: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  emptyChart: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  tooltipContainer: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgTertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    paddingVertical: 6,
  },
  tooltip: {
    alignItems: 'center',
  },
  tooltipDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tooltipVal: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  tooltipValNasa: {
    color: Colors.info,
  },
  tooltipPlaceholder: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  chartArea: {
    height: 220,
    flexDirection: 'row',
  },
  gridLinesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 30, // space for bar labels
    justifyContent: 'space-between',
  },
  gridLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridText: {
    width: 32,
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'left',
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.4,
  },
  barsScrollContainer: {
    paddingLeft: 36, // space past grid text labels
    paddingRight: 16,
    alignItems: 'flex-end',
    height: '100%',
  },
  barColumn: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 34,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    flex: 1,
    width: 14,
    justifyContent: 'flex-end',
    backgroundColor: Colors.bgTertiary,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barFillSatveg: {
    backgroundColor: Colors.accent,
  },
  barFillNasa: {
    backgroundColor: Colors.info,
  },
  barFillSelected: {
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  barLabelSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  tableContainerHeader: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: 16,
    paddingBottom: 0,
  },
  tableRowWrapper: {
    backgroundColor: Colors.bgSecondary,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  tableRowLast: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 8,
  },
  thDate: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  thValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 66, 43, 0.3)',
  },
  tableRowAlt: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  tableCellDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableDate: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  tableVal: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '700',
  },
  tableValNasa: {
    color: Colors.info,
  },
});
