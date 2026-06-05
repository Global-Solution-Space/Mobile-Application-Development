// ═══════════════════════════════════════════════════════════════
// Terra Nova — Listagem de Talhões
// ═══════════════════════════════════════════════════════════════

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { SelectChip } from '../../components/SelectChip';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Talhao } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useScreenSync } from '../../hooks/useScreenSync';

interface TalhoesScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export function TalhoesScreen({ navigation }: TalhoesScreenProps) {
  const { talhoes, deleteTalhao, propriedades, tiposPlantacao, alertas } = useAppStore();
  useScreenSync();

  const [showFilters, setShowFilters] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<number | 'Todos'>('Todos');
  const [filtroProp, setFiltroProp] = useState<number | 'Todas'>('Todas');

  const filtered = useMemo(() => talhoes.filter(t => {
    if (filtroTipo !== 'Todos' && t.idTipoPlantacao !== filtroTipo) return false;
    if (filtroProp !== 'Todas' && t.idPropriedade !== filtroProp) return false;
    return true;
  }), [talhoes, filtroTipo, filtroProp]);

  const openEdit = (talhao: Talhao) => {
    navigation.navigate('GerenciarTalhoes', { editId: talhao.id });
  };

  const confirmDelete = (talhao: Talhao) => {
    Alert.alert(
      'Remover Talhão',
      `Deseja remover o talhão ${talhao.nomeTalhao}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteTalhao(talhao.id) }
      ]
    );
  };

  const renderItem = useCallback(({ item }: { item: Talhao }) => {
    const prop = propriedades.find(p => p.id === item.idPropriedade);
    const tipo = tiposPlantacao.find(t => t.id === item.idTipoPlantacao);

    // Lógica para determinar o status com base nos alertas da API
    const alertasDoTalhao = alertas.filter(a => a.idTalhao === item.id && a.resolvido === 'N');
    let statusDinamico = 'NORMAL';
    let badgeVariant: 'success' | 'warning' | 'danger' = 'success';

    const temAlertaAlto = alertasDoTalhao.some(a => a.nivelAlerta === 'ALTO' || a.nivelAlerta === 'CRITICO');
    const temAlertaMedio = alertasDoTalhao.some(a => a.nivelAlerta === 'MEDIO');

    if (temAlertaAlto) {
      statusDinamico = 'CRÍTICO';
      badgeVariant = 'danger';
    } else if (temAlertaMedio) {
      statusDinamico = 'ATENÇÃO';
      badgeVariant = 'warning';
    }

    return (
      <View style={styles.talhaoCard}>
        <View style={styles.talhaoHeader}>
          <View style={styles.talhaoNameRow}>
            <Text style={styles.talhaoEmoji}>🌱</Text>
            <View>
              <Text style={styles.talhaoCultura}>{item.nomeTalhao}</Text>
              <Text style={styles.talhaoPropriedade}>{prop?.nome || 'Desconhecida'}</Text>
            </View>
          </View>
          {statusDinamico !== 'NORMAL' && (
            <StatusBadge label={statusDinamico} variant={badgeVariant} />
          )}
        </View>

        <View style={styles.talhaoDetails}>
          <View style={styles.detailItem}>
            <FontAwesome5 name="seedling" size={11} color={Colors.textMuted} />
            <Text style={styles.detailText}>{tipo?.tipoPlant || 'Desconhecido'}</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome5 name="ruler-combined" size={11} color={Colors.textMuted} />
            <Text style={styles.detailText}>{item.volumArea} ha</Text>
          </View>
        </View>

        <View style={styles.talhaoActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)} activeOpacity={0.7}>
            <FontAwesome5 name="edit" size={13} color={Colors.info} />
            <Text style={[styles.actionBtnText, { color: Colors.info }]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)} activeOpacity={0.7}>
            <FontAwesome5 name="trash" size={13} color={Colors.danger} />
            <Text style={[styles.actionBtnText, { color: Colors.danger }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [propriedades, tiposPlantacao, alertas]);

  return (
    <View style={styles.container}>
      <Header title="Talhões" />

      <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)} activeOpacity={0.7}>
        <FontAwesome5 name="filter" size={14} color={Colors.accent} />
        <Text style={styles.filterToggleText}>
          Filtros {(filtroTipo !== 'Todos' || filtroProp !== 'Todas') ? ' (ativos)' : ''}
        </Text>
        <FontAwesome5 name={showFilters ? 'chevron-up' : 'chevron-down'} size={12} color={Colors.textMuted} />
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Tipo de Plantação:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <SelectChip label="Todos" isActive={filtroTipo === 'Todos'} onPress={() => setFiltroTipo('Todos')} />
            {tiposPlantacao.map(t => (
              <SelectChip key={t.id} label={t.tipoPlant} isActive={filtroTipo === t.id} onPress={() => setFiltroTipo(t.id)} />
            ))}
          </ScrollView>

          <Text style={[styles.filterLabel, { marginTop: 10 }]}>Propriedade:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <SelectChip label="Todas" isActive={filtroProp === 'Todas'} onPress={() => setFiltroProp('Todas')} />
            {propriedades.map(p => (
              <SelectChip key={p.id} label={p.nome} isActive={filtroProp === p.id} onPress={() => setFiltroProp(p.id)} />
            ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity style={styles.addTalhaoBtnFull} onPress={() => navigation.navigate('GerenciarTalhoes')} activeOpacity={0.85}>
        <FontAwesome5 name="plus" size={14} color={Colors.bgPrimary} />
        <Text style={styles.addTalhaoBtnFullText}>Cadastrar Novo Talhão</Text>
      </TouchableOpacity>

      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} talhão(ões) encontrado(s)</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={<EmptyState icon="seedling" title="Nenhum talhão encontrado" subtitle='Toque em "Cadastrar Novo Talhão" para começar!' />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { padding: 16, paddingBottom: 100 },

  filterToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterToggleText: { fontSize: 14, color: Colors.accent, fontWeight: '600', flex: 1 },
  addTalhaoBtnFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.accent, borderRadius: 12, padding: 14, marginHorizontal: 16, marginTop: 16, },
  addTalhaoBtnFullText: { color: Colors.bgPrimary, fontSize: 15, fontWeight: '700', },
  filterContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  filterScroll: { marginBottom: 4 },
  countRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  countText: { fontSize: 12, color: Colors.textMuted },

  talhaoCard: { backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  talhaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  talhaoNameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  talhaoEmoji: { fontSize: 28 },
  talhaoCultura: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  talhaoPropriedade: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  talhaoDetails: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailText: { fontSize: 12, color: Colors.textSecondary },

  talhaoActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  actionBtnText: { fontSize: 13, fontWeight: '700', marginLeft: 6 },
  editBtn: { flex: 1, flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: Colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { flex: 1, flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: Colors.dangerBg, alignItems: 'center', justifyContent: 'center' },
});