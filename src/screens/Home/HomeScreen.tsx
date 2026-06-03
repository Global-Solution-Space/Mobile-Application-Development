// ═══════════════════════════════════════════════════════════════
// Terra Nova — Dashboard de Monitorização
// Exibe alertas, métricas das propriedades, e simulador de eventos
// ═══════════════════════════════════════════════════════════════

import React from 'react';
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

const { width } = Dimensions.get('window');

export function HomeScreen() {
  const {
    propriedades, talhoes,
    alertas, resolverEvento,
    currentUser,
  } = useAppStore();

  const talhoesAtivos = talhoes.length;
  const propriedadesCount = propriedades.length;
  
  const alertasAtivos = alertas.filter(a => a.resolvido === 'N');
  const talhoesCriticos = alertasAtivos.filter(a => a.nivelAlerta === 'ALTO').length;
  const talhoesAtencao = alertasAtivos.filter(a => a.nivelAlerta === 'MEDIO').length;
  const eventoCritico = alertasAtivos.find(a => a.nivelAlerta === 'ALTO');

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Saudação ─── */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Olá, {currentUser?.nome || 'Produtor'}!</Text>
          <Text style={styles.greetingSub}>Monitorização geral das propriedades</Text>
        </View>

        {/* ── Evento Crítico ─── */}
        {eventoCritico && (
          <AlertCard alerta={eventoCritico} onResolve={resolverEvento} />
        )}

        {/* ── KPIs Grid ─── */}
        <View style={styles.kpiGrid}>
          <KpiCard icon="leaf" color={Colors.accent} value={talhoesAtivos} label="Talhões Ativos" />
          <KpiCard icon="warehouse" color={Colors.info} value={propriedadesCount} label="Propriedades" />
          <KpiCard icon="heartbeat" color={Colors.danger} value={talhoesCriticos} label="Críticos" />
          <KpiCard icon="exclamation-circle" color={Colors.warning} value={talhoesAtencao} label="Em Atenção" />
        </View>

        {/* ── Monitor de Propriedades ─── */}
        <Text style={styles.sectionTitle}>
          <FontAwesome5 name="broadcast-tower" size={14} color={Colors.accent} />
          {'  '}Monitor de Propriedades
        </Text>

        {propriedades.length === 0 ? (
          <EmptyState icon="map" title="Sem propriedades" subtitle="Suas propriedades aparecerão aqui" />
        ) : (
          propriedades.map(prop => {
            const ativos = talhoes.filter(t => t.idPropriedade === prop.id).length;
            const cap = 10; // Capacidade simulada

            return (
              <PropriedadeCard 
                key={prop.id} 
                nome={prop.nome} 
                tamanhoTotal={prop.tamanhoTotal} 
                ativos={ativos} 
                cap={cap} 
              />
            );
          })
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


  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }
});