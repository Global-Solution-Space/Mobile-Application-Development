// ═══════════════════════════════════════════════════════════════
// Terra Nova — Sobre o Aplicativo
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const VERSAO = '1.0.0';
const ANO = '2026';

const TECNOLOGIAS = [
  { icon: 'mobile-alt',    label: 'React Native',      desc: 'Interface mobile multiplataforma' },
  { icon: 'database',      label: 'API REST Java',      desc: 'Backend com Spring Boot' },
  { icon: 'satellite',     label: 'Dados de Satélite',  desc: 'Monitoramento geoespacial' },
  { icon: 'cloud',         label: 'Cloud Deploy',       desc: 'Infraestrutura em nuvem' },
  { icon: 'shield-alt',    label: 'JWT Auth',           desc: 'Autenticação segura' },
];

const ODS = [
  { num: '2',  cor: '#DDA63A', label: 'Fome zero e agricultura sustentável' },
  { num: '9',  cor: '#F36D25', label: 'Indústria, inovação e infraestrutura' },
  { num: '11', cor: '#F99D26', label: 'Cidades e comunidades sustentáveis' },
  { num: '13', cor: '#3F7E44', label: 'Ação contra a mudança global do clima' },
];

export function SobreScreen() {
  const navigation = useNavigation();
  const [expandido, setExpandido] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandido(expandido === id ? null : id);

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
        <Text style={styles.headerTitle}>Sobre o Terra Nova</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── LOGO / HERO ── */}
        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="seedling" size={36} color={Colors.accent} />
          </View>
          <Text style={styles.appName}>Terra Nova</Text>
          <Text style={styles.appTagline}>
            Gestão Agrícola com Dados de Satélite
          </Text>
          <View style={styles.versaoBadge}>
            <FontAwesome5 name="code-branch" size={10} color={Colors.accent} />
            <Text style={styles.versaoText}>v{VERSAO} — Global Solution {ANO}</Text>
          </View>
        </View>

        {/* ── O QUE É ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O QUE É O TERRA NOVA</Text>
          <View style={styles.descCard}>
            <Text style={styles.descText}>
              O Terra Nova é uma plataforma de gestão agrícola inteligente que
              conecta a exploração espacial à produção de alimentos na Terra.
            </Text>
            <Text style={styles.descText}>
              Utilizando dados de satélites orbitais, o sistema monitora em
              tempo real a saúde das estufas, detecta anomalias climáticas,
              controla o estoque de insumos e agenda tarefas de manutenção —
              tudo em um único aplicativo.
            </Text>
          </View>
        </View>

        {/* ── TEMA GLOBAL SOLUTION ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TEMA — GLOBAL SOLUTION 2026/1</Text>
          <View style={styles.themeCard}>
            <FontAwesome5 name="rocket" size={22} color={Colors.accent} style={{ marginBottom: 10 }} />
            <Text style={styles.themeTitle}>🚀 O Espaço é a Nova Fronteira</Text>
            <Text style={styles.themeDesc}>
              Satélites monitoram o clima, orientam o agronegócio, evitam
              desastres e conectam regiões remotas. O Terra Nova transforma
              esses dados orbitais em ações práticas para agricultores e
              produtores de alimentos.
            </Text>
          </View>
        </View>

        {/* ── ODS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONEXÃO COM OS ODS DA ONU</Text>
          {ODS.map(o => (
            <View key={o.num} style={styles.odsRow}>
              <View style={[styles.odsNum, { backgroundColor: o.cor }]}>
                <Text style={styles.odsNumText}>{o.num}</Text>
              </View>
              <Text style={styles.odsLabel}>{o.label}</Text>
            </View>
          ))}
        </View>

        {/* ── TECNOLOGIAS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TECNOLOGIAS UTILIZADAS</Text>
          {TECNOLOGIAS.map((t, i) => (
            <View key={i} style={styles.techRow}>
              <View style={styles.techIconBox}>
                <FontAwesome5 name={t.icon} size={15} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.techLabel}>{t.label}</Text>
                <Text style={styles.techDesc}>{t.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── DISCIPLINA ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISCIPLINA</Text>
          <TouchableOpacity
            style={styles.discCard}
            activeOpacity={0.8}
            onPress={() => toggle('disc')}
          >
            <View style={styles.discHeader}>
              <FontAwesome5 name="graduation-cap" size={16} color={Colors.accent} />
              <Text style={styles.discTitle}>Mobile Application Development</Text>
              <FontAwesome5
                name={expandido === 'disc' ? 'chevron-up' : 'chevron-down'}
                size={12}
                color={Colors.textMuted}
              />
            </View>
            {expandido === 'disc' && (
              <View style={styles.discBody}>
                <Text style={styles.discText}>🏫 FIAP — Graduação</Text>
                <Text style={styles.discText}>📅 2º Ano — Turmas de Fevereiro</Text>
                <Text style={styles.discText}>📱 Desenvolvido em React Native com Expo</Text>
                <Text style={styles.discText}>🔗 Integração com API Java/Spring Boot</Text>
                <Text style={styles.discText}>📦 Entrega via GitHub Classroom</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── RODAPÉ ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <FontAwesome5 name="seedling" size={18} color={Colors.accent} />
          <Text style={styles.footerText}>
            Terra Nova © {ANO}
          </Text>
          <Text style={styles.footerSub}>
            Desenvolvido para a Global Solution FIAP
          </Text>
          <Text style={styles.footerSub}>
            Feito com 💚 por estudantes de ADS
          </Text>
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
  headerTitle: {
    flex: 1, textAlign: 'center',
    color: '#fff', fontSize: 16, fontWeight: '600',
  },

  scroll: { paddingBottom: 48 },

  // hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ffffff10',
    gap: 8,
  },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accentGlow,
    borderWidth: 2, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  appName: { color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: 1.5 },
  appTagline: { color: Colors.textSecondary, fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
  versaoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 0.5, borderColor: '#ffffff14',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    marginTop: 4,
  },
  versaoText: { color: Colors.accent, fontSize: 11 },

  // seções
  section: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
    borderBottomWidth: 0.5, borderBottomColor: '#ffffff10',
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '700',
    color: '#ffffff44', letterSpacing: 1.5,
    marginBottom: 14,
  },

  // descrição
  descCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 12, padding: 16,
    borderWidth: 0.5, borderColor: '#ffffff12',
    gap: 10,
  },
  descText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },

  // tema
  themeCard: {
    backgroundColor: Colors.accentGlow,
    borderRadius: 12, padding: 18,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)',
    alignItems: 'center',
  },
  themeTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  themeDesc: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20, textAlign: 'center' },

  // ODS
  odsRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 10,
  },
  odsNum: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  odsNumText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  odsLabel: { color: Colors.textSecondary, fontSize: 13, flex: 1 },

  // tecnologias
  techRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: '#ffffff08',
  },
  techIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 0.5, borderColor: '#ffffff14',
    alignItems: 'center', justifyContent: 'center',
  },
  techLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  techDesc: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },

  // disciplina accordion
  discCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 12,
    borderWidth: 0.5, borderColor: '#ffffff14',
    overflow: 'hidden',
  },
  discHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 14,
  },
  discTitle: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '600' },
  discBody: { paddingHorizontal: 14, paddingBottom: 14, gap: 6 },
  discText: { color: Colors.textSecondary, fontSize: 13 },

  // footer
  footer: {
    alignItems: 'center',
    paddingTop: 24, paddingBottom: 8,
    gap: 6,
  },
  footerDivider: {
    width: 40, height: 2, borderRadius: 2,
    backgroundColor: Colors.accent, opacity: 0.4,
    marginBottom: 10,
  },
  footerText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  footerSub: { color: Colors.textMuted, fontSize: 12 },
});