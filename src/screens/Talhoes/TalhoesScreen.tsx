// ═══════════════════════════════════════════════════════════════
// Terra Nova — Listagem de Talhões
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, TextInput, Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { SelectChip } from '../../components/SelectChip';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { Talhao } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export function TalhoesScreen({ navigation }: any) {
  const {
    talhoes, deleteTalhao, updateTalhao, propriedades, tiposPlantacao, localizacoes, addLocalizacao
  } = useAppStore();

  const [editTalhao, setEditTalhao] = useState<Talhao | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [editNome, setEditNome] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editTipoId, setEditTipoId] = useState<number | null>(null);
  const [editPropId, setEditPropId] = useState<number | null>(null);
  const [editLat, setEditLat] = useState('');
  const [editLon, setEditLon] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<number | 'Todos'>('Todos');
  const [filtroProp, setFiltroProp] = useState<number | 'Todas'>('Todas');

  const filtered = talhoes.filter(t => {
    if (filtroTipo !== 'Todos' && t.idTipoPlantacao !== filtroTipo) return false;
    if (filtroProp !== 'Todas' && t.idPropriedade !== filtroProp) return false;
    return true;
  });

  const openEdit = (talhao: Talhao) => {
    setEditTalhao(talhao);
    setEditNome(talhao.nomeTalhao);
    setEditArea(talhao.volumArea.toString());
    setEditTipoId(talhao.idTipoPlantacao);
    setEditPropId(talhao.idPropriedade);
    const loc = localizacoes.find(l => l.id === talhao.idLocalizacao);
    if (loc) {
      setEditLat(loc.locLatitude.toString());
      setEditLon(loc.locLongitude.toString());
    } else {
      setEditLat('');
      setEditLon('');
    }
  };

  const saveEdit = async () => {
    if (!editTalhao || !editTipoId || !editPropId) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const latitude = parseFloat(editLat);
    const longitude = parseFloat(editLon);

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert('Erro', 'Latitude e Longitude devem ser numéricos.');
      return;
    }

    let finalLocId = localizacoes.find(l => l.locLatitude === latitude && l.locLongitude === longitude)?.id;

    if (!finalLocId) {
      const newLoc = await addLocalizacao({ locLatitude: latitude, locLongitude: longitude });
      if (!newLoc) {
        Alert.alert('Erro', 'Não foi possível cadastrar a nova localização.');
        return;
      }
      finalLocId = newLoc.id;
    }

    await updateTalhao(editTalhao.id, {
      nomeTalhao: editNome.trim(),
      volumArea: parseFloat(editArea) || editTalhao.volumArea,
      idTipoPlantacao: editTipoId,
      idPropriedade: editPropId,
      idLocalizacao: finalLocId,
    });
    setEditTalhao(null);
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

  if (editTalhao) {
    return (
      <View style={styles.container}>
        <Header title={`Editar — ${editTalhao.nomeTalhao}`} />
        <ScrollView style={styles.editContainer}>
          <Text style={styles.formLabel}>Nome do Talhão *</Text>
          <TextInput style={styles.formInput} value={editNome} onChangeText={setEditNome} placeholderTextColor={Colors.textMuted} />

          <Text style={styles.formLabel}>Volume / Área (ha) *</Text>
          <TextInput style={styles.formInput} value={editArea} onChangeText={setEditArea} keyboardType="numeric" placeholderTextColor={Colors.textMuted} />

          <Text style={styles.formLabel}>Tipo de Plantação *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 4, marginVertical: 6 }}>
            {tiposPlantacao.map(t => (
              <SelectChip
                key={t.id}
                label={t.tipoPlant}
                isActive={editTipoId === t.id}
                onPress={() => setEditTipoId(t.id)}
              />
            ))}
          </ScrollView>

          <Text style={styles.formLabel}>Propriedade *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 4, marginVertical: 6 }}>
            {propriedades.map(p => (
              <SelectChip
                key={p.id}
                label={p.nome}
                isActive={editPropId === p.id}
                onPress={() => setEditPropId(p.id)}
              />
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Latitude *</Text>
              <TextInput
                style={styles.formInput}
                value={editLat}
                onChangeText={setEditLat}
                placeholder="Ex: -23.5505"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Longitude *</Text>
              <TextInput
                style={styles.formInput}
                value={editLon}
                onChangeText={setEditLon}
                placeholder="Ex: -46.6333"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditTalhao(null)} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={saveEdit} activeOpacity={0.8}>
              <FontAwesome5 name="save" size={14} color={Colors.bgPrimary} />
              <Text style={styles.saveBtnText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Talhao }) => {
    const prop = propriedades.find(p => p.id === item.idPropriedade);
    const tipo = tiposPlantacao.find(t => t.id === item.idTipoPlantacao);

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
          <StatusBadge label={item.status || 'NORMAL'} variant={item.status === 'CRITICO' ? 'danger' : 'success'} />
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
            <Text style={[styles.irrigaBtnText, { color: Colors.info, marginLeft: 6 }]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)} activeOpacity={0.7}>
            <FontAwesome5 name="trash" size={13} color={Colors.danger} />
            <Text style={[styles.irrigaBtnText, { color: Colors.danger, marginLeft: 6 }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

      <TouchableOpacity style={styles.addTalhaoBtnFull} onPress={() => navigation.navigate('CriarTalhao')} activeOpacity={0.85}>
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
  irrigaBtnText: { fontSize: 13, color: '#3b82f6', fontWeight: '700' },
  editBtn: { flex: 1, flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: Colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { flex: 1, flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: Colors.dangerBg, alignItems: 'center', justifyContent: 'center' },

  editContainer: { padding: 20 },
  formLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  formInput: { backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 30 },
  cancelBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgTertiary, borderRadius: 12, height: 50, borderWidth: 1, borderColor: Colors.border },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  saveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent, borderRadius: 12, height: 50, gap: 8 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.bgPrimary },
});