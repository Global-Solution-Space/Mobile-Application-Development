// ═══════════════════════════════════════════════════════════════
// Terra Nova — Listagem de Lotes com Filtros Avançados
// Read + Delete + Filtros por Status e Cultura
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ScrollView, Modal, TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { SelectChip } from '../../components/SelectChip';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import {
  Lote, FaseCrescimento, StatusLote, TipoCultura,
} from '../../types';

const CULTURAS: Array<TipoCultura | 'Todas'> = ['Todas', 'Batata', 'Tomate', 'Alface', 'Cenoura', 'Morango', 'Soja', 'Trigo', 'Espinafre'];
const STATUS_LIST: Array<StatusLote | 'Todos'> = ['Todos', 'Saudável', 'Atenção', 'Crítico'];
const FASES: FaseCrescimento[] = ['Germinando', 'Crescendo', 'Maduro', 'Pronto para Colheita', 'Colhido', 'Perdido'];

// ── Ícone por cultura ───
const culturaIcon: Record<string, string> = {
  Batata: '🥔', Tomate: '🍅', Alface: '🥬', Cenoura: '🥕',
  Morango: '🍓', Soja: '🫘', Trigo: '🌾', Espinafre: '🥬',
};

export function LotesScreen() {
  const {
    lotes, deleteLote, updateLote, estufas,
    filtroStatus, filtroCultura, setFiltroStatus, setFiltroCultura,
  } = useAppStore();

  const [editModal, setEditModal] = useState(false);
  const [editLote, setEditLote] = useState<Lote | null>(null);
  const [editFase, setEditFase] = useState<FaseCrescimento>('Germinando');
  const [editQtd, setEditQtd] = useState('');
  const [editObs, setEditObs] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // ── Aplicar filtros ───
  const filtered = lotes.filter(l => {
    if (filtroStatus !== 'Todos' && l.status !== filtroStatus) return false;
    if (filtroCultura !== 'Todas' && l.tipoCultura !== filtroCultura) return false;
    return true;
  });

  // ── Abrir edição ───
  const openEdit = (lote: Lote) => {
    setEditLote(lote);
    setEditFase(lote.fase);
    setEditQtd(lote.quantidade.toString());
    setEditObs(lote.observacoes);
    setEditModal(true);
  };

  const saveEdit = () => {
    if (!editLote) return;
    updateLote(editLote.id, {
      fase: editFase,
      quantidade: parseInt(editQtd) || editLote.quantidade,
      observacoes: editObs,
    });
    setEditModal(false);
    setEditLote(null);
  };

  // ── Confirmar exclusão ───
  const confirmDelete = (lote: Lote) => {
    Alert.alert(
      'Excluir Lote',
      `Deseja remover o lote de ${lote.tipoCultura} da ${lote.estufaNome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteLote(lote.id) },
      ]
    );
  };

  // ── Status variant ───
  const statusVariant = (s: StatusLote): 'success' | 'warning' | 'danger' =>
    s === 'Saudável' ? 'success' : s === 'Atenção' ? 'warning' : 'danger';

  const renderItem = ({ item }: { item: Lote }) => (
    <View style={styles.loteCard}>
      <View style={styles.loteHeader}>
        <View style={styles.loteNameRow}>
          <Text style={styles.loteEmoji}>{culturaIcon[item.tipoCultura] || '🌱'}</Text>
          <View>
            <Text style={styles.loteCultura}>{item.tipoCultura}</Text>
            <Text style={styles.loteEstufa}>{item.estufaNome}</Text>
          </View>
        </View>
        <StatusBadge label={item.status} variant={statusVariant(item.status)} />
      </View>

      <View style={styles.loteDetails}>
        <View style={styles.detailItem}>
          <FontAwesome5 name="sync" size={11} color={Colors.textMuted} />
          <Text style={styles.detailText}>{item.fase}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5 name="cubes" size={11} color={Colors.textMuted} />
          <Text style={styles.detailText}>{item.quantidade} un.</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5 name="calendar-alt" size={11} color={Colors.textMuted} />
          <Text style={styles.detailText}>{new Date(item.dataPlantio).toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      {item.observacoes ? (
        <Text style={styles.loteObs}>{item.observacoes}</Text>
      ) : null}

      <View style={styles.loteActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)} activeOpacity={0.7}>
          <FontAwesome5 name="edit" size={13} color={Colors.info} />
          <Text style={styles.editBtnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)} activeOpacity={0.7}>
          <FontAwesome5 name="trash" size={13} color={Colors.danger} />
          <Text style={styles.deleteBtnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Lotes de Cultivo" />

      {/* ── Barra de Filtros ─── */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="filter" size={14} color={Colors.accent} />
        <Text style={styles.filterToggleText}>
          Filtros {(filtroStatus !== 'Todos' || filtroCultura !== 'Todas') ? '(ativos)' : ''}
        </Text>
        <FontAwesome5 name={showFilters ? 'chevron-up' : 'chevron-down'} size={12} color={Colors.textMuted} />
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {STATUS_LIST.map(s => (
              <SelectChip
                key={s}
                label={s}
                isActive={filtroStatus === s}
                onPress={() => setFiltroStatus(s)}
              />
            ))}
          </ScrollView>

          <Text style={[styles.filterLabel, { marginTop: 10 }]}>Cultura:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {CULTURAS.map(c => (
              <SelectChip
                key={c}
                label={c}
                isActive={filtroCultura === c}
                onPress={() => setFiltroCultura(c)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Contagem ─── */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} lote(s) encontrado(s)</Text>
      </View>

      {/* ── Lista ─── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="seedling"
            title="Nenhum lote encontrado"
            subtitle='Cadastre um novo lote na aba "Cadastrar"'
          />
        }
      />

      {/* ── Modal de Edição ─── */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Editar Lote — {editLote?.tipoCultura}
              </Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <FontAwesome5 name="times" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Fase de Crescimento:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.faseScroll}>
              {FASES.map(f => (
                <SelectChip
                  key={f}
                  label={f}
                  isActive={editFase === f}
                  onPress={() => setEditFase(f)}
                />
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>Quantidade:</Text>
            <TextInput
              style={styles.modalInput}
              value={editQtd}
              onChangeText={setEditQtd}
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.modalLabel}>Observações:</Text>
            <TextInput
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
              value={editObs}
              onChangeText={setEditObs}
              multiline
              placeholderTextColor={Colors.textMuted}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveEdit} activeOpacity={0.8}>
              <FontAwesome5 name="save" size={14} color={Colors.bgPrimary} />
              <Text style={styles.saveBtnText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { padding: 16, paddingBottom: 100 },

  // Filtros
  filterToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  filterToggleText: { fontSize: 14, color: Colors.accent, fontWeight: '600', flex: 1 },
  filterContainer: {
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  filterLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  filterScroll: { marginBottom: 4 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.bgTertiary, borderWidth: 1, borderColor: Colors.border,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  filterChipText: { fontSize: 12, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.accent, fontWeight: '700' },

  countRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  countText: { fontSize: 12, color: Colors.textMuted },

  // Lote Card
  loteCard: {
    backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 12,
  },
  loteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  loteNameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  loteEmoji: { fontSize: 28 },
  loteCultura: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  loteEstufa: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  loteDetails: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailText: { fontSize: 12, color: Colors.textSecondary },

  loteObs: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic', marginBottom: 10 },

  loteActions: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.infoBg },
  editBtnText: { fontSize: 13, color: Colors.info, fontWeight: '600' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.dangerBg },
  deleteBtnText: { fontSize: 13, color: Colors.danger, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.bgSecondary, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  modalLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  modalInput: {
    backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15,
  },
  faseScroll: { marginBottom: 4 },
  faseChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.bgTertiary, borderWidth: 1, borderColor: Colors.border, marginRight: 8,
  },
  faseChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  faseChipText: { fontSize: 12, color: Colors.textSecondary },
  faseChipTextActive: { color: Colors.accent, fontWeight: '700' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: 12, height: 50, gap: 10, marginTop: 24,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.bgPrimary },
});