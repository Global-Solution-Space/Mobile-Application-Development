// ═══════════════════════════════════════════════════════════════
// Terra Nova — Agendamento de Tarefas / Alertas
// Criar lembretes de manutenção, irrigação, checagem de luminosidade
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, Modal, TextInput, ScrollView
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { EmptyState } from '../../components/EmptyState';
import { SelectChip } from '../../components/SelectChip';
import { useAppStore } from '../../store/useAppStore';
import { Tarefa, PrioridadeTarefa } from '../../types';

const PRIORIDADES: PrioridadeTarefa[] = ['Baixa', 'Média', 'Alta', 'Urgente'];
const prioridadeColor: Record<PrioridadeTarefa, string> = {
  Baixa: Colors.textSecondary,
  Média: Colors.info,
  Alta: Colors.warning,
  Urgente: Colors.danger,
};
const prioridadeIcon: Record<PrioridadeTarefa, string> = {
  Baixa: 'flag', Média: 'flag', Alta: 'flag', Urgente: 'exclamation-circle',
};

export function TarefasScreen({ navigation }: any) {
  const { tarefas, addTarefa, toggleTarefa, deleteTarefa, estufas } = useAppStore();
  const [modal, setModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>('Média');
  const [estufaId, setEstufaId] = useState('');

  const pendentes = tarefas.filter(t => !t.concluida);
  const concluidas = tarefas.filter(t => t.concluida);

  const openCreate = () => {
    setTitulo('');
    setDescricao('');
    setPrioridade('Média');
    setEstufaId('');
    setModal(true);
  };

  const handleSave = () => {
    if (!titulo.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o título da tarefa.');
      return;
    }
    const estufa = estufas.find(e => e.id === estufaId);
    addTarefa({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      estufaId: estufaId || undefined,
      estufaNome: estufa?.nome || undefined,
      dataAgendada: new Date(Date.now() + 86400000).toISOString(),
      prioridade,
    });
    setModal(false);
  };

  const confirmDelete = (t: Tarefa) => {
    Alert.alert('Remover Tarefa', `Excluir "${t.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteTarefa(t.id) },
    ]);
  };

  const renderItem = ({ item }: { item: Tarefa }) => {
    const pc = prioridadeColor[item.prioridade];
    return (
      <View style={[styles.card, item.concluida && styles.cardDone]}>
        <View style={styles.cardTop}>
          <TouchableOpacity
            style={[styles.checkCircle, item.concluida && styles.checkDone]}
            onPress={() => toggleTarefa(item.id)}
          >
            {item.concluida && <FontAwesome5 name="check" size={10} color={Colors.bgPrimary} />}
          </TouchableOpacity>

          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, item.concluida && styles.cardTitleDone]}>
              {item.titulo}
            </Text>
            {item.descricao ? (
              <Text style={styles.cardDesc}>{item.descricao}</Text>
            ) : null}
            <View style={styles.cardMeta}>
              <View style={[styles.prioBadge, { backgroundColor: pc + '22' }]}>
                <FontAwesome5 name={prioridadeIcon[item.prioridade]} size={9} color={pc} />
                <Text style={[styles.prioText, { color: pc }]}>{item.prioridade}</Text>
              </View>
              {item.estufaNome && (
                <View style={styles.estufaTag}>
                  <FontAwesome5 name="warehouse" size={9} color={Colors.textMuted} />
                  <Text style={styles.estufaTagText}>{item.estufaNome}</Text>
                </View>
              )}
              <Text style={styles.dateText}>
                {new Date(item.dataAgendada).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.trashBtn}>
            <FontAwesome5 name="trash" size={13} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendamento de Tarefas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <FontAwesome5 name="plus" size={14} color={Colors.bgPrimary} />
        </TouchableOpacity>
      </View>

      {/* Resumo */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <FontAwesome5 name="clock" size={12} color={Colors.warning} />
          <Text style={styles.summaryText}>{pendentes.length} pendentes</Text>
        </View>
        <View style={styles.summaryChip}>
          <FontAwesome5 name="check-circle" size={12} color={Colors.success} />
          <Text style={styles.summaryText}>{concluidas.length} concluídas</Text>
        </View>
      </View>

      <FlatList
        data={[...pendentes, ...concluidas]}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="calendar-check" title="Sem tarefas agendadas" />
        }
      />

      {/* Modal Criar */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nova Tarefa</Text>
                <TouchableOpacity onPress={() => setModal(false)}>
                  <FontAwesome5 name="times" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Título *</Text>
              <TextInput
                style={styles.modalInput}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex: Verificar irrigação"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.modalLabel}>Descrição</Text>
              <TextInput
                style={[styles.modalInput, { height: 70, textAlignVertical: 'top' }]}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Detalhes da tarefa..."
                placeholderTextColor={Colors.textMuted}
                multiline
              />

              <Text style={styles.modalLabel}>Prioridade</Text>
              <View style={styles.prioRow}>
                {PRIORIDADES.map(p => {
                  const c = prioridadeColor[p];
                  return (
                    <SelectChip
                      key={p}
                      label={p}
                      isActive={prioridade === p}
                      onPress={() => setPrioridade(p)}
                      activeColor={c}
                    />
                  );
                })}
              </View>

              <Text style={styles.modalLabel}>Estufa (opcional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <SelectChip
                  label="Geral"
                  isActive={!estufaId}
                  onPress={() => setEstufaId('')}
                />
                {estufas.map(e => (
                  <SelectChip
                    key={e.id}
                    label={e.nome}
                    isActive={estufaId === e.id}
                    onPress={() => setEstufaId(e.id)}
                  />
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                <FontAwesome5 name="calendar-plus" size={14} color={Colors.bgPrimary} />
                <Text style={styles.saveBtnText}>Agendar Tarefa</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16,
    backgroundColor: Colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },

  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  summaryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgSecondary, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
  },
  summaryText: { fontSize: 12, color: Colors.textSecondary },

  list: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 10,
  },
  cardDone: { opacity: 0.6 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  cardTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  prioBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  prioText: { fontSize: 10, fontWeight: '700' },
  estufaTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  estufaTagText: { fontSize: 10, color: Colors.textMuted },
  dateText: { fontSize: 10, color: Colors.textMuted },
  trashBtn: { padding: 4 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay },
  modalScroll: { flexGrow: 1, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.bgSecondary, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  modalLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  modalInput: {
    backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15,
  },
  prioRow: { flexDirection: 'row', gap: 8 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: 12, height: 50, gap: 10, marginTop: 24,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.bgPrimary },
});
