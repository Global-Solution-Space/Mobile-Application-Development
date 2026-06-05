// ═══════════════════════════════════════════════════════════════
// Terra Nova — Dashboard de Monitorização
// Exibe alertas, métricas das propriedades, e simulador de eventos
// ═══════════════════════════════════════════════════════════════

import React, { useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { KpiCard } from '../../components/KpiCard';
import { AlertCard } from '../../components/AlertCard';
import { PropriedadeCard } from '../../components/PropriedadeCard';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useScreenSync } from '../../hooks/useScreenSync';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    propriedades, talhoes,
    alertas, resolverEvento,
    currentUser,
  } = useAppStore();

  useScreenSync();

  const kpiData = useMemo(() => {
    const ativos = alertas.filter(a => a.resolvido === 'N');
    return {
      talhoesAtivos: talhoes.length,
      propriedadesCount: propriedades.length,
      talhoesCriticos: ativos.filter(a => a.nivelAlerta === 'ALTO' || a.nivelAlerta === 'CRITICO').length,
      talhoesAtencao: ativos.filter(a => a.nivelAlerta === 'MEDIO').length,
      // Pega apenas os 3 alertas ativos mais recentes
      eventosRecentes: [...ativos].reverse().slice(0, 3),
    };
  }, [talhoes.length, propriedades.length, alertas]);

  const ocupacaoAreaPorPropriedade = useMemo(() => {
    const map: Record<number, number> = {};
    talhoes.forEach(t => {
      map[t.idPropriedade] = (map[t.idPropriedade] || 0) + t.volumArea;
    });
    return map;
  }, [talhoes]);

  const { talhoesAtivos, propriedadesCount, talhoesCriticos, talhoesAtencao, eventosRecentes } = kpiData;

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* ── Saudação ─── */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Olá, {currentUser?.nome || 'Produtor'}!</Text>
          <Text style={styles.greetingSub}>Monitorização geral das propriedades</Text>
        </View>

        {/* ── KPIs Grid ─── */}
        <View style={styles.kpiGrid}>
          <KpiCard icon="leaf" color={Colors.accent} value={talhoesAtivos} label="Talhões Ativos" />
          <KpiCard icon="warehouse" color={Colors.info} value={propriedadesCount} label="Propriedades" />
          <KpiCard icon="heartbeat" color={Colors.danger} value={talhoesCriticos} label="Críticos" />
          <KpiCard icon="exclamation-circle" color={Colors.warning} value={talhoesAtencao} label="Em Atenção" />
        </View>

        {/* ── Monitor de Propriedades ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="broadcast-tower" size={14} color={Colors.accent} />
            {'  '}Monitor de Propriedades
          </Text>
          <TouchableOpacity
            style={styles.manageBtn}
            onPress={() => navigation.navigate('GerenciarPropriedades')}
          >
            <FontAwesome5 name="cog" size={12} color={Colors.accent} />
            <Text style={styles.manageBtnText}>Gerenciar</Text>
          </TouchableOpacity>
        </View>

        {propriedades.length === 0 ? (
          <EmptyState icon="map" title="Sem propriedades" subtitle="Suas propriedades aparecerão aqui" />
        ) : (
          propriedades.map(prop => {
            const areaOcupada = ocupacaoAreaPorPropriedade[prop.id] || 0;
            const cap = prop.tamanhoTotal;

            return (
              <PropriedadeCard
                key={prop.id}
                nome={prop.nome}
                tamanhoTotal={prop.tamanhoTotal}
                ativos={areaOcupada}
                cap={cap}
              />
            );
          })
        )}

        {/* ── Central de Alertas ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="bell" size={14} color={Colors.accent} />
            {'  '}Central de Alertas
          </Text>
          <TouchableOpacity
            style={styles.manageBtn}
            onPress={() => navigation.navigate('Alertas')}
          >
            <FontAwesome5 name="eye" size={12} color={Colors.accent} />
            <Text style={styles.manageBtnText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* ── Eventos Recentes ─── */}
        {eventosRecentes.length > 0 ? (
          eventosRecentes.map(alerta => (
            <AlertCard key={alerta.id} alerta={alerta} onResolve={resolverEvento} />
          ))
        ) : (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: Colors.textSecondary, fontSize: 13, fontStyle: 'italic', textAlign: 'center', marginTop: 4 }}>
              Nenhum evento recente detectado.
            </Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  greetingContainer: { marginBottom: 16 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary },
  greetingSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  manageBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accent + '1A',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.accent + '44',
  },
  manageBtnText: { fontSize: 12, fontWeight: '700', color: Colors.accent },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
});