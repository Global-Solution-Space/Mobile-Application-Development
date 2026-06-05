import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { FormInput } from '../../components/FormInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAppStore } from '../../store/useAppStore';
import { z } from 'zod';
import { ValidationError } from '../../components/ValidationError';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface CriarAlertaScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CriarAlerta'>;
  route: RouteProp<RootStackParamList, 'CriarAlerta'>;
}

const alertaSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter no mínimo 3 caracteres').max(100, 'Máximo de 100 caracteres'),
  descricao: z.string().min(5, 'A descrição deve ter no mínimo 5 caracteres').max(300, 'Máximo de 300 caracteres'),
  nivelAlerta: z.enum(['BAIXO', 'MEDIO', 'ALTO', 'CRITICO']),
  idTalhao: z.number().min(1, 'Selecione um Talhão válido'),
});

export function CriarAlertaScreen({ navigation, route }: CriarAlertaScreenProps) {
  const { addAlerta, updateAlerta, alertas, talhoes } = useAppStore();
  
  const editId = route.params?.editAlertaId;
  const alertaToEdit = editId ? alertas.find(a => a.id === editId) : null;

  const [titulo, setTitulo] = useState(alertaToEdit?.titulo || '');
  const [descricao, setDescricao] = useState(alertaToEdit?.descricao || '');
  const [nivelAlerta, setNivelAlerta] = useState<'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'>((alertaToEdit?.nivelAlerta as 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO') || 'MEDIO');
  const [idTalhao, setIdTalhao] = useState<number | null>(alertaToEdit?.idTalhao || (talhoes.length > 0 ? talhoes[0].id : null));
  const [erro, setErro] = useState('');

  const isEditing = !!editId;

  const handleSaveAlerta = async () => {
    try {
      const parsed = alertaSchema.parse({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        nivelAlerta,
        idTalhao
      });

      let success = false;
      
      if (isEditing && editId) {
        success = await updateAlerta(editId, {
          titulo: parsed.titulo,
          descricao: parsed.descricao,
          nivelAlerta: parsed.nivelAlerta,
          idTalhao: parsed.idTalhao,
          resolvido: alertaToEdit?.resolvido || 'N'
        });
      } else {
        success = await addAlerta({
          titulo: parsed.titulo,
          descricao: parsed.descricao,
          nivelAlerta: parsed.nivelAlerta,
          resolvido: 'N',
          idTalhao: parsed.idTalhao
        });
      }

      if (success) {
        navigation.goBack();
      } else {
        setErro(isEditing ? 'Erro de conexão ao atualizar alerta.' : 'Erro de conexão ao salvar alerta.');
      }
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        setErro(e.issues[0].message);
      }
    }
  };

  const levels: Array<'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'> = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'BAIXO': return Colors.info;
      case 'MEDIO': return Colors.warning;
      case 'ALTO': return Colors.danger;
      case 'CRITICO': return Colors.critical;
      default: return Colors.accent;
    }
  };

  return (
    <View style={styles.container}>
      <Header title={isEditing ? "Editar Alerta" : "Cadastrar Novo Alerta"} showBackButton />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DETALHES DO EVENTO</Text>
            
            <View style={{ gap: 16 }}>
              <FormInput
                label="Título do Alerta *"
                iconName="exclamation-triangle"
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex: Praga Detectada, Falha de Irrigação"
              />

              <FormInput
                label="Descrição Detalhada *"
                iconName="align-left"
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva o que ocorreu no talhão..."
                multiline
                numberOfLines={3}
                maxLength={300}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CLASSIFICAÇÃO E VÍNCULO</Text>

            <Text style={styles.label}>Nível de Severidade *</Text>
            <View style={styles.levelsRow}>
              {levels.map(lvl => (
                <TouchableOpacity
                  key={lvl}
                  style={[
                    styles.levelBtn,
                    nivelAlerta === lvl && { backgroundColor: getLevelColor(lvl), borderColor: getLevelColor(lvl) }
                  ]}
                  onPress={() => setNivelAlerta(lvl)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.levelBtnText, nivelAlerta === lvl && styles.levelBtnTextActive]}>{lvl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Selecione o Talhão Afetado *</Text>
            {talhoes.length === 0 ? (
              <Text style={styles.emptyWarningText}>Não há talhões cadastrados. Cadastre um talhão primeiro.</Text>
            ) : (
              <View style={styles.talhoesScroll}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {talhoes.map(t => (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.talhaoChip, idTalhao === t.id && styles.talhaoChipActive]}
                      onPress={() => setIdTalhao(t.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.talhaoChipText, idTalhao === t.id && styles.talhaoChipTextActive]}>
                        {t.nomeTalhao}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <ValidationError message={erro} onClear={() => setErro('')} />

          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                title="Voltar"
                icon="arrow-left"
                variant="outline"
                onPress={() => navigation.goBack()}
              />
            </View>
            <View style={{ flex: 2 }}>
              <PrimaryButton
                title={isEditing ? "Salvar Alterações" : "Emitir Alerta"}
                icon={isEditing ? "save" : "bullhorn"}
                onPress={handleSaveAlerta}
                disabled={talhoes.length === 0}
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingBottom: 60 },
  
  section: {
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '700',
    color: Colors.accent, letterSpacing: 1.5, marginBottom: 16,
  },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, marginTop: 4 },

  levelsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  levelBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  levelBtnText: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  levelBtnTextActive: { color: Colors.textPrimary },

  talhoesScroll: { flexDirection: 'row', marginBottom: 8 },
  talhaoChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  talhaoChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  talhaoChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  talhaoChipTextActive: { color: Colors.bgPrimary },

  emptyWarningText: { fontSize: 13, color: Colors.danger, fontStyle: 'italic', marginBottom: 16 },

  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
});
