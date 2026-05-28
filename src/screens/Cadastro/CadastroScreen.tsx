// ═══════════════════════════════════════════════════════════════
// Terra Nova — Cadastrar Lote de Cultivo (Create)
// Interface pura, sem erros de tag e com validação visual
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Platform, KeyboardAvoidingView
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
  Morango: '🍓', Soja: '🌱', Trigo: '🌾', Espinafre: '🥬',
};

export function CadastroScreen() {
  const { addLote, estufas } = useAppStore() as any;

  const [tipoCultura, setTipoCultura] = useState<TipoCultura | ''>('');
  const [estufaId, setEstufaId] = useState('');
  const [fase, setFase] = useState<FaseCrescimento>('Germinando');
  const [status, setStatus] = useState<StatusLote>('Saudável');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(''); 

  const estufaSelecionada = estufas.find((e: any) => e.id === estufaId);

  const handleCadastrar = () => {
    setErroValidacao('');

    if (!tipoCultura) {
      setErroValidacao('Por favor, selecione o tipo de cultura que será plantada.');
      return;
    }
    if (!estufaId) {
      setErroValidacao('Selecione a estufa onde o lote será alocado.');
      return;
    }
    
    const qtdNum = Number(quantidade);
    if (!quantidade || isNaN(qtdNum) || qtdNum <= 0) {
      setErroValidacao('Quantidade inválida! Digite apenas números maiores que zero.');
      return;
    }

    addLote({
      tipoCultura: tipoCultura,
      estufaId,
      estufaNome: estufaSelecionada?.nome || '',
      dataPlantio: new Date().toISOString().split('T')[0],
      fase,
      status,
      quantidade: qtdNum,
      observacoes,
    });

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
          <SuccessToast message="Lote cadastrado com sucesso!" visible={showSuccess} />

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
                onPress={() => { setTipoCultura(c); setErroValidacao(''); }}
              />
            ))}
          </View>

          <Text style={styles.label}>
            <FontAwesome5 name="warehouse" size={13} color={Colors.accent} /> Estufa *
          </Text>
          <View style={styles.estufaList}>
            {estufas.filter((e: any) => e.status === 'Operacional').map((e: any) => (
              <TouchableOpacity
                key={e.id}
                style={[styles.estufaOption, estufaId === e.id && styles.estufaOptionActive]}
                onPress={() => { setEstufaId(e.id); setErroValidacao(''); }}
                activeOpacity={0.7}
              >
                <View style={styles.estufaOptionLeft}>
                  <View style={[styles.estufaDot, { backgroundColor: Colors.success }]} />
                  <View>
                    <Text style={[styles.estufaOptionName, estufaId === e.id && { color: Colors.accent }]}>
                      {e.nome}
                    </Text>
                  </View>
                </View>
                {estufaId === e.id && (
                  <FontAwesome5 name="check-circle" size={16} color={Colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>

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

          <Text style={styles.label}>
            <FontAwesome5 name="cubes" size={13} color={Colors.accent} /> Quantidade *
          </Text>
          <TextInput
            style={[styles.input, erroValidacao.includes('Quantidade') && styles.inputError]}
            value={quantidade}
            onChangeText={(texto) => { setQuantidade(texto); setErroValidacao(''); }}
            keyboardType="numeric"
            placeholder="Ex: 100"
            placeholderTextColor={Colors.textMuted}
          />

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

          {erroValidacao !== '' && (
            <View style={styles.errorContainer}>
              <FontAwesome5 name="exclamation-triangle" size={14} color={Colors.danger} />
              <Text style={styles.errorText}>{erroValidacao}</Text>
            </View>
          )}

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
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 10, marginTop: 18 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  estufaList: { gap: 8 },
  estufaOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.bgSecondary, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border },
  estufaOptionActive: { borderColor: Colors.accent, backgroundColor: Colors.accentGlow },
  estufaOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  estufaDot: { width: 10, height: 10, borderRadius: 5 },
  estufaOptionName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: 12, color: Colors.textSecondary },
  input: { backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 14, color: Colors.textPrimary, fontSize: 15 },
  inputError: { borderColor: Colors.danger, backgroundColor: Colors.dangerBg },
  textArea: { height: 90, textAlignVertical: 'top' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.dangerBg, padding: 12, borderRadius: 8, marginTop: 16, marginBottom: 4, borderWidth: 1, borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 13, fontWeight: '600', flex: 1 },
});