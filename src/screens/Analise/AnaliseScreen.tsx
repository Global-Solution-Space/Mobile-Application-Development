// ═══════════════════════════════════════════════════════════════
// Terra Nova — Análise de Satélite (SATveg & NASA Power)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { TalhaoSelector } from '../../components/TalhaoSelector';
import { TabSelector } from '../../components/TabSelector';
import { SatVegPanel } from '../../components/SatVegPanel';
import { NasaPowerPanel } from '../../components/NasaPowerPanel';
import { useAppStore } from '../../store/useAppStore';

export function AnaliseScreen({ navigation }: any) {
  const {
    talhoes, satvegs, nasapowers, addSatVeg, addNasaPower,
    deleteSatVeg, deleteNasaPower, isLoading, localizacoes
  } = useAppStore();

  const [selectedTalhaoId, setSelectedTalhaoId] = useState<number | null>(
    talhoes.length > 0 ? talhoes[0].id : null
  );

  const [activeTab, setActiveTab] = useState<'satveg' | 'nasa'>('satveg');

  // Form states for NASA Power
  const [dataInicio, setDataInicio] = useState('2025-01-01');
  const [dataFim, setDataFim] = useState('2026-01-15');

  // Filter analyses for the selected Talhão & Sort recent first (Memoized to prevent lag)
  const talhaoSatvegs = useMemo(() => 
    [...satvegs]
      .filter(s => s.idTalhao === selectedTalhaoId)
      .sort((a, b) => b.id - a.id),
    [satvegs, selectedTalhaoId]
  );

  const talhaoNasapowers = useMemo(() => 
    [...nasapowers]
      .filter(n => n.idTalhao === selectedTalhaoId)
      .sort((a, b) => b.id - a.id),
    [nasapowers, selectedTalhaoId]
  );

  const handleRunSatVeg = async () => {
    if (!selectedTalhaoId) {
      Alert.alert('Erro', 'Selecione um talhão primeiro.');
      return;
    }
    const res = await addSatVeg(selectedTalhaoId);
    if (res) {
      Alert.alert('Sucesso', 'Análise SATveg concluída com sucesso!');
    } else {
      Alert.alert('Erro', 'Ocorreu um erro ao processar os dados do SATveg.');
    }
  };

  const handleRunNasaPower = async () => {
    if (!selectedTalhaoId) {
      Alert.alert('Erro', 'Selecione um talhão primeiro.');
      return;
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dataInicio) || !dateRegex.test(dataFim)) {
      Alert.alert('Erro', 'As datas devem estar no formato AAAA-MM-DD.');
      return;
    }

    const res = await addNasaPower(selectedTalhaoId, dataInicio, dataFim);
    if (res) {
      Alert.alert('Sucesso', 'Análise NASA Power concluída com sucesso!');
    } else {
      Alert.alert('Erro', 'Ocorreu um erro ao processar os dados da NASA.');
    }
  };

  const selectedTalhao = useMemo(() => 
    talhoes.find(t => t.id === selectedTalhaoId),
    [talhoes, selectedTalhaoId]
  );
  
  const selectedLoc = useMemo(() => 
    selectedTalhao ? localizacoes.find(l => l.id === selectedTalhao.idLocalizacao) : null,
    [selectedTalhao, localizacoes]
  );

  return (
    <View style={styles.container}>
      <Header title="Análise do Talhão" />

      {/* Select Talhão Header Selector */}
      <TalhaoSelector 
        talhoes={talhoes} 
        selectedTalhaoId={selectedTalhaoId} 
        onSelect={setSelectedTalhaoId} 
      />

      {/* Tab Switcher */}
      <TabSelector 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Processando integração geoespacial...</Text>
          </View>
        ) : !selectedTalhaoId ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="seedling" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Sem Talhão Selecionado</Text>
            <Text style={styles.emptySubtitle}>Cadastre ou selecione um talhão para iniciar a telemetria espacial.</Text>
          </View>
        ) : activeTab === 'satveg' ? (
          <SatVegPanel
            selectedTalhao={selectedTalhao}
            selectedLoc={selectedLoc}
            onRunSatVeg={handleRunSatVeg}
            talhaoSatvegs={talhaoSatvegs}
            onDeleteSatVeg={deleteSatVeg}
            navigation={navigation}
          />
        ) : (
          <NasaPowerPanel
            selectedTalhao={selectedTalhao}
            selectedLoc={selectedLoc}
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
            onRunNasaPower={handleRunNasaPower}
            talhaoNasapowers={talhaoNasapowers}
            onDeleteNasaPower={deleteNasaPower}
            navigation={navigation}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  infoCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgTertiary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  gpsText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.bgPrimary,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  noHistoryText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.textPrimary,
    fontSize: 13,
    marginBottom: 6,
  },
});
