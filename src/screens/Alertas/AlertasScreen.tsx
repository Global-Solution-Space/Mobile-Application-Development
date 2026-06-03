// ═══════════════════════════════════════════════════════════════
// Terra Nova — Central de Alertas e Eventos Críticos
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { EmptyState } from '../../components/EmptyState';
import { useAppStore } from '../../store/useAppStore';
import { AlertaAgricola } from '../../types';

const severidadeColor: Record<string, string> = {
  ALTO: Colors.danger,
  MEDIO: Colors.warning,
  BAIXO: Colors.info,
};

const severidadeIcon: Record<string, string> = {
  ALTO: 'exclamation-triangle',
  MEDIO: 'exclamation-circle',
  BAIXO: 'info-circle',
};

export function AlertasScreen({ navigation }: any) {
  const { alertas, resolverEvento } = useAppStore();
  const [filter, setFilter] = useState<'Todos' | 'ALTO' | 'MEDIO' | 'BAIXO'>('Todos');

  const ativos = alertas.filter(a => a.resolvido === 'N');

  const filtered = ativos.filter(a => filter === 'Todos' ? true : a.nivelAlerta === filter);



  const renderItem = ({ item }: { item: AlertaAgricola }) => {
    const sc = severidadeColor[item.nivelAlerta] || Colors.textMuted;
    const ic = severidadeIcon[item.nivelAlerta] || 'bell';

    return (
      <View style={[styles.card, { borderLeftColor: sc }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={[styles.iconBox, { backgroundColor: sc + '22' }]}>
              <FontAwesome5 name={ic} size={14} color={sc} />
            </View>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
          </View>
          <Text style={styles.timeText}>ID: {item.id}</Text>
        </View>

        <Text style={styles.cardDesc}>{item.descricao}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaRow}>
            <View style={[styles.sevBadge, { backgroundColor: sc + '15', borderColor: sc + '44' }]}>
              <Text style={[styles.sevText, { color: sc }]}>{item.nivelAlerta}</Text>
            </View>
            {item.dataAlerta && (
              <View style={styles.tagBadge}>
                <FontAwesome5 name="clock" size={10} color={Colors.textMuted} />
                <Text style={styles.tagText}>{item.dataAlerta}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.resolveBtn} onPress={() => resolverEvento(item.id)} activeOpacity={0.7}>
            <FontAwesome5 name="check" size={12} color={Colors.bgPrimary} />
            <Text style={styles.resolveBtnText}>Resolver</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Central de Alertas</Text>
      </View>

      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {['Todos', 'ALTO', 'MEDIO', 'BAIXO'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f as any)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="shield-alt" title="Nenhum alerta ativo" subtitle="Tudo sob controle no momento." />}
      />
    </View>
  );
}

import { ScrollView } from 'react-native';

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

  toolbar: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  filterScroll: { flexGrow: 0 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: Colors.bgPrimary },



  list: { padding: 16, paddingBottom: 40 },

  card: { backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16, borderWidth: 1, borderLeftWidth: 4, borderColor: Colors.border, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  timeText: { fontSize: 11, color: Colors.textMuted },

  cardDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 16 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  metaRow: { flexDirection: 'row', gap: 8 },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  sevText: { fontSize: 10, fontWeight: '800' },
  tagBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.bgTertiary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, color: Colors.textSecondary },

  resolveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  resolveBtnText: { color: Colors.bgPrimary, fontSize: 12, fontWeight: '700' },
});