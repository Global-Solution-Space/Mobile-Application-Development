// ═══════════════════════════════════════════════════════════════
// Terra Nova — Gerenciamento de Estufas / Setores
// Listar e monitorar estufas (cheias/vazias, tipo, status)
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { Estufa } from '../../types';

export function EstufasScreen({ navigation }: any) {
  const { estufas, lotes } = useAppStore();

  const statusColor = (s: string) =>
    s === 'Operacional' ? Colors.success :
    s === 'Manutenção' ? Colors.warning :
    s === 'Offline' ? Colors.textMuted : Colors.danger;

  const statusIcon = (s: string) =>
    s === 'Operacional' ? 'check-circle' :
    s === 'Manutenção' ? 'wrench' :
    s === 'Offline' ? 'power-off' : 'exclamation-triangle';

  const tipoIcon = (t: string) =>
    t === 'Hidropônica' ? 'tint' :
    t === 'Aeropônica' ? 'wind' :
    t === 'Aquapônica' ? 'fish' : 'seedling';

  const renderItem = ({ item }: { item: Estufa }) => {
    const lotesNaEstufa = lotes.filter(l => l.estufaId === item.id);
    const ocupacao = item.capacidade > 0 ? (lotesNaEstufa.length / item.capacidade) * 100 : 0;
    const sc = statusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.nameRow}>
            <View style={[styles.statusIndicator, { backgroundColor: sc }]} />
            <View>
              <Text style={styles.estufaNome}>{item.nome}</Text>
              <View style={styles.typeRow}>
                <FontAwesome5 name={tipoIcon(item.tipo)} size={11} color={Colors.textMuted} />
                <Text style={styles.tipoText}>{item.tipo}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: sc + '22' }]}>
            <FontAwesome5 name={statusIcon(item.status)} size={11} color={sc} />
            <Text style={[styles.statusText, { color: sc }]}>{item.status}</Text>
          </View>
        </View>

        {/* Sensores */}
        <View style={styles.sensorsRow}>
          <View style={styles.sensor}>
            <FontAwesome5 name="thermometer-half" size={12} color={item.temperatura > 30 ? Colors.danger : Colors.accent} />
            <Text style={styles.sensorVal}>{item.temperatura}°C</Text>
          </View>
          <View style={styles.sensor}>
            <FontAwesome5 name="tint" size={12} color={item.nivelAgua < 50 ? Colors.danger : Colors.info} />
            <Text style={styles.sensorVal}>{item.nivelAgua}%</Text>
          </View>
          <View style={styles.sensor}>
            <FontAwesome5 name="sun" size={12} color={item.luminosidade > 20 ? Colors.danger : Colors.warning} />
            <Text style={styles.sensorVal}>{item.luminosidade} UV</Text>
          </View>
          <View style={styles.sensor}>
            <FontAwesome5 name="cloud" size={12} color={Colors.textMuted} />
            <Text style={styles.sensorVal}>{item.umidade}%</Text>
          </View>
        </View>

        {/* Ocupação */}
        <View style={styles.ocupacaoSection}>
          <View style={styles.ocupacaoLabel}>
            <Text style={styles.ocupacaoTitle}>Ocupação</Text>
            <Text style={styles.ocupacaoValue}>
              {lotesNaEstufa.length}/{item.capacidade} lotes ({ocupacao.toFixed(0)}%)
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, {
              width: `${Math.min(ocupacao, 100)}%`,
              backgroundColor: ocupacao > 80 ? Colors.warning : ocupacao > 0 ? Colors.accent : Colors.textMuted,
            }]} />
          </View>
        </View>

        {/* Lotes nesta estufa */}
        {lotesNaEstufa.length > 0 && (
          <View style={styles.lotesSection}>
            <Text style={styles.lotesSectionTitle}>Lotes Ativos:</Text>
            {lotesNaEstufa.map(l => (
              <View key={l.id} style={styles.miniLote}>
                <View style={[styles.miniDot, {
                  backgroundColor: l.status === 'Saudável' ? Colors.success :
                    l.status === 'Atenção' ? Colors.warning : Colors.danger
                }]} />
                <Text style={styles.miniLoteText}>{l.tipoCultura} — {l.fase}</Text>
              </View>
            ))}
          </View>
        )}

        {lotesNaEstufa.length === 0 && (
          <View style={styles.emptySlot}>
            <FontAwesome5 name="inbox" size={14} color={Colors.textMuted} />
            <Text style={styles.emptySlotText}>Estufa vazia — disponível para plantio</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={18} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciamento de Estufas</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <View style={[styles.sDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.sText}>{estufas.filter(e => e.status === 'Operacional').length} Operacionais</Text>
        </View>
        <View style={styles.summaryChip}>
          <View style={[styles.sDot, { backgroundColor: Colors.warning }]} />
          <Text style={styles.sText}>{estufas.filter(e => e.status === 'Manutenção').length} Manutenção</Text>
        </View>
      </View>

      <FlatList
        data={estufas}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
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

  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  summaryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgSecondary, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
  },
  sDot: { width: 8, height: 8, borderRadius: 4 },
  sText: { fontSize: 12, color: Colors.textSecondary },

  list: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6 },
  estufaNome: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  tipoText: { fontSize: 11, color: Colors.textMuted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },

  sensorsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  sensor: { alignItems: 'center', gap: 3 },
  sensorVal: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },

  ocupacaoSection: { marginBottom: 12 },
  ocupacaoLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  ocupacaoTitle: { fontSize: 12, color: Colors.textMuted },
  ocupacaoValue: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  barTrack: { height: 6, backgroundColor: Colors.white05, borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },

  lotesSection: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10 },
  lotesSectionTitle: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  miniLote: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  miniDot: { width: 6, height: 6, borderRadius: 3 },
  miniLoteText: { fontSize: 12, color: Colors.textSecondary },

  emptySlot: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10,
  },
  emptySlotText: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
});
