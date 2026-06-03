import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { TelemetriaHistoryCard } from '../TelemetriaHistoryCard';
import { Talhao, Localizacao, NasaPower } from '../../types';

interface NasaPowerPanelProps {
  selectedTalhao?: Talhao;
  selectedLoc?: Localizacao | null;
  dataInicio: string;
  setDataInicio: (val: string) => void;
  dataFim: string;
  setDataFim: (val: string) => void;
  onRunNasaPower: () => void;
  talhaoNasapowers: NasaPower[];
  onDeleteNasaPower: (id: number) => void;
  navigation: any;
}

export function NasaPowerPanel({
  selectedTalhao,
  selectedLoc,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  onRunNasaPower,
  talhaoNasapowers,
  onDeleteNasaPower,
  navigation
}: NasaPowerPanelProps) {

  const renderHistoryCard = useCallback(({ item }: any) => (
    <TelemetriaHistoryCard
      id={item.id}
      type="nasa"
      title={`Análise climática #${item.id}`}
      subtitle={`Realizada em: ${item.dataAnalise ? new Date(item.dataAnalise).toLocaleDateString('pt-BR') : 'N/D'} | Período: ${item.dataInicio} até ${item.dataFim}`}
      dados={item.dados || {}}
      onDelete={() => onDeleteNasaPower(item.id)}
      onPressViewAll={() => navigation.navigate('AnaliseDetalhes', {
        type: 'nasa',
        id: item.id,
        title: `Análise climática #${item.id}`,
        subtitle: `Realizada em: ${item.dataAnalise ? new Date(item.dataAnalise).toLocaleDateString('pt-BR') : 'N/D'} | Período: ${item.dataInicio} até ${item.dataFim}`,
        dados: item.dados || {}
      })}
    />
  ), [onDeleteNasaPower, navigation]);

  return (
    <FlatList
      data={talhaoNasapowers}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>☀️ Análise de Precipitação (NASA Power)</Text>
            <Text style={styles.cardDescription}>
              Obtém dados climatológicos diários de precipitação (chuva em mm) diretamente dos satélites meteorológicos da NASA para o período selecionado.
            </Text>

            {selectedTalhao && (
              <View style={[styles.gpsBadge, { marginBottom: 12 }]}>
                <FontAwesome5 name="map-marker-alt" size={11} color={Colors.accent} />
                <Text style={styles.gpsText}>
                  Coordenadas: {selectedLoc ? `${selectedLoc.locLatitude.toFixed(4)}, ${selectedLoc.locLongitude.toFixed(4)}` : 'N/D'}
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Data de Início (AAAA-MM-DD):</Text>
            <TextInput
              style={styles.input}
              value={dataInicio}
              onChangeText={setDataInicio}
              placeholder="Ex: 2025-01-01"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Data de Fim (AAAA-MM-DD):</Text>
            <TextInput
              style={styles.input}
              value={dataFim}
              onChangeText={setDataFim}
              placeholder="Ex: 2026-01-15"
              placeholderTextColor={Colors.textMuted}
            />

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
              onPress={onRunNasaPower}
              activeOpacity={0.85}
            >
              <FontAwesome5 name="cloud-download-alt" size={14} color="#FFF" />
              <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Solicitar Clima NASA</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeading}>Histórico de Análises ({talhaoNasapowers.length})</Text>
        </>
      }
      ListEmptyComponent={
        <Text style={styles.noHistoryText}>Nenhuma análise climática executada para este talhão.</Text>
      }
      renderItem={renderHistoryCard}
    />
  );
}

const styles = StyleSheet.create({
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
