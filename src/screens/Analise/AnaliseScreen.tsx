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
import { AnalisePanel } from '../../components/AnalisePanel';
import { useAppStore } from '../../store/useAppStore';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface AnaliseScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
}

interface ApiConfig {
  tipoApiNome: string;
  type: 'satveg' | 'nasa';
  title: string;
  description: string;
  buttonIcon: React.ComponentProps<typeof FontAwesome5>['name'];
  buttonText: string;
  buttonColor?: string;
  buttonTextColor?: string;
  sectionHeading: string;
  emptyMessage: string;
  subtitleGrafico: string;
  tipoParam: string;
  nomeExibicao: string;
}

export function AnaliseScreen({ navigation }: AnaliseScreenProps) {
  const {
    talhoes, dadosTemporais, requestApiAnalysis, fetchDadosTemporais, isLoading, localizacoes
  } = useAppStore();

  const [selectedTalhaoId, setSelectedTalhaoId] = useState<number | null>(
    talhoes.length > 0 ? talhoes[0].id : null
  );

  const [activeTab, setActiveTab] = useState<'satveg' | 'nasa'>('satveg');

  // Ao selecionar um talhão, busca os dados temporais do backend
  React.useEffect(() => {
    if (selectedTalhaoId) {
      fetchDadosTemporais(selectedTalhaoId);
    }
  }, [selectedTalhaoId]);

  const handleRunApi = async (tipoApiNome: string, tipoParam: string, nomeExibicao: string) => {
    if (!selectedTalhaoId) return;
    const res = await requestApiAnalysis({ tipoParam, tipoApiNome, idTalhao: selectedTalhaoId });
    if (res) Alert.alert('Sucesso', `Análise ${nomeExibicao} iniciada! Os dados temporais foram atualizados.`);
  };

  const API_CONFIGS: Record<'satveg' | 'nasa', ApiConfig> = {
    satveg: {
      tipoApiNome: "SATVEG",
      type: "satveg",
      title: "🛰️ Monitoramento de Índice de Vegetação (NDVI)",
      description: "Conecta com a série histórica de satélite da Embrapa SATveg usando a latitude e longitude do talhão para monitorar a saúde biológica da plantação.",
      buttonIcon: "sync-alt",
      buttonText: "Solicitar Telemetria SATveg",
      sectionHeading: "Dados de Vegetação Atuais",
      emptyMessage: "Nenhum dado temporal encontrado para este talhão.",
      subtitleGrafico: "Gráfico de NDVI",
      tipoParam: "NDVI",
      nomeExibicao: "SATveg",
    },
    nasa: {
      tipoApiNome: "NASAPOWER",
      type: "nasa",
      title: "☀️ Análise de Precipitação (NASA Power)",
      description: "Obtém dados climatológicos diários de precipitação (chuva em mm) diretamente dos satélites meteorológicos da NASA automaticamente (de 2020 até hoje).",
      buttonIcon: "cloud-download-alt",
      buttonText: "Solicitar Clima NASA",
      buttonColor: Colors.info,
      buttonTextColor: Colors.textPrimary,
      sectionHeading: "Dados Climáticos Atuais",
      emptyMessage: "Nenhum dado climático encontrado para este talhão.",
      subtitleGrafico: "Precipitação Corrigida",
      tipoParam: "PRECTOTCORR",
      nomeExibicao: "NASA Power",
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
        ) : activeTab ? (
          <AnalisePanel
            {...API_CONFIGS[activeTab]}
            selectedTalhao={selectedTalhao}
            selectedLoc={selectedLoc}
            onRunApi={() => handleRunApi(
              API_CONFIGS[activeTab].tipoApiNome, 
              API_CONFIGS[activeTab].tipoParam, 
              API_CONFIGS[activeTab].nomeExibicao
            )}
            dadosTemporais={dadosTemporais}
            navigation={navigation}
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
