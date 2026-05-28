// ═══════════════════════════════════════════════════════════════
// Terra Nova — Cadastrar Lote de Cultivo (Create)
// Formulário para registrar um novo plantio
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { SuccessToast } from '../../components/SuccessToast';
import { SelectChip } from '../../components/SelectChip';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { TipoCultura, FaseCrescimento, StatusLote } from '../../types';

const CULTURAS: TipoCultura[] = ['Batata', 'Tomate', 'Alface', 'Cenoura', 'Morango', 'Soja', 'Trigo', 'Espinafre'];
const FASES: FaseCrescimento[] = ['Germinando', 'Crescendo', 'Maduro', 'Pronto para Colheita'];
const STATUS: StatusLote[] = ['Saudável', 'Atenção', 'Crítico'];

const culturaEmoji: Record<string, string> = {
  Batata: '🥔', Tomate: '🍅', Alface: '🥬', Cenoura: '🥕',
  Morango: '🍓', Soja: '🫘', Trigo: '🌾', Espinafre: '🥬',
};

export function CadastroScreen() {
  const { addLote, estufas } = useAppStore();

  const [tipoCultura, setTipoCultura] = useState<TipoCultura | ''>('');
  const [estufaId, setEstufaId] = useState('');
  const [fase, setFase] = useState<FaseCrescimento>('Germinando');
  const [status, setStatus] = useState<StatusLote>('Saudável');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const estufaSelecionada = estufas.find(e => e.id === estufaId);

  const handleCadastrar = () => {
    if (!tipoCultura) {
      Alert.alert('Campo obrigatório', 'Selecione o tipo de cultura.');
      return;
    }
    if (!estufaId) {
      Alert.alert('Campo obrigatório', 'Selecione uma estufa.');
      return;
    }
    const qtdNum = Number(quantidade);
    if (!quantidade || isNaN(qtdNum) || qtdNum <= 0) {
      Alert.alert('Campo obrigatório', 'Informe uma quantidade válida (> 0).');
      return;
    }

    addLote({
      tipoCultura: tipoCultura as TipoCultura,
      estufaId,
      estufaNome: estufaSelecionada?.nome || '',
      dataPlantio: new Date().toISOString().split('T')[0],
      fase,
      status,
      quantidade: qtdNum,
      observacoes,
    });

    // Reset
    setTipoCultura('');
    setEstufaId('');
    setFase('Germinando');
    setStatus('Saudável');
    setQuantidade('');
    setObservacoes('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <View style={styles.container}>
      <Header title="Cadastrar Lote" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* ── Success Toast ─── */}
        <SuccessToast message="Lote cadastrado com sucesso!" visible={showSuccess} />

        {/* ── Tipo de Cultura ─── */}
        <Text style={styles.label}>
          <FontAwesome5 name="leaf" size={13} color={Colors.accent} /> Tipo de Cultura *
        </Text>
        <View style={styles.chipGrid}>
          {CULTURAS.map(c => (
            <SelectChip
              key={c}
              label={c}
              emoji={culturaEmoji[c]}
              isActive={tipoCultura === c}
              onPress={() => setTipoCultura(c)}
            />
          ))}
        </View>

        {/* ── Estufa ─── */}
        <Text style={styles.label}>
          <FontAwesome5 name="warehouse" size={13} color={Colors.accent} /> Estufa *
        </Text>
        <View style={styles.estufaList}>
          {estufas.filter(e => e.status === 'Operacional').map(e => (
            <TouchableOpacity
              key={e.id}
              style={[styles.estufaOption, estufaId === e.id && styles.estufaOptionActive]}
              onPress={() => setEstufaId(e.id)}
              activeOpacity={0.7}
            >
              <View style={styles.estufaOptionLeft}>
                <View style={[styles.estufaDot, { backgroundColor: Colors.success }]} />
                <View>
                  <Text style={[styles.estufaOptionName, estufaId === e.id && { color: Colors.accent }]}>
                    {e.nome}
                  </Text>
                  <Text style={styles.estufaOptionType}>{e.tipo}</Text>
                </View>
              </View>
              {estufaId === e.id && (
                <FontAwesome5 name="check-circle" size={16} color={Colors.accent} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Fase ─── */}
        <Text style={styles.label}>
          <FontAwesome5 name="sync" size={13} color={Colors.accent} /> Fase Inicial
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FASES.map(f => (
            <SelectChip
              key={f}
              label={f}
              isActive={fase === f}
              onPress={() => setFase(f)}
            />
          ))}
        </ScrollView>

        {/* ── Status ─── */}
        <Text style={[styles.label, { marginTop: 18 }]}>
          <FontAwesome5 name="heartbeat" size={13} color={Colors.accent} /> Status Inicial
        </Text>
        <View style={styles.statusRow}>
          {STATUS.map(s => {
            const c = s === 'Saudável' ? Colors.success : s === 'Atenção' ? Colors.warning : Colors.danger;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.statusChip, status === s && { backgroundColor: c + '22', borderColor: c }]}
                onPress={() => setStatus(s)}
              >
                <View style={[styles.statusDot, { backgroundColor: c }]} />
                <Text style={[styles.statusChipText, status === s && { color: c }]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Quantidade ─── */}
        <Text style={styles.label}>
          <FontAwesome5 name="cubes" size={13} color={Colors.accent} /> Quantidade *
        </Text>
        <TextInput
          style={styles.input}
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
          placeholder="Ex: 100"
          placeholderTextColor={Colors.textMuted}
        />

        {/* ── Observações ─── */}
        <Text style={styles.label}>
          <FontAwesome5 name="sticky-note" size={13} color={Colors.accent} /> Observações
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Anotações sobre o plantio..."
          placeholderTextColor={Colors.textMuted}
          multiline
        />

        {/* ── Botão ─── */}
        <PrimaryButton
          title="Cadastrar Lote"
          icon="plus-circle"
          onPress={handleCadastrar}
        />

        <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  successToast: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.successBg, borderRadius: 12,
    padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.success,
  },
  successText: { fontSize: 14, color: Colors.success, fontWeight: '600' },

  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 10, marginTop: 18 },

  // Culturas
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cultureChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  cultureChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  cultureEmoji: { fontSize: 18 },
  cultureChipText: { fontSize: 13, color: Colors.textSecondary },
  cultureChipTextActive: { color: Colors.accent, fontWeight: '700' },

  // Estufas
  estufaList: { gap: 8 },
  estufaOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.bgSecondary, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  estufaOptionActive: { borderColor: Colors.accent, backgroundColor: Colors.accentGlow },
  estufaOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  estufaDot: { width: 10, height: 10, borderRadius: 5 },
  estufaOptionName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  estufaOptionType: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  // Fase
  faseChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border, marginRight: 8,
  },
  faseChipActive: { backgroundColor: Colors.accentGlow, borderColor: Colors.accent },
  faseChipText: { fontSize: 12, color: Colors.textSecondary },
  faseChipTextActive: { color: Colors.accent, fontWeight: '700' },

  // Status
  statusRow: { flexDirection: 'row', gap: 8 },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
    backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: 12, color: Colors.textSecondary },

  // Inputs
  input: {
    backgroundColor: Colors.bgInput, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 14,
    color: Colors.textPrimary, fontSize: 15,
  },
  textArea: { height: 90, textAlignVertical: 'top' },

  // Submit
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: 12, height: 54, gap: 10, marginTop: 28,
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: Colors.bgPrimary },
});