// ═══════════════════════════════════════════════════════════════
// Terra Nova — Estoque de Insumos (CRUD Secundário)
// Cadastrar, listar, editar e excluir adubos/sementes/nutrientes
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { SelectChip } from '../../components/SelectChip';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { Insumo, CategoriaInsumo } from '../../types';

const CATEGORIAS: CategoriaInsumo[] = ['Semente', 'Adubo', 'Nutriente', 'Fertilizante', 'Pesticida', 'Substrato'];
const catIcon: Record<CategoriaInsumo, string> = {
  Semente: 'seedling', Adubo: 'fill-drip', Nutriente: 'flask',
  Fertilizante: 'leaf', Pesticida: 'shield-alt', Substrato: 'layer-group',
};

export function EstoqueScreen() {
  const { insumos, addInsumo, updateInsumo, deleteInsumo } = useAppStore();

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaInsumo>('Semente');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('');
  const [minimo, setMinimo] = useState('');

  const openCreate = () => {
    setEditId(null);
    setNome('');
    setCategoria('Semente');
    setQuantidade('');
    setUnidade('');
    setMinimo('');
    setModal(true);
  };

  const openEdit = (item: Insumo) => {
    setEditId(item.id);
    setNome(item.nome);
    setCategoria(item.categoria);
    setQuantidade(item.quantidade.toString());
    setUnidade(item.unidade);
    setMinimo(item.minimo.toString());
    setModal(true);
  };

  const handleSave = () => {
    const qtdNum = Number(quantidade);
    const minNum = Number(minimo);

    if (!nome.trim() || !quantidade || !unidade.trim() || isNaN(qtdNum) || isNaN(minNum)) {
      Alert.alert('Campos obrigatórios', 'Preencha os campos com valores válidos.');
      return;
    }

    const data = {
      nome: nome.trim(),
      categoria,
      quantidade: qtdNum || 0,
      unidade: unidade.trim(),
      minimo: minNum || 0,
    };

    if (editId) {
      updateInsumo(editId, data);
    } else {
      addInsumo(data);
    }
    setModal(false);
  };

  const confirmDelete = (item: Insumo) => {
    Alert.alert(
      'Excluir Insumo',
      `Deseja remover "${item.nome}" do estoque?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteInsumo(item.id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Insumo }) => {
    const isLow = item.quantidade < item.minimo;
    return (
      <View style={[styles.card, isLow && styles.cardLow]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconCircle, isLow && { backgroundColor: Colors.warningBg }]}>
              <FontAwesome5 name={catIcon[item.categoria]} size={16}
                color={isLow ? Colors.warning : Colors.accent} />
            </View>
            <View>
              <Text style={styles.cardName}>{item.nome}</Text>
              <Text style={styles.cardCat}>{item.categoria}</Text>
            </View>
          </View>
          {isLow && (
            <View style={styles.lowBadge}>
              <FontAwesome5 name="exclamation-triangle" size={10} color={Colors.warning} />
              <Text style={styles.lowText}>Baixo</Text>
            </View>
          )}
        </View>

        <View style={styles.qtyRow}>
          <View style={styles.qtyItem}>
            <Text style={styles.qtyLabel}>Disponível</Text>
            <Text style={[styles.qtyValue, isLow && { color: Colors.warning }]}>
              {item.quantidade} {item.unidade}
            </Text>
          </View>
          <View style={styles.qtyItem}>
            <Text style={styles.qtyLabel}>Mínimo</Text>
            <Text style={styles.qtyMinValue}>{item.minimo} {item.unidade}</Text>
          </View>
        </View>

        {/* Barra de nível */}
        <View style={styles.barTrack}>
          <View style={[styles.barFill, {
            width: `${Math.min((item.quantidade / Math.max(item.minimo * 3, 1)) * 100, 100)}%`,
            backgroundColor: isLow ? Colors.warning : Colors.accent,
          }]} />
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)} activeOpacity={0.7}>
            <FontAwesome5 name="edit" size={12} color={Colors.info} />
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)} activeOpacity={0.7}>
            <FontAwesome5 name="trash" size={12} color={Colors.danger} />
            <Text style={styles.deleteBtnText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Estoque" />

      {/* ── Resumo ─── */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{insumos.length}</Text>
          <Text style={styles.summaryLabel}>Itens</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: Colors.warning }]}>
            {insumos.filter(i => i.quantidade < i.minimo).length}
          </Text>
          <Text style={styles.summaryLabel}>Abaixo do mín.</Text>
        </View>
        <TouchableOpacity style={styles.addFloating} onPress={openCreate} activeOpacity={0.8}>
          <FontAwesome5 name="plus" size={16} color={Colors.bgPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={insumos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="boxes"
            title="Estoque vazio"
            subtitle="Cadastre insumos tocando no botão +"
          />
        }
      />

      {/* ── Modal Create/Edit ─── */}
      <Modal visible={modal} animationType="slide" transparent>
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editId ? 'Editar Insumo' : 'Novo Insumo'}
                </Text>
                <TouchableOpacity onPress={() => setModal(false)}>
                  <FontAwesome5 name="times" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Nome *</Text>
              <TextInput
                style={styles.modalInput}
                value={nome}
                onChangeText={setNome}
                placeholder="Ex: Semente de Tomate"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.modalLabel}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIAS.map(c => (
                  <SelectChip
                    key={c}
                    label={c}
                    isActive={categoria === c}
                    onPress={() => setCategoria(c)}
                  />
                ))}
              </ScrollView>

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalLabel}>Quantidade *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={quantidade}
                    onChangeText={setQuantidade}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalLabel}>Unidade *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={unidade}
                    onChangeText={setUnidade}
                    placeholder="kg, L, un"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>

              <Text style={styles.modalLabel}>Mínimo Aceitável</Text>
              <TextInput
                style={styles.modalInput}
                value={minimo}
                onChangeText={setMinimo}
                keyboardType="numeric"
                placeholder="Quantidade mínima de alerta"
                placeholderTextColor={Colors.textMuted}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                <FontAwesome5 name="save" size={14} color={Colors.bgPrimary} />
                <Text style={styles.saveBtnText}>
                  {editId ? 'Salvar Alterações' : 'Cadastrar Insumo'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { padding: 16, paddingBottom: 100 },

  // Resumo
  summary: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: Colors.accent },
  summaryLabel: { fontSize: 11, color: Colors.textMuted },
  summaryDivider: { width: 1, height: 30, backgroundColor: Colors.border, marginHorizontal: 20 },
  addFloating: {
    marginLeft: 'auto',
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },

  // Card
  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 12,
  },
  cardLow: { borderColor: Colors.warning + '66' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accentGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  cardName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  cardCat: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  lowBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.warningBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  lowText: { fontSize: 10, color: Colors.warning, fontWeight: '700' },

  qtyRow: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  qtyItem: {},
  qtyLabel: { fontSize: 11, color: Colors.textMuted },
  qtyValue: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  qtyMinValue: { fontSize: 14, color: Colors.textSecondary },

  barTrack: { height: 5, backgroundColor: Colors.white05, borderRadius: 3, marginBottom: 14 },
  barFill: { height: 5, borderRadius: 3 },

  cardActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, backgroundColor: Colors.infoBg },
  editBtnText: { fontSize: 12, color: Colors.info, fontWeight: '600' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, backgroundColor: Colors.dangerBg },
  deleteBtnText: { fontSize: 12, color: Colors.danger, fontWeight: '600' },


  // Modal
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay },
  modalScroll: { flexGrow: 1, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.bgSecondary, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  modalLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  modalInput: {
    backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15,
  },
  rowInputs: { flexDirection: 'row', gap: 12 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: 12, height: 50, gap: 10, marginTop: 24,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.bgPrimary },
});