import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { TelemetriaHistoryCard } from '../TelemetriaHistoryCard';
import { Talhao, Localizacao, SatVeg } from '../../types';

interface SatVegPanelProps {
  selectedTalhao?: Talhao;
  selectedLoc?: Localizacao | null;
  onRunSatVeg: () => void;
  talhaoSatvegs: SatVeg[];
  onDeleteSatVeg: (id: number) => void;
  navigation: any;
}

export function SatVegPanel({
  selectedTalhao,
  selectedLoc,
  onRunSatVeg,
  talhaoSatvegs,
  onDeleteSatVeg,
  navigation
}: SatVegPanelProps) {

  const renderHistoryCard = useCallback(({ item }: any) => (
    <TelemetriaHistoryCard
      id={item.id}
      type="satveg"
      title={`Análise #${item.id}`}
      subtitle={`Realizada em: ${item.dataAnalise ? new Date(item.dataAnalise).toLocaleDateString('pt-BR') : 'N/D'}`}
      dados={item.dados || {}}
      onDelete={() => onDeleteSatVeg(item.id)}
      onPressViewAll={() => navigation.navigate('AnaliseDetalhes', {
        type: 'satveg',
        id: item.id,
        title: `Análise #${item.id}`,
        subtitle: `Realizada em: ${item.dataAnalise ? new Date(item.dataAnalise).toLocaleDateString('pt-BR') : 'N/D'}`,
        dados: item.dados || {}
      })}
    />
  ), [onDeleteSatVeg, navigation]);

  return (
    <FlatList
      data={talhaoSatvegs}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <>
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>🛰️ Monitoramento de Índice de Vegetação (NDVI)</Text>
            <Text style={styles.cardDescription}>
              Conecta com a série histórica de satélite da Embrapa SATveg usando a latitude e longitude do talhão para monitorar a saúde biológica da plantação.
            </Text>
            
            {selectedTalhao && (
              <View style={styles.gpsBadge}>
                <FontAwesome5 name="map-marker-alt" size={11} color={Colors.accent} />
                <Text style={styles.gpsText}>
                  Coordenadas: {selectedLoc ? `${selectedLoc.locLatitude.toFixed(4)}, ${selectedLoc.locLongitude.toFixed(4)}` : 'N/D'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onRunSatVeg}
              activeOpacity={0.85}
            >
              <FontAwesome5 name="sync-alt" size={14} color={Colors.bgPrimary} />
              <Text style={styles.actionBtnText}>Solicitar Telemetria SATveg</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeading}>Histórico de Análises ({talhaoSatvegs.length})</Text>
        </>
      }
      ListEmptyComponent={
        <Text style={styles.noHistoryText}>Nenhuma telemetria executada para este talhão.</Text>
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
});
