import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { useAppStore } from '../../store/useAppStore';

export function TarefasScreen() {
  const navigation = useNavigation<any>();
  const store = useAppStore() as any;
  
  const tarefas = store.tarefas || [];
  const toggleTarefa = store.toggleTarefa || (() => {});
  const deleteTarefa = store.deleteTarefa || (() => {});
  const addTarefa = store.addTarefa || (() => {});

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [prioridade, setPrioridade] = useState('Normal');

  const handleSalvar = () => {
    if (titulo.trim() === '') return;
    
    addTarefa({
      id: Date.now().toString(),
      titulo: titulo,
      prioridade: prioridade,
      talhao: 'Geral',
      concluida: false,
    });

    setTitulo('');
    setPrioridade('Normal');
    setIsFormVisible(false);
  };

  const pendentes = tarefas.filter((t: any) => !t.concluida);
  const concluidas = tarefas.filter((t: any) => t.concluida);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#10B981" />
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
                <FontAwesome5 name="times" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Ex: Verificar sensores do talhão..."
              placeholderTextColor="#64748B"
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
            <FontAwesome5 name="plus" size={16} color="#0A1F16" />
            <Text style={styles.addBtnText}>Nova Tarefa</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>
          <FontAwesome5 name="clock" size={14} color="#F59E0B" /> Pendentes ({pendentes.length})
        </Text>
        
        {pendentes.length === 0 && (
          <Text style={styles.emptyText}>Tudo em dia por aqui!</Text>
        )}

        {pendentes.map((tarefa: any) => (
          <View key={tarefa.id} style={styles.taskCard}>
            <TouchableOpacity onPress={() => toggleTarefa(tarefa.id)} style={styles.checkBtn}>
              <FontAwesome5 name="square" size={20} color="#64748B" />
            </TouchableOpacity>
            
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{tarefa.titulo}</Text>
              <View style={styles.taskMeta}>
                <Text style={styles.metaText}>{tarefa.talhaoNome || tarefa.talhao || 'Geral'}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={[
                  styles.metaText, 
                  tarefa.prioridade === 'Urgente' && { color: '#EF4444' }
                ]}>
                  {tarefa.prioridade}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => deleteTarefa(tarefa.id)} style={styles.deleteBtn}>
              <FontAwesome5 name="trash" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          <FontAwesome5 name="check-double" size={14} color="#10B981" /> Concluídas ({concluidas.length})
        </Text>
        
        {concluidas.map((tarefa: any) => (
          <View key={tarefa.id} style={[styles.taskCard, styles.taskCardDone]}>
            <TouchableOpacity onPress={() => toggleTarefa(tarefa.id)} style={styles.checkBtn}>
              <FontAwesome5 name="check-square" size={20} color="#10B981" />
            </TouchableOpacity>
            
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, styles.taskTitleDone]}>{tarefa.titulo}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteTarefa(tarefa.id)} style={styles.deleteBtn}>
              <FontAwesome5 name="trash" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#091811' },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A1F16' },
  backBtn: { paddingLeft: 16, justifyContent: 'center', height: '100%', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 50 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 14,
    gap: 8, marginBottom: 24,
  },
  addBtnText: { color: '#0A1F16', fontSize: 16, fontWeight: 'bold' },

  formContainer: {
    backgroundColor: '#0A1F16', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#11422B', marginBottom: 24,
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  input: {
    backgroundColor: '#091811', borderRadius: 8, padding: 12,
    color: '#FFFFFF', borderWidth: 1, borderColor: '#11422B',
    marginBottom: 16,
  },
  label: { color: '#64748B', fontSize: 12, marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    borderWidth: 1, borderColor: '#11422B',
  },
  chipActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  chipText: { color: '#64748B', fontSize: 12 },
  chipTextActive: { color: '#0A1F16', fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#10B981', borderRadius: 8, paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: { color: '#0A1F16', fontWeight: 'bold' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  emptyText: { color: '#64748B', fontStyle: 'italic', marginBottom: 12 },
  
  taskCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A1F16',
    borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#11422B',
  },
  taskCardDone: { opacity: 0.6, backgroundColor: '#091811' },
  checkBtn: { paddingRight: 12 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 15, color: '#FFFFFF', fontWeight: '500' },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#64748B' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  metaText: { fontSize: 11, color: '#64748B' },
  metaDot: { fontSize: 11, color: '#64748B' },
  deleteBtn: { paddingLeft: 12 },
});