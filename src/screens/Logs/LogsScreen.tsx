// ═══════════════════════════════════════════════════════════════
// Terra Nova — Logs de Atividades do Sistema
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { useAppStore } from '../../store/useAppStore';
import { LogAtividade, TipoLog } from '../../types';

const tipoConfig: Record<TipoLog, { icon: string; color: string; label: string }> = {
  criacao: { icon: 'plus-circle', color: Colors.success, label: 'Criação' },
  edicao: { icon: 'edit', color: Colors.info, label: 'Edição' },
  exclusao: { icon: 'trash', color: Colors.danger, label: 'Exclusão' },
  alerta: { icon: 'exclamation-triangle', color: Colors.warning, label: 'Alerta' },
  sistema: { icon: 'cog', color: Colors.textSecondary, label: 'Sistema' },
};

function timeAgo(ts: string) {
  const d = Date.now() - new Date(ts).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return 'Agora';
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface LogsScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Logs'>;
}

export function LogsScreen({ navigation }: LogsScreenProps) {
  const { logs } = useAppStore();

  const renderItem = ({ item, index }: { item: LogAtividade; index: number }) => {
    const cfg = tipoConfig[item.tipo];
    return (
      <View style={styles.logItem}>
        <View style={styles.timeline}>
          <View style={[styles.dot, { backgroundColor: cfg.color }]}>
            <FontAwesome5 name={cfg.icon} size={10} color={Colors.textPrimary} />
          </View>
          {index < logs.length - 1 && <View style={styles.line} />}
        </View>
        <View style={styles.logContent}>
          <View style={styles.logHeader}>
            <View style={[styles.badge, { backgroundColor: cfg.color + '22' }]}>
              <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
            <Text style={styles.logTime}>{timeAgo(item.timestamp)}</Text>
          </View>
          <Text style={styles.logMsg}>{item.mensagem}</Text>
          <Text style={styles.logUser}>👤 {item.usuario}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Logs de Atividades" showBackButton />
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="stream" title="Sem atividades" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { padding: 16, paddingBottom: 40 },
  logItem: { flexDirection: 'row', marginBottom: 4 },
  timeline: { width: 32, alignItems: 'center' },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line: { width: 2, flex: 1, backgroundColor: Colors.border, marginTop: -2 },
  logContent: {
    flex: 1, marginLeft: 12, backgroundColor: Colors.bgSecondary, borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 8,
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  logTime: { fontSize: 10, color: Colors.textMuted },
  logMsg: { fontSize: 13, color: Colors.textPrimary, lineHeight: 19 },
  logUser: { fontSize: 11, color: Colors.textMuted, marginTop: 6 },
});
