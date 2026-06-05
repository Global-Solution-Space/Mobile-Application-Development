// ═══════════════════════════════════════════════════════════════
// Terra Nova — Central de Alertas e Eventos Críticos
// ═══════════════════════════════════════════════════════════════

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { useAppStore } from '../../store/useAppStore';
import { AlertaAgricola } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const getSeverityColor = (lvl: string) => {
  switch (lvl) {
    case 'BAIXO': return Colors.info;
    case 'MEDIO': return Colors.warning;
    case 'ALTO': return Colors.danger;
    case 'CRITICO': return Colors.critical;
    default: return Colors.accent;
  }
};

const getSeverityIcon = (lvl: string) => {
  switch (lvl) {
    case 'BAIXO': return 'info-circle';
    case 'MEDIO': return 'exclamation-circle';
    case 'ALTO': return 'exclamation-triangle';
    case 'CRITICO': return 'radiation';
    default: return 'bell';
  }
};

const formatDate = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hr = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} às ${hr}:${min}`;
  } catch {
    return isoString; // Fallback
  }
};

interface AlertasScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Alertas'>;
}

export function AlertasScreen({ navigation }: AlertasScreenProps) {
  const { alertas, resolverEvento, deleteAlerta } = useAppStore();
  const [filter, setFilter] = useState<'Todos' | 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'>('Todos');

  // Otimização: Filtra por nível e ordena com os Não Resolvidos ('N') no topo
  const filtered = useMemo(() => {
    let baseList = filter === 'Todos' ? alertas : alertas.filter(a => a.nivelAlerta === filter);
    
    return baseList.sort((a, b) => {
      if (a.resolvido === 'N' && b.resolvido === 'S') return -1;
      if (a.resolvido === 'S' && b.resolvido === 'N') return 1;
      return b.id - a.id; // Desempate: mais recentes primeiro
    });
  }, [alertas, filter]);

  const renderItem = useCallback(({ item }: { item: AlertaAgricola }) => {
    const isResolved = item.resolvido === 'S';
    // Se estiver resolvido, as cores ficam neutras/apagadas
    const sc = isResolved ? Colors.textMuted : getSeverityColor(item.nivelAlerta);
    const ic = isResolved ? 'check-circle' : getSeverityIcon(item.nivelAlerta);

    return (
      <View style={[styles.card, { borderLeftColor: sc, opacity: isResolved ? 0.6 : 1 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={[styles.iconBox, { backgroundColor: sc + (isResolved ? '11' : '22') }]}>
              <FontAwesome5 name={ic} size={14} color={sc} />
            </View>
            <Text style={[styles.cardTitle, isResolved && { textDecorationLine: 'line-through', color: Colors.textSecondary }]}>
              {item.titulo}
            </Text>
          </View>
          <Text style={styles.timeText}>ID: {item.id}</Text>
        </View>

        <Text style={styles.cardDesc}>{item.descricao}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.footerTopRow}>
            <View style={styles.metaRow}>
              <View style={[styles.sevBadge, { backgroundColor: sc + '15', borderColor: sc + '44' }]}>
                <Text style={[styles.sevText, { color: sc }]}>{item.nivelAlerta}</Text>
              </View>
              {item.dataAlerta && (
                <View style={styles.tagBadge}>
                  <FontAwesome5 name="clock" size={10} color={Colors.textMuted} />
                  <Text style={styles.tagText}>{formatDate(item.dataAlerta)}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.actionGroup}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: Colors.bgTertiary }]} 
                onPress={() => navigation.navigate('CriarAlerta', { editAlertaId: item.id })}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="edit" size={12} color={Colors.textPrimary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: Colors.dangerBg }]} 
                onPress={() => {
                  Alert.alert('Deletar Alerta', `Tem certeza que deseja excluir o alerta "${item.titulo}"?`, [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', style: 'destructive', onPress: () => deleteAlerta(item.id) }
                  ]);
                }}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="trash" size={12} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          </View>

          {!isResolved && (
            <TouchableOpacity style={styles.resolveBtn} onPress={() => resolverEvento(item.id)} activeOpacity={0.7}>
              <FontAwesome5 name="check" size={12} color={Colors.bgPrimary} />
              <Text style={styles.resolveBtnText}>Marcar como Resolvido</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }, [resolverEvento, deleteAlerta, navigation]);

  return (
    <View style={styles.container}>
      <Header title="Central de Alertas" showBackButton />

      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['Todos', 'BAIXO', 'MEDIO', 'ALTO', 'CRITICO'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip, 
                filter === f && { backgroundColor: getSeverityColor(f), borderColor: getSeverityColor(f) }
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.addAlertaBtnFull} onPress={() => navigation.navigate('CriarAlerta')} activeOpacity={0.85}>
        <FontAwesome5 name="plus" size={14} color={Colors.bgPrimary} />
        <Text style={styles.addAlertaBtnFullText}>Cadastrar Novo Alerta</Text>
      </TouchableOpacity>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        removeClippedSubviews={true}
        initialNumToRender={8}
        windowSize={5}
        ListEmptyComponent={<EmptyState icon="shield-alt" title="Nenhum alerta ativo" subtitle="Tudo sob controle no momento." />}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },

  toolbar: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  filterScroll: { flexGrow: 0 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  filterText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: Colors.textPrimary },

  addAlertaBtnFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.accent, borderRadius: 12, padding: 14, marginHorizontal: 16, marginTop: 16, },
  addAlertaBtnFullText: { color: Colors.bgPrimary, fontSize: 15, fontWeight: '700', },

  list: { padding: 16, paddingBottom: 40 },

  card: { backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16, borderWidth: 1, borderLeftWidth: 4, borderColor: Colors.border, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  timeText: { fontSize: 11, color: Colors.textMuted },

  cardDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 16 },

  cardFooter: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12, gap: 12 },
  footerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', gap: 8 },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  sevText: { fontSize: 10, fontWeight: '800' },
  tagBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.bgTertiary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, color: Colors.textSecondary },

  actionGroup: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.accent, paddingVertical: 10, borderRadius: 8 },
  resolveBtnText: { color: Colors.bgPrimary, fontSize: 12, fontWeight: '700' },
});