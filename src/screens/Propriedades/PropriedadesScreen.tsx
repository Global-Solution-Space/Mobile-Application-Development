// ═══════════════════════════════════════════════════════════════
// Terra Nova — Gerenciamento de Propriedades
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { EmptyState } from '../../components/EmptyState';
import { PropriedadeCard } from '../../components/PropriedadeCard';
import { useAppStore } from '../../store/useAppStore';
import { Propriedade } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useScreenSync } from '../../hooks/useScreenSync';

interface PropriedadesScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Propriedades'>;
}

export function PropriedadesScreen({ navigation }: PropriedadesScreenProps) {
  const { propriedades, talhoes } = useAppStore();
  useScreenSync();

  const renderItem = ({ item }: { item: Propriedade }) => {
    const talhoesNaPropriedade = talhoes.filter(l => l.idPropriedade === item.id);
    const areaOcupada = talhoesNaPropriedade.reduce((acc, curr) => acc + curr.volumArea, 0);
    const totalArea = item.tamanhoTotal;
    const hasTalhoes = talhoesNaPropriedade.length > 0;

    return (
      <PropriedadeCard 
        nome={item.nome}
        tamanhoTotal={item.tamanhoTotal}
        ativos={areaOcupada}
        cap={totalArea}
      >
        {/* Talhões nesta propriedade */}
        {hasTalhoes && (
          <View style={styles.talhoesSection}>
            <Text style={styles.talhoesSectionTitle}>Talhões Vinculados:</Text>
            {talhoesNaPropriedade.map(t => (
              <View key={t.id} style={styles.miniTalhao}>
                <View style={[styles.miniDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.miniTalhaoText}>{t.nomeTalhao} — {t.volumArea} ha</Text>
              </View>
            ))}
          </View>
        )}

        {!hasTalhoes && (
          <View style={styles.emptySlot}>
            <FontAwesome5 name="inbox" size={14} color={Colors.textMuted} />
            <Text style={styles.emptySlotText}>Propriedade sem talhões vinculados</Text>
          </View>
        )}
      </PropriedadeCard>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={18} color={Colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciamento de Propriedades</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <View style={[styles.sDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.sText}>{propriedades.length} Propriedades Ativas</Text>
        </View>
      </View>

      <FlatList
        data={propriedades}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="map" title="Nenhuma propriedade encontrada" subtitle="Cadastre uma propriedade na tela de Cadastros" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },

  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  summaryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgSecondary, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
  },
  sDot: { width: 8, height: 8, borderRadius: 4 },
  sText: { fontSize: 12, color: Colors.textSecondary },

  list: { padding: 16, paddingBottom: 40 },

  talhoesSection: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 14 },
  talhoesSectionTitle: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  miniTalhao: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  miniDot: { width: 6, height: 6, borderRadius: 3 },
  miniTalhaoText: { fontSize: 12, color: Colors.textSecondary },

  emptySlot: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 14
  },
  emptySlotText: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
});
