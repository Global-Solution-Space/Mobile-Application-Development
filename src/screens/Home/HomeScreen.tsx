// ═══════════════════════════════════════════════════════════════
// Terra Nova — Dashboard de Monitoramento
// Exibe alertas, métricas das estufas, e simulador de eventos
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Dimensions
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

export function HomeScreen() {
  const {
    estufas, lotes, insumos, tarefas, colheitas,
    eventoCritico, simularEvento, resolverEvento,
    currentUser,
  } = useAppStore();

  const lotesAtivos = lotes.length;
  const lotesCriticos = lotes.filter(l => l.status === 'Crítico').length;
  const lotesAtencao = lotes.filter(l => l.status === 'Atenção').length;
  const estufasOp = estufas.filter(e => e.status === 'Operacional').length;
  const insumosAbaixo = insumos.filter(i => i.quantidade < i.minimo).length;
  const tarefasPendentes = tarefas.filter(t => !t.concluida).length;
  const totalColhidoKg = colheitas.reduce((s, c) => s + c.quantidadeKg, 0);

  const handleSimular = () => {
    Alert.alert(
      '🚨 Simulador de Eventos',
      'Deseja simular um evento crítico aleatório? Isso vai gerar um alerta no sistema.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Simular', style: 'destructive', onPress: simularEvento },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* ── Saudação ─── */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Olá, {currentUser?.nome || 'Produtor'} 👨‍🚀</Text>
          <Text style={styles.greetingSub}>Monitoramento geral das estufas</Text>
        </View>

        {/* ── Evento Crítico (se houver) ─── */}
        {eventoCritico && (
          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <FontAwesome5 name="exclamation-triangle" size={20} color={Colors.danger} />
              <Text style={styles.criticalTitle}>{eventoCritico.titulo}</Text>
            </View>
            <Text style={styles.criticalDesc}>{eventoCritico.descricao}</Text>
            <View style={styles.criticalMeta}>
              <View style={[styles.severityBadge, eventoCritico.severidade === 'Crítica' && styles.severityCritical]}>
                <Text style={styles.severityText}>{eventoCritico.severidade}</Text>
              </View>
              <Text style={styles.criticalEstufas}>
                Afetadas: {eventoCritico.estufasAfetadas.join(', ')}
              </Text>
            </View>
            <TouchableOpacity style={styles.resolveBtn} onPress={resolverEvento} activeOpacity={0.8}>
              <FontAwesome5 name="check-circle" size={14} color={Colors.bgPrimary} />
              <Text style={styles.resolveBtnText}>Resolver Evento</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── KPIs Grid ─── */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { borderLeftColor: Colors.accent }]}>
            <FontAwesome5 name="leaf" size={18} color={Colors.accent} />
            <Text style={styles.kpiValue}>{lotesAtivos}</Text>
            <Text style={styles.kpiLabel}>Lotes Ativos</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: Colors.info }]}>
            <FontAwesome5 name="warehouse" size={18} color={Colors.info} />
            <Text style={styles.kpiValue}>{estufasOp}/{estufas.length}</Text>
            <Text style={styles.kpiLabel}>Estufas Ativas</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: Colors.danger }]}>
            <FontAwesome5 name="heartbeat" size={18} color={Colors.danger} />
            <Text style={styles.kpiValue}>{lotesCriticos}</Text>
            <Text style={styles.kpiLabel}>Críticos</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: Colors.warning }]}>
            <FontAwesome5 name="exclamation-circle" size={18} color={Colors.warning} />
            <Text style={styles.kpiValue}>{lotesAtencao}</Text>
            <Text style={styles.kpiLabel}>Em Atenção</Text>
          </View>
        </View>

        {/* ── Métricas Resumo ─── */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <FontAwesome5 name="weight-hanging" size={14} color={Colors.accent} />
            <Text style={styles.metricValue}>{totalColhidoKg.toFixed(1)} kg</Text>
            <Text style={styles.metricLabel}>Total Colhido</Text>
          </View>
          <View style={styles.metricCard}>
            <FontAwesome5 name="boxes" size={14} color={insumosAbaixo > 0 ? Colors.warning : Colors.accent} />
            <Text style={[styles.metricValue, insumosAbaixo > 0 && { color: Colors.warning }]}>
              {insumosAbaixo}
            </Text>
            <Text style={styles.metricLabel}>Insumos Baixos</Text>
          </View>
          <View style={styles.metricCard}>
            <FontAwesome5 name="tasks" size={14} color={Colors.info} />
            <Text style={styles.metricValue}>{tarefasPendentes}</Text>
            <Text style={styles.metricLabel}>Tarefas Pend.</Text>
          </View>
        </View>

        {/* ── Monitor de Estufas ─── */}
        <Text style={styles.sectionTitle}>
          <FontAwesome5 name="broadcast-tower" size={14} color={Colors.accent} />
          {'  '}Monitor de Estufas
        </Text>

        {estufas.map(estufa => (
          <View key={estufa.id} style={styles.estufaCard}>
            <View style={styles.estufaHeader}>
              <View style={styles.estufaNameRow}>
                <View style={[styles.statusDot, {
                  backgroundColor: estufa.status === 'Operacional' ? Colors.success :
                    estufa.status === 'Manutenção' ? Colors.warning : Colors.danger
                }]} />
                <Text style={styles.estufaNome}>{estufa.nome}</Text>
              </View>
              <View style={styles.estufaTypeBadge}>
                <Text style={styles.estufaTypeText}>{estufa.tipo}</Text>
              </View>
            </View>

            <View style={styles.sensorsGrid}>
              <SensorItem icon="thermometer-half" label="Temp" value={`${estufa.temperatura}°C`}
                color={estufa.temperatura > 30 ? Colors.danger : estufa.temperatura > 27 ? Colors.warning : Colors.accent} />
              <SensorItem icon="tint" label="Água" value={`${estufa.nivelAgua}%`}
                color={estufa.nivelAgua < 50 ? Colors.danger : estufa.nivelAgua < 70 ? Colors.warning : Colors.info} />
              <SensorItem icon="sun" label="Luminosidade" value={`${estufa.luminosidade} UV`}
                color={estufa.luminosidade > 20 ? Colors.danger : estufa.luminosidade > 15 ? Colors.warning : Colors.accent} />
              <SensorItem icon="wind" label="CO₂" value={`${estufa.co2} ppm`}
                color={estufa.co2 > 450 ? Colors.warning : Colors.accent} />
            </View>

            <View style={styles.barContainer}>
              <View style={styles.barLabel}>
                <Text style={styles.barLabelText}>Ocupação</Text>
                <Text style={styles.barLabelValue}>{estufa.lotesAtivos}/{estufa.capacidade}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {
                  width: `${Math.min((estufa.lotesAtivos / estufa.capacidade) * 100, 100)}%`,
                  backgroundColor: estufa.lotesAtivos / estufa.capacidade > 0.8 ? Colors.warning : Colors.accent,
                }]} />
              </View>
            </View>
          </View>
        ))}

        {/* ── Botão Simulador ─── */}
        <TouchableOpacity style={styles.simBtn} onPress={handleSimular} activeOpacity={0.8}>
          <FontAwesome5 name="bolt" size={16} color="#FFF" />
          <Text style={styles.simBtnText}>Simular Evento Crítico</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ── Componente auxiliar de sensor ───
