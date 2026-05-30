// ═══════════════════════════════════════════════════════════════
// Terra Nova — Suporte da Base
// Central de ajuda e contato com a equipe de engenharia
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export function SuporteScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="arrow-left" size={14} color="#ffffff99" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte da Base</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* ── HERO ── */}
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="headset" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Central de Comando</Text>
          <Text style={styles.heroDesc}>
            Encontrou uma anomalia nos sistemas do Terra Nova? Nossa equipe de engenharia está pronta para ajudar.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>CANAIS DE COMUNICAÇÃO</Text>

        {/* ── CARDS DE CONTATO ── */}
        <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
            <FontAwesome5 name="comments" size={18} color="#3b82f6" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Chat em Tempo Real</Text>
            <Text style={styles.contactDesc}>Fale com um operador agora</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactCard} 
          activeOpacity={0.7} 
          onPress={() => Linking.openURL('mailto:suporte@terranova.com')}
        >
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <FontAwesome5 name="envelope" size={18} color={Colors.accent} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Mensagem Intergaláctica</Text>
            <Text style={styles.contactDesc}>suporte@terranova.com</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <FontAwesome5 name="phone-alt" size={18} color="#f59e0b" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Transmissão de Rádio</Text>
            <Text style={styles.contactDesc}>0800 777 NOVA</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* ── STATUS DO SISTEMA ── */}
        <View style={styles.systemStatus}>
          <FontAwesome5 name="check-circle" size={14} color={Colors.success} />
          <Text style={styles.statusText}>Conexão com satélite estável e operacional</Text>
        </View>

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

  // hero
  hero: { alignItems: 'center', marginBottom: 32, marginTop: 10 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.accentGlow,
    borderWidth: 2, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  heroDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },

  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#ffffff55', letterSpacing: 1.2, marginBottom: 16 },

  // cards
  contactCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgSecondary, borderRadius: 14,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  contactIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  contactDesc: { fontSize: 13, color: Colors.textMuted },

  // status
  systemStatus: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 12,
    padding: 16, marginTop: 16, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: { fontSize: 12, color: Colors.success, fontWeight: '600' }
});