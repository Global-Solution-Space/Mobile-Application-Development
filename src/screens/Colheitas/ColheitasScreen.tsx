// ═══════════════════════════════════════════════════════════════
// Terra Nova — Histórico de Colheitas
// Relatório de tudo que foi colhido com sucesso
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { EmptyState } from '../../components/EmptyState';
import { useAppStore } from '../../store/useAppStore';
import { Colheita } from '../../types';

const qualidadeColor: Record<string, string> = {
  Excelente: Colors.success,
  Boa: Colors.info,
  Regular: Colors.warning,
  Ruim: Colors.danger,
};

const culturaEmoji: Record<string, string> = {
  Batata: '🥔', Tomate: '🍅', Alface: '🥬', Cenoura: '🥕',
  Morango: '🍓', Soja: '🫘', Trigo: '🌾', Espinafre: '🥬',
};

export function ColheitasScreen({ navigation }: any) {
  const { colheitas } = useAppStore();

  const totalKg = colheitas.reduce((s, c) => s + c.quantidadeKg, 0);
  const totalColheitas = colheitas.length;
  const mediaKg = totalColheitas > 0 ? totalKg / totalColheitas : 0;

  const renderItem = ({ item }: { item: Colheita }) => {
    const qc = qualidadeColor[item.qualidade] || Colors.textMuted;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <Text style={styles.emoji}>{culturaEmoji[item.tipoCultura] || '🌱'}</Text>
            <View>
              <Text style={styles.cultura}>{item.tipoCultura}</Text>
              <Text style={styles.estufa}>{item.estufaNome}</Text>
            </View>
          </View>
          <View style={[styles.qualBadge, { backgroundColor: qc + '22' }]}>
            <Text style={[styles.qualText, { color: qc }]}>{item.qualidade}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <FontAwesome5 name="weight-hanging" size={12} color={Colors.accent} />
            <Text style={styles.detailValue}>{item.quantidadeKg.toFixed(1)} kg</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome5 name="calendar-alt" size={12} color={Colors.textMuted} />
            <Text style={styles.detailDate}>
              {new Date(item.dataColheita).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={18} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Colheitas</Text>
      </View>

      {/* ── Resumo ─── */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <FontAwesome5 name="weight-hanging" size={16} color={Colors.accent} />
          <Text style={styles.summaryValue}>{totalKg.toFixed(1)}</Text>
          <Text style={styles.summaryLabel}>kg total</Text>
        </View>
        <View style={styles.summaryCard}>
          <FontAwesome5 name="clipboard-check" size={16} color={Colors.info} />
          <Text style={styles.summaryValue}>{totalColheitas}</Text>
          <Text style={styles.summaryLabel}>colheitas</Text>
        </View>
        <View style={styles.summaryCard}>
          <FontAwesome5 name="chart-line" size={16} color={Colors.success} />
          <Text style={styles.summaryValue}>{mediaKg.toFixed(1)}</Text>
          <Text style={styles.summaryLabel}>kg/média</Text>
        </View>
      </View>

      <FlatList
        data={colheitas}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="clipboard-list" title="Nenhuma colheita registrada" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },

  summaryRow: { flexDirection: 'row', gap: 10, padding: 16 },
  summaryCard: {
    flex: 1, backgroundColor: Colors.bgSecondary, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 4,
  },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary },
  summaryLabel: { fontSize: 10, color: Colors.textMuted },

  list: { paddingHorizontal: 16, paddingBottom: 40 },

  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 26 },
  cultura: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  estufa: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  qualBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  qualText: { fontSize: 11, fontWeight: '700' },

  detailsRow: { flexDirection: 'row', gap: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailValue: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  detailDate: { fontSize: 13, color: Colors.textSecondary },
});