function SensorItem({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.sensorItem}>
      <FontAwesome5 name={icon} size={13} color={color} />
      <Text style={[styles.sensorValue, { color }]}>{value}</Text>
      <Text style={styles.sensorLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  greetingContainer: { marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary },
  greetingSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  // Evento Crítico
  criticalCard: {
    backgroundColor: Colors.criticalBg,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.danger,
    marginBottom: 20,
  },
  criticalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  criticalTitle: { fontSize: 16, fontWeight: '700', color: Colors.danger, flex: 1 },
  criticalDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  criticalMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  severityBadge: { backgroundColor: Colors.warningBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  severityCritical: { backgroundColor: Colors.dangerBg },
  severityText: { fontSize: 11, fontWeight: '700', color: Colors.warning },
  criticalEstufas: { fontSize: 12, color: Colors.textMuted },
  resolveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: 10, height: 42, gap: 8,
  },
  resolveBtnText: { fontSize: 14, fontWeight: '700', color: Colors.bgPrimary },

  // KPIs
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  kpiCard: {
    flex: 1, minWidth: (width - 52) / 2,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
    borderLeftWidth: 3,
    alignItems: 'center', gap: 6,
  },
  kpiValue: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  kpiLabel: { fontSize: 11, color: Colors.textSecondary },

  // Métricas
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  metricCard: {
    flex: 1, backgroundColor: Colors.bgSecondary,
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', gap: 4,
  },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  metricLabel: { fontSize: 10, color: Colors.textSecondary },

  // Seção
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  // Estufa Card
  estufaCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 12,
  },
  estufaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  estufaNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  estufaNome: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  estufaTypeBadge: {
    backgroundColor: Colors.accentGlow, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  estufaTypeText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },

  // Sensores
  sensorsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  sensorItem: { alignItems: 'center', gap: 3 },
  sensorValue: { fontSize: 13, fontWeight: '700' },
  sensorLabel: { fontSize: 10, color: Colors.textMuted },

  // Barra de ocupação
  barContainer: { marginTop: 4 },
  barLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabelText: { fontSize: 11, color: Colors.textMuted },
  barLabelValue: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  barTrack: { height: 6, backgroundColor: Colors.white05, borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },

  // Simulador
  simBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.danger, borderRadius: 12, height: 50, gap: 10,
    marginTop: 20,
  },
  simBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});