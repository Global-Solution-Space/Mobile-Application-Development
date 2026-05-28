// ═══════════════════════════════════════════════════════════════
// Terra Nova — Listagem de Lotes
// Com Histórico de Irrigação (Padrão 500ml) e botão de Eliminar
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, TextInput
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

const culturaIcon: Record<string, string> = {
  Batata: '🥔', Tomate: '🍅', Alface: '🥬', Cenoura: '🥕',
  Morango: '🍓', Soja: '🌱', Trigo: '🌾', Espinafre: '🥬',
};

export function LotesScreen() {
  const {
    lotes, deleteLote, updateLote, historicoIrrigacao, registrarIrrigacao, deleteIrrigacao,
    filtroStatus, filtroCultura, setFiltroStatus, setFiltroCultura,
  } = useAppStore() as any;

  const [editLote, setEditLote] = useState<Lote | null>(null);
  const [historicoLote, setHistoricoLote] = useState<Lote | null>(null); 
  const [showFilters, setShowFilters] = useState(false);

  const [editFase, setEditFase] = useState<FaseCrescimento>('Germinando');
  const [editQtd, setEditQtd] = useState('');
  const [editObs, setEditObs] = useState('');

  // Voltei o padrão inicial para 500 ML!
  const [mlIrrigacao, setMlIrrigacao] = useState('500');

  const filtered = (lotes || []).filter((l: Lote) => {
    if (filtroStatus !== 'Todos' && l.status !== filtroStatus) return false;
    if (filtroCultura !== 'Todas' && l.tipoCultura !== filtroCultura) return false;
    return true;
  });

  const openEdit = (lote: Lote) => {
    setEditLote(lote);
    setEditFase(lote.fase);
    setEditQtd(lote.quantidade.toString());
    setEditObs(lote.observacoes || '');
  };

  const saveEdit = () => {
    if (!editLote) return;
    updateLote(editLote.id, {
      fase: editFase,
      quantidade: parseInt(editQtd) || editLote.quantidade,
      observacoes: editObs,
    });
    setEditLote(null); 
  };

  const confirmDelete = (lote: Lote) => {
    const confirmacao = window.confirm(`Deseja remover o lote de ${lote.tipoCultura} da ${lote.estufaNome}?`);
    if (confirmacao) deleteLote(lote.id);
  };

  const handleRegarManual = () => {
    if (!historicoLote || !mlIrrigacao) return;
    registrarIrrigacao(historicoLote.id, Number(mlIrrigacao), 'Manual');
    // Reseta para os 500 ML depois de regar
    setMlIrrigacao('500'); 
  };

  const statusVariant = (s: StatusLote): 'success' | 'warning' | 'danger' =>
    s === 'Saudável' ? 'success' : s === 'Atenção' ? 'warning' : 'danger';

  // ─── TELA 1: EDIÇÃO DO LOTE ───
  if (editLote) {
    return (
      <View style={styles.container}>
        <Header title={`Editar — ${editLote.tipoCultura}`} />
        <ScrollView style={styles.editContainer}>
          <Text style={styles.formLabel}>Fase de Crescimento:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.faseScroll}>
            {FASES.map(f => (
              <SelectChip key={f} label={f} isActive={editFase === f} onPress={() => setEditFase(f)} />
            ))}
          </ScrollView>

          <Text style={styles.formLabel}>Quantidade:</Text>
          <TextInput style={styles.formInput} value={editQtd} onChangeText={setEditQtd} keyboardType="numeric" placeholderTextColor={Colors.textMuted} />

          <Text style={styles.formLabel}>Observações:</Text>
          <TextInput style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} value={editObs} onChangeText={setEditObs} multiline placeholderTextColor={Colors.textMuted} />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditLote(null)} activeOpacity={0.8}>
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

  // ─── TELA 2: HISTÓRICO DE IRRIGAÇÃO ───
  if (historicoLote) {
    const regasDoLote = historicoIrrigacao.filter((h: any) => h.lote_id === historicoLote.id);

    return (
      <View style={styles.container}>
        <Header title={`Irrigação — ${historicoLote.tipoCultura}`} />
        
        <View style={styles.irrigaTop}>
          <TouchableOpacity style={styles.voltarBtn} onPress={() => setHistoricoLote(null)}>
            <FontAwesome5 name="arrow-left" size={14} color={Colors.textSecondary} />
            <Text style={styles.voltarBtnText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={styles.formLabel}>Nova Rega Manual (ML):</Text>
          <View style={styles.irrigaInputRow}>
            <TextInput 
              style={[styles.formInput, { flex: 1, marginBottom: 0 }]} 
              value={mlIrrigacao} 
              onChangeText={setMlIrrigacao} 
              keyboardType="numeric" 
            />
            <TouchableOpacity style={styles.regarBtn} onPress={handleRegarManual}>
              <FontAwesome5 name="tint" size={14} color={Colors.bgPrimary} />
              <Text style={styles.regarBtnText}>Regar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={regasDoLote}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="tint-slash" title="Nenhuma rega registada" subtitle="Registe a primeira irrigação acima." />
          }
          renderItem={({ item }: any) => (
            <View style={styles.regaCard}>
              <View style={styles.regaRow}>
                <View style={styles.regaIconBox}>
                  <FontAwesome5 name="tint" size={16} color={Colors.info} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.regaTitle}>{item.quantidade_agua_ml} ML de Água</Text>
                  <Text style={styles.regaDate}>
                    {new Date(item.data_hora).toLocaleString('pt-BR')}
                  </Text>
                </View>
                <View style={styles.regaBadge}>
                  <Text style={styles.regaBadgeText}>{item.tipo_acionamento}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteIrrigacao(item.id)} style={styles.deleteIrrigaBtn}>
                  <FontAwesome5 name="trash" size={14} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  // ─── TELA PADRÃO: LISTA DE LOTES ───
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
      </View>

      <View style={styles.loteActions}>
        <TouchableOpacity style={styles.irrigaBtn} onPress={() => setHistoricoLote(item)} activeOpacity={0.7}>
          <FontAwesome5 name="tint" size={13} color="#3b82f6" />
          <Text style={styles.irrigaBtnText}>Irrigação</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)} activeOpacity={0.7}>
          <FontAwesome5 name="edit" size={13} color={Colors.info} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)} activeOpacity={0.7}>
          <FontAwesome5 name="trash" size={13} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Lotes de Cultivo" />
      <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)} activeOpacity={0.7}>
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
              <SelectChip key={s} label={s} isActive={filtroStatus === s} onPress={() => setFiltroStatus(s)} />
            ))}
          </ScrollView>

          <Text style={[styles.filterLabel, { marginTop: 10 }]}>Cultura:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {CULTURAS.map(c => (
              <SelectChip key={c} label={c} isActive={filtroCultura === c} onPress={() => setFiltroCultura(c)} />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} lote(s) encontrado(s)</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="seedling" title="Nenhum lote encontrado" subtitle='Cadastre um novo lote na aba "Cadastrar"' />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { padding: 16, paddingBottom: 100 },

  filterToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterToggleText: { fontSize: 14, color: Colors.accent, fontWeight: '600', flex: 1 },
  filterContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  filterScroll: { marginBottom: 4 },
  countRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  countText: { fontSize: 12, color: Colors.textMuted },

  loteCard: { backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  loteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  loteNameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  loteEmoji: { fontSize: 28 },
  loteCultura: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  loteEstufa: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  loteDetails: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailText: { fontSize: 12, color: Colors.textSecondary },

  loteActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  irrigaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  irrigaBtnText: { fontSize: 13, color: '#3b82f6', fontWeight: '700' },
  editBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: Colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: Colors.dangerBg, alignItems: 'center', justifyContent: 'center' },

  editContainer: { padding: 20 },
  formLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  formInput: { backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15 },
  faseScroll: { marginBottom: 4 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 30 },
  cancelBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgTertiary, borderRadius: 12, height: 50, borderWidth: 1, borderColor: Colors.border },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  saveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent, borderRadius: 12, height: 50, gap: 8 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.bgPrimary },

  irrigaTop: { padding: 16, backgroundColor: Colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: Colors.border },
  voltarBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, marginBottom: 12 },
  voltarBtnText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  irrigaInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  regarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', borderRadius: 12, height: 48, paddingHorizontal: 20, gap: 8 },
  regarBtnText: { fontSize: 14, fontWeight: '700', color: Colors.bgPrimary },
  
  regaCard: { backgroundColor: Colors.bgSecondary, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  regaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  regaIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59, 130, 246, 0.15)', alignItems: 'center', justifyContent: 'center' },
  regaTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  regaDate: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  regaBadge: { backgroundColor: Colors.bgTertiary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  regaBadgeText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  
  deleteIrrigaBtn: { paddingLeft: 14, paddingVertical: 4 }
});