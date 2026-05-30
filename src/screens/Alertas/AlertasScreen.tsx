// ═══════════════════════════════════════════════════════════════
// Terra Nova — Central de Alertas
// Histórico de avisos do sistema e alertas de satélite
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

export function AlertasScreen() {
  const navigation = useNavigation();
  const { logs, eventoCritico } = useAppStore() as any;

  // Filtra o histórico para mostrar apenas alertas e avisos do sistema
  const alertas = logs.filter((log: any) => log.tipo === 'alerta' || log.tipo === 'sistema');

  return (
    <View style={styles.container}>
      {/* ── HEADER COM VOLTAR ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="arrow-left" size={14} color="#ffffff99" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas da Estufa</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* ── ALERTA CRÍTICO ATIVO (Se houver) ── */}
        {eventoCritico && (
          <View style={styles.criticalContainer}>
            <Text style={styles.sectionLabel}>EMERGÊNCIA ATIVA</Text>
            <View style={styles.criticalCard}>
              <View style={styles.criticalHeader}>
                <View style={styles.iconPulse}>
                  <FontAwesome5 name="satellite-dish" size={16} color={Colors.bgPrimary} />
                </View>
                <Text style={styles.criticalTitle}>{eventoCritico.titulo}</Text>
              </View>
              <Text style={styles.criticalDesc}>{eventoCritico.descricao}</Text>
              <Text style={styles.criticalTime}>Gerado em: {new Date(eventoCritico.timestamp).toLocaleString('pt-BR')}</Text>
            </View>
          </View>
        )}

        {/* ── HISTÓRICO DE ALERTAS ── */}
        <Text style={styles.sectionLabel}>HISTÓRICO RECENTE</Text>
        
        {alertas.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="check-circle" size={40} color={Colors.success} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>Tudo tranquilo por aqui!</Text>
            <Text style={styles.emptySub}>Nenhum alerta recente no sistema.</Text>
          </View>
        ) : (
          alertas.map((alerta: any) => {
            const isDanger = alerta.tipo === 'alerta';
            const iconName = isDanger ? 'exclamation-triangle' : 'info-circle';
            const iconColor = isDanger ? Colors.danger : Colors.info;

            return (
              <View key={alerta.id} style={styles.alertCard}>
                <View style={[styles.iconBox, { backgroundColor: isDanger ? Colors.dangerBg : Colors.infoBg }]}>
                  <FontAwesome5 name={iconName} size={16} color={iconColor} />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alerta.mensagem}</Text>
                  <Text style={styles.alertTime}>
                    {new Date(alerta.timestamp).toLocaleString('pt-BR')}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },

  // header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#ffffff14',
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 0.5, borderColor: '#ffffff14',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '600' },

  scroll: { padding: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#ffffff55', letterSpacing: 1.2, marginBottom: 12, marginTop: 10 },

  // Crítico
  criticalContainer: { marginBottom: 24 },
  criticalCard: {
    backgroundColor: Colors.danger, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#ff4444',
  },
  criticalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  iconPulse: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  criticalTitle: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 },
  criticalDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  criticalTime: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },

  // Histórico
  alertCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.bgSecondary, borderRadius: 12,
    padding: 16, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#ffffff14',
  },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  alertContent: { flex: 1 },
  alertMessage: { color: Colors.textPrimary, fontSize: 13, lineHeight: 18, marginBottom: 4 },
  alertTime: { color: Colors.textMuted, fontSize: 11 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptySub: { color: Colors.textMuted, fontSize: 13 },
});