import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { TelemetriaHistoryCard } from '../TelemetriaHistoryCard';
import { Talhao, Localizacao, DadoTemporal } from '../../types';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface AnalisePanelProps {
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
  selectedTalhao?: Talhao;
  selectedLoc?: Localizacao | null;
  onRunApi: () => void;
  dadosTemporais: DadoTemporal[];
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
}

export function AnalisePanel({
  tipoApiNome,
  type,
  title,
  description,
  buttonIcon,
  buttonText,
  buttonColor = Colors.accent,
  buttonTextColor = Colors.bgPrimary,
  sectionHeading,
  emptyMessage,
  subtitleGrafico,
  selectedTalhao,
  selectedLoc,
  onRunApi,
  dadosTemporais,
  navigation
}: AnalisePanelProps) {

  const dadosAgregados = useMemo(() => {
    const dataFiltrada = dadosTemporais.filter(d => d.tipoApiNome === tipoApiNome);
    if (dataFiltrada.length === 0) return null;
    
    const dadosObj: { [key: string]: number } = {};
    dataFiltrada.forEach(d => {
       dadosObj[d.dataLeitura] = d.valor;
    });
    
    return {
      idReq: dataFiltrada[0].idReqApi || (tipoApiNome === 'SATVEG' ? 1 : 2),
      dados: dadosObj
    };
  }, [dadosTemporais, tipoApiNome]);

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
          style={[styles.actionBtn, { backgroundColor: buttonColor }]}
          onPress={onRunApi}
          activeOpacity={0.85}
        >
          <FontAwesome5 name={buttonIcon} size={14} color={buttonTextColor} />
          <Text style={[styles.actionBtnText, { color: buttonTextColor }]}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeading}>{sectionHeading}</Text>
      
      {!dadosAgregados ? (
        <Text style={styles.noHistoryText}>{emptyMessage}</Text>
      ) : (
        <TelemetriaHistoryCard
          id={dadosAgregados.idReq}
          type={type}
          title="Série Histórica Consolidada"
          subtitle={subtitleGrafico}
          dados={dadosAgregados.dados}
          onPressViewAll={() => navigation.navigate('AnaliseDetalhes', {
            type,
            id: dadosAgregados.idReq,
            title: "Série Histórica Consolidada",
            subtitle: subtitleGrafico,
            dados: dadosAgregados.dados
          })}
        />
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
