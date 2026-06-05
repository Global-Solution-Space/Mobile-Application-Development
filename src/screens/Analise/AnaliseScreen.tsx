// ═══════════════════════════════════════════════════════════════
// Terra Nova — Análise de Satélite (SATveg & NASA Power)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { TalhaoSelector } from '../../components/TalhaoSelector';
import { TabSelector } from '../../components/TabSelector';
import { AnalisePanel } from '../../components/AnalisePanel';
import { useAppStore } from '../../store/useAppStore';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface AnaliseScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
}

import { TELEMETRY_CONFIGS } from '../../constants/telemetria';

export function AnaliseScreen({ navigation }: AnaliseScreenProps) {
  const {
    talhoes, dadosTemporais, reqApis, requestApiAnalysis, fetchDadosTemporaisEHistórico, isLoading, localizacoes, deleteReqApi
  } = useAppStore();

  const [selectedTalhaoId, setSelectedTalhaoId] = useState<number | null>(
    talhoes.length > 0 ? talhoes[0].id : null
  );

  const [activeTab, setActiveTab] = useState<'satveg' | 'nasa'>('satveg');

  // Ao selecionar um talhão, busca os dados temporais do backend
  useEffect(() => {
    if (selectedTalhaoId) {
      fetchDadosTemporaisEHistórico(selectedTalhaoId);
    }
  }, [selectedTalhaoId]);

  const handleRunApi = async (tipoApiNome: string, tipoParam: string) => {
    if (!selectedTalhaoId) return;
    await requestApiAnalysis({ tipoParam, tipoApiNome, idTalhao: selectedTalhaoId });
  };

  const handleDeleteAnalysis = (id: number) => {
    Alert.alert(
      'Excluir Análise',
      'Tem certeza que deseja excluir esta análise geoespacial e todos os seus dados de telemetria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteReqApi(id) }
      ]
    );
  };

  const selectedTalhao = talhoes.find(t => t.id === selectedTalhaoId);
  const selectedLoc = selectedTalhao ? localizacoes.find(l => l.id === selectedTalhao.idLocalizacao) : null;

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
        ) : activeTab ? (
          <AnalisePanel
            {...TELEMETRY_CONFIGS[activeTab]}
            type={activeTab}
            selectedTalhao={selectedTalhao}
            selectedLoc={selectedLoc}
            onRunApi={() => handleRunApi(
              TELEMETRY_CONFIGS[activeTab].tipoApiNome, 
              TELEMETRY_CONFIGS[activeTab].tipoParam, 
            )}
            dadosTemporais={dadosTemporais}
            reqApis={reqApis}
            navigation={navigation}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        ) : null}
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
});
