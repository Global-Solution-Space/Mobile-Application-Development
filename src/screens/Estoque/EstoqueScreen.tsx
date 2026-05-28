// ═══════════════════════════════════════════════════════════════
// Terra Nova — Controle de Estoque de Insumos
// Com validações de UX aprimoradas (Mensagens Específicas)
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { SelectChip } from '../../components/SelectChip';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

const TIPOS_INSUMO = ['Semente', 'Fertilizante', 'Nutriente', 'Defensivo'];
const UNIDADES = ['kg', 'L', 'pct', 'un'];

const iconeTipo: Record<string, string> = {
  Semente: 'seedling', Fertilizante: 'flask', Nutriente: 'leaf', Defensivo: 'shield-alt'
};

export function EstoqueScreen() {
  const { insumos, addInsumo, updateInsumo, deleteInsumo } = useAppStore() as any;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Fertilizante');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('kg');
  const [qtdMinima, setQtdMinima] = useState('');
  const [erro, setErro] = useState('');

  const totalItens = insumos.length;
  const itensAbaixoMinimo = insumos.filter((i: any) => i.quantidade <= i.quantidadeMinima).length;

  const openAddForm = () => {
    setEditId(null); setNome(''); setTipo('Fertilizante');
    setQuantidade(''); setUnidade('kg'); setQtdMinima(''); setErro('');
    setShowForm(true);
  };

  const openEditForm = (item: any) => {
    setEditId(item.id); setNome(item.nome); setTipo(item.tipo);
    setQuantidade(item.quantidade.toString()); setUnidade(item.unidade);
    setQtdMinima(item.quantidadeMinima.toString()); setErro('');
    setShowForm(true);
  };

  const handleSave = () => {
    setErro(''); // Limpa o erro antes de testar
    
    // ── VALIDAÇÕES DE UX MELHORADAS ──
    if (!nome) { 
      setErro('Por favor, informe o nome do insumo.'); 
      return; 
    }
    
    if (quantidade === '') {
      setErro('O campo "Quantidade" não pode ficar vazio.');
      return;
    }
    const qtdNum = Number(quantidade);
    if (isNaN(qtdNum)) {
      setErro('Atenção: A "Quantidade" deve conter apenas números.');
      return;
    }

    if (qtdMinima === '') {
      setErro('O campo "Alerta de Estoque Baixo" não pode ficar vazio.');
      return;
    }
    const minNum = Number(qtdMinima);
    if (isNaN(minNum)) {
      setErro('Atenção: O "Alerta de Estoque Baixo" deve conter apenas números.');
      return;
    }

    // Se passou por tudo, salva no sistema!
    const payload = { nome, tipo, quantidade: qtdNum, unidade, quantidadeMinima: minNum };

    if (editId) {
      updateInsumo(editId, payload);
    } else {
      addInsumo(payload);
    }
    setShowForm(false);
  };

  if (showForm) {
    return (
      <View style={styles.container}>
        <Header title={editId ? "Editar Insumo" : "Novo Insumo"} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={styles.formContainer}>
            
            <Text style={styles.label}>Nome do Produto *</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Adubo NPK 10-10-10" placeholderTextColor={Colors.textMuted} />

            <Text style={styles.label}>Tipo de Insumo *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {TIPOS_INSUMO.map(t => (
                <SelectChip key={t} label={t} isActive={tipo === t} onPress={() => setTipo(t)} />
              ))}
            </ScrollView>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Quantidade *</Text>
                <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="Ex: 50" placeholderTextColor={Colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Unidade *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
                  {UNIDADES.map(u => (
                    <TouchableOpacity key={u} style={[styles.miniChip, unidade === u && styles.miniChipActive]} onPress={() => setUnidade(u)}>
                      <Text style={[styles.miniChipText, unidade === u && styles.miniChipTextActive]}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <Text style={styles.label}>Alerta de Estoque Baixo (Mínimo) *</Text>
            <TextInput style={styles.input} value={qtdMinima} onChangeText={setQtdMinima} keyboardType="numeric" placeholder="Avisar quando chegar em..." placeholderTextColor={Colors.textMuted} />

            {erro !== '' && (
              <View style={styles.errorBox}>
                <FontAwesome5 name="exclamation-triangle" size={14} color={Colors.danger} />
                <Text style={styles.errorText}>{erro}</Text>
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <FontAwesome5 name="save" size={14} color={Colors.bgPrimary} />
                <Text style={styles.saveBtnText}>Salvar Insumo</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Estoque" />
      
      <View style={styles.statsBar}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalItens}</Text>
            <Text style={styles.statLabel}>Itens</Text>
          </View>
          <View style={[styles.statItem, { borderLeftWidth: 1, borderLeftColor: Colors.border, paddingLeft: 16 }]}>
            <Text style={[styles.statNumber, { color: itensAbaixoMinimo > 0 ? Colors.warning : Colors.success }]}>
              {itensAbaixoMinimo}
            </Text>
            <Text style={styles.statLabel}>Abaixo do mín.</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAddForm}>
          <FontAwesome5 name="plus" size={16} color={Colors.bgPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={insumos}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="boxes" title="Estoque vazio" subtitle="Cadastre insumos tocando no botão +" />}
        renderItem={({ item }: any) => {
          const isCritico = item.quantidade <= item.quantidadeMinima;

          return (
            <View style={[styles.card, isCritico && styles.cardCritico]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <FontAwesome5 name={iconeTipo[item.tipo] || 'box'} size={16} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardType}>{item.tipo}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => openEditForm(item)} style={styles.iconBtn}>
                    <FontAwesome5 name="edit" size={14} color={Colors.info} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteInsumo(item.id)} style={styles.iconBtn}>
                    <FontAwesome5 name="trash" size={14} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.qtdLabel}>Em Estoque</Text>
                  <Text style={[styles.qtdValue, isCritico && { color: Colors.danger }]}>
                    {item.quantidade} <Text style={{ fontSize: 14 }}>{item.unidade}</Text>
                  </Text>
                </View>
                {isCritico && (
                  <View style={styles.alertaBadge}>
                    <FontAwesome5 name="exclamation-circle" size={12} color={Colors.danger} />
                    <Text style={styles.alertaText}>Estoque Baixo</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: Colors.border },
  statsRow: { flexDirection: 'row', gap: 16 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700', color: Colors.accent },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  
  list: { padding: 16, paddingBottom: 100 },

  card: { backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  cardCritico: { borderColor: Colors.danger, backgroundColor: Colors.dangerBg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.bgTertiary, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  cardType: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 6 },
  iconBtn: { padding: 8, backgroundColor: Colors.bgPrimary, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  qtdLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  qtdValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  alertaBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  alertaText: { fontSize: 11, color: Colors.danger, fontWeight: '700' },

  formContainer: { padding: 20 },
  label: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15 },
  chipScroll: { marginBottom: 4 },
  row: { flexDirection: 'row', gap: 12 },
  miniChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  miniChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  miniChipText: { fontSize: 13, color: Colors.textSecondary },
  miniChipTextActive: { color: Colors.accent, fontWeight: '700' },
  
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.dangerBg, padding: 12, borderRadius: 8, marginTop: 16, borderWidth: 1, borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 13, fontWeight: '600', flex: 1 },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 30 },
  cancelBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgTertiary, borderRadius: 12, height: 50, borderWidth: 1, borderColor: Colors.border },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  saveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent, borderRadius: 12, height: 50, gap: 8 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.bgPrimary },
});