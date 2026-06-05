import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { TelemetriaHistoryCard } from '../TelemetriaHistoryCard';
import { ValidationError } from '../ValidationError';
import { Talhao, Localizacao, DadoTemporal, ReqApi } from '../../types';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

import { TELEMETRY_CONFIGS } from '../../constants/telemetria';

interface AnalisePanelProps {
  type: 'satveg' | 'nasa';
  selectedTalhao?: Talhao;
  selectedLoc?: Localizacao | null;
  onRunApi: () => void;
  dadosTemporais: DadoTemporal[];
  reqApis?: ReqApi[];
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
  onDeleteAnalysis?: (id: number) => void;
}

export function AnalisePanel({
  type,
  selectedTalhao,
  selectedLoc,
  onRunApi,
  dadosTemporais,
  reqApis = [],
  navigation,
  onDeleteAnalysis
}: AnalisePanelProps) {
  const config = TELEMETRY_CONFIGS[type];
  const { tipoApiNome, title, description, buttonIcon, buttonText, buttonColor, buttonTextColor, sectionHeading, emptyMessage, subtitleGrafico } = config;

  const isSatveg = type === 'satveg';
  const outOfBrazil = isSatveg && selectedLoc && (
    selectedLoc.locLatitude < -33.75 || selectedLoc.locLatitude > 5.27 ||
    selectedLoc.locLongitude < -73.98 || selectedLoc.locLongitude > -34.79
  );

  // Otimização de Performance Extrema: agrupamos os dados temporais, ordenamos uma única vez e pegamos apenas os 5 mais recentes para o preview.
  const previewDataPorReq = useMemo(() => {
    const map: Record<number, { date: string, val: number }[]> = {};
    const groups: Record<number, DadoTemporal[]> = {};

    dadosTemporais.forEach(d => {
      if (d.idReqApi && d.tipoApiNome === tipoApiNome) {
        if (!groups[d.idReqApi]) groups[d.idReqApi] = [];
        groups[d.idReqApi].push(d);
      }
    });

    for (const reqId in groups) {
      const top5 = groups[reqId]
        .sort((a, b) => a.dataLeitura > b.dataLeitura ? -1 : (a.dataLeitura < b.dataLeitura ? 1 : 0))
        .slice(0, 5)
        .map(d => ({ date: d.dataLeitura, val: d.valor }));
      map[reqId] = top5;
    }

    return map;
  }, [dadosTemporais, tipoApiNome]);

  const reqApisFiltradas = useMemo(() =>
    reqApis.filter(r => r.tipoApiNome === tipoApiNome)
      .sort((a, b) => new Date(b.dataAnalise).getTime() - new Date(a.dataAnalise).getTime()),
    [reqApis, tipoApiNome]
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>

        {selectedTalhao && (
          <View style={styles.gpsBadge}>
            <FontAwesome5 name="map-marker-alt" size={11} color={Colors.accent} />
            <Text style={styles.gpsText}>
              Coordenadas: {selectedLoc ? `${selectedLoc.locLatitude.toFixed(4)}, ${selectedLoc.locLongitude.toFixed(4)}` : 'N/D'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: outOfBrazil ? Colors.bgInput : buttonColor }]}
          onPress={outOfBrazil ? undefined : onRunApi}
          disabled={!!outOfBrazil}
          activeOpacity={outOfBrazil ? 1 : 0.85}
        >
          <FontAwesome5 name={outOfBrazil ? 'ban' : buttonIcon} size={14} color={outOfBrazil ? Colors.textMuted : buttonTextColor} />
          <Text style={[styles.actionBtnText, { color: outOfBrazil ? Colors.textMuted : buttonTextColor }]}>
            {outOfBrazil ? 'Indisponível fora do Brasil' : buttonText}
          </Text>
        </TouchableOpacity>

        {outOfBrazil && (
          <ValidationError message="O SATVEG (Embrapa) não possui cobertura de NDVI fora do território brasileiro." />
        )}
      </View>

      <Text style={styles.sectionHeading}>{sectionHeading}</Text>

      {reqApisFiltradas.length === 0 ? (
        <Text style={styles.noHistoryText}>{emptyMessage}</Text>
      ) : (
        <>
          <Text style={[styles.sectionHeading, { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 }]}>
            Histórico de Requisições:
          </Text>
          {reqApisFiltradas.map(req => {
            const previewData = previewDataPorReq[req.id] || [];
            return (
              <TelemetriaHistoryCard
                key={req.id}
                id={req.id}
                type={type}
                title={`Série Consolidada (Req #${req.id})`}
                subtitle={`Gerada em: ${new Date(req.dataAnalise).toLocaleString('pt-BR')}`}
                previewData={previewData}
                onDelete={() => onDeleteAnalysis?.(req.id)}
                onPressViewAll={() => navigation.navigate('AnaliseDetalhes', {
                  type,
                  id: req.id,
                  title: `Série Consolidada (Req #${req.id})`,
                  subtitle: subtitleGrafico
                })}
              />
            );
          })}
        </>
      )}
    </ScrollView>
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
    borderRadius: 10,
    paddingVertical: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
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
