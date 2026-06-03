import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../theme/colors';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Tarefa } from '../../types';

export function TarefasScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { tarefas, toggleTarefa, deleteTarefa, addTarefa } = useAppStore();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [prioridade, setPrioridade] = useState('Normal');

  const handleSalvar = () => {
    if (titulo.trim() === '') return;

    addTarefa({
      titulo: titulo,
      prioridade: prioridade,
      talhao: 'Geral',
      concluida: false,
    });

    setTitulo('');
    setPrioridade('Normal');
    setIsFormVisible(false);
  };

  const pendentes = tarefas.filter((t) => !t.concluida);
  const concluidas = tarefas.filter((t) => t.concluida);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color={Colors.accent} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Header title="Gestão de Tarefas" />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {isFormVisible ? (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Nova Tarefa</Text>
              <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                <FontAwesome5 name="times" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Ex: Verificar sensores do talhão..."
              placeholderTextColor={Colors.textMuted}
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.label}>Prioridade:</Text>
            <View style={styles.chipRow}>
              {['Baixa', 'Normal', 'Urgente'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, prioridade === p && styles.chipActive]}
                  onPress={() => setPrioridade(p)}
                >
                  <Text style={[styles.chipText, prioridade === p && styles.chipTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
              <Text style={styles.saveBtnText}>Salvar Tarefa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => setIsFormVisible(true)} activeOpacity={0.8}>
            <FontAwesome5 name="plus" size={16} color={Colors.bgPrimary} />
            <Text style={styles.addBtnText}>Nova Tarefa</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>
          <FontAwesome5 name="clock" size={14} color={Colors.warning} /> Pendentes ({pendentes.length})
        </Text>

        {pendentes.length === 0 && (
          <Text style={styles.emptyText}>Tudo em dia por aqui!</Text>
        )}

        {pendentes.map((tarefa: Tarefa) => (
          <View key={tarefa.id} style={styles.taskCard}>
            <TouchableOpacity onPress={() => toggleTarefa(tarefa.id)} style={styles.checkBtn}>
              <FontAwesome5 name="square" size={20} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{tarefa.titulo}</Text>
              <View style={styles.taskMeta}>
                <Text style={styles.metaText}>{tarefa.talhao || 'Geral'}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={[
                  styles.metaText,
                  tarefa.prioridade === 'Urgente' && { color: Colors.danger }
                ]}>
                  {tarefa.prioridade}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => deleteTarefa(tarefa.id)} style={styles.deleteBtn}>
              <FontAwesome5 name="trash" size={16} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          <FontAwesome5 name="check-double" size={14} color={Colors.accent} /> Concluídas ({concluidas.length})
        </Text>

        {concluidas.map((tarefa: Tarefa) => (
          <View key={tarefa.id} style={[styles.taskCard, styles.taskCardDone]}>
            <TouchableOpacity onPress={() => toggleTarefa(tarefa.id)} style={styles.checkBtn}>
              <FontAwesome5 name="check-square" size={20} color={Colors.accent} />
            </TouchableOpacity>

            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, styles.taskTitleDone]}>{tarefa.titulo}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteTarefa(tarefa.id)} style={styles.deleteBtn}>
              <FontAwesome5 name="trash" size={16} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgSecondary },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgPrimary },
  backBtn: { paddingLeft: 16, justifyContent: 'center', height: '100%', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 50 },

  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent, borderRadius: 12, paddingVertical: 14, gap: 8, marginBottom: 24, },
  addBtnText: { color: Colors.bgPrimary, fontSize: 16, fontWeight: 'bold' },
  formContainer: { backgroundColor: Colors.bgPrimary, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 24, },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  input: { backgroundColor: Colors.bgSecondary, borderRadius: 8, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, },
  label: { color: Colors.textSecondary, fontSize: 12, marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { color: Colors.textSecondary, fontSize: 12 },
  chipTextActive: { color: Colors.bgPrimary, fontWeight: 'bold' },
  saveBtn: { backgroundColor: Colors.accent, borderRadius: 8, paddingVertical: 12, alignItems: 'center', },
  saveBtnText: { color: Colors.bgPrimary, fontWeight: 'bold' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  emptyText: { color: Colors.textMuted, fontStyle: 'italic', marginBottom: 12 },

  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgPrimary, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, },
  taskCardDone: { opacity: 0.6, backgroundColor: Colors.bgSecondary },
  checkBtn: { paddingRight: 12 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  metaText: { fontSize: 11, color: Colors.textMuted },
  metaDot: { fontSize: 11, color: Colors.textMuted },
  deleteBtn: { paddingLeft: 12 },
});