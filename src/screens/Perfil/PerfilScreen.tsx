// ═══════════════════════════════════════════════════════════════
// Terra Nova — Perfil do Produtor
// Editar nome, visualizar dados e fazer logout
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

export function PerfilScreen({ navigation }: any) {
  const { currentUser, updateProfile, logout, lotes, colheitas, logs } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [novoNome, setNovoNome] = useState(currentUser?.nome || '');

  const handleSave = () => {
    if (!novoNome.trim()) {
      Alert.alert('Nome obrigatório', 'O nome não pode ficar vazio.');
      return;
    }
    updateProfile(novoNome.trim());
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair do sistema',
      'Deseja realmente desconectar da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const totalColhido = colheitas.reduce((s, c) => s + c.quantidadeKg, 0);
  const lotesAtivos = lotes.length;
  const acoes = logs.filter(l => l.usuario === currentUser?.nome).length;

  return (
    <View style={styles.container}>
      <Header title="Perfil" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* ── Avatar ─── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <FontAwesome5 name="user-circle" size={44} color={Colors.accent} />
          </View>
          {!editing ? (
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{currentUser?.nome || 'Produtor'}</Text>
              <TouchableOpacity onPress={() => { setEditing(true); setNovoNome(currentUser?.nome || ''); }}>
                <FontAwesome5 name="pen" size={14} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editNameRow}>
              <TextInput
                style={styles.nameInput}
                value={novoNome}
                onChangeText={setNovoNome}
                autoFocus
                placeholderTextColor={Colors.textMuted}
              />
              <TouchableOpacity style={styles.saveNameBtn} onPress={handleSave}>
                <FontAwesome5 name="check" size={14} color={Colors.bgPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelNameBtn} onPress={() => setEditing(false)}>
                <FontAwesome5 name="times" size={14} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.userEmail}>{currentUser?.email}</Text>
          <Text style={styles.userSince}>
            Membro desde {currentUser?.criadoEm ? new Date(currentUser.criadoEm).toLocaleDateString('pt-BR') : '—'}
          </Text>
        </View>

        {/* ── Estatísticas ─── */}
        <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <FontAwesome5 name="leaf" size={18} color={Colors.accent} />
            <Text style={styles.statValue}>{lotesAtivos}</Text>
            <Text style={styles.statLabel}>Lotes Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <FontAwesome5 name="weight-hanging" size={18} color={Colors.success} />
            <Text style={styles.statValue}>{totalColhido.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Kg Colhidos</Text>
          </View>
          <View style={styles.statCard}>
            <FontAwesome5 name="history" size={18} color={Colors.info} />
            <Text style={styles.statValue}>{acoes}</Text>
            <Text style={styles.statLabel}>Ações</Text>
          </View>
        </View>

        {/* ── Menu ─── */}
        <Text style={styles.sectionTitle}>Menu Rápido</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Estufas')} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.infoBg }]}>
              <FontAwesome5 name="warehouse" size={14} color={Colors.info} />
            </View>
            <Text style={styles.menuText}>Gerenciar Estufas</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Colheitas')} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.successBg }]}>
              <FontAwesome5 name="clipboard-list" size={14} color={Colors.success} />
            </View>
            <Text style={styles.menuText}>Histórico de Colheitas</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Logs')} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.warningBg }]}>
              <FontAwesome5 name="stream" size={14} color={Colors.warning} />
            </View>
            <Text style={styles.menuText}>Logs de Atividades</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Tarefas')} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.accentGlow }]}>
              <FontAwesome5 name="calendar-check" size={14} color={Colors.accent} />
            </View>
            <Text style={styles.menuText}>Agendamento de Tarefas</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* ── Logout ─── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <FontAwesome5 name="sign-out-alt" size={16} color={Colors.danger} />
          <Text style={styles.logoutText}>Sair do Sistema</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Avatar
  avatarSection: { alignItems: 'center', paddingVertical: 24, marginBottom: 20 },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.accentGlow,
    borderWidth: 3, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userName: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  editNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nameInput: {
    backgroundColor: Colors.bgInput, borderRadius: 10, borderWidth: 1, borderColor: Colors.accent,
    paddingHorizontal: 14, paddingVertical: 8, color: Colors.textPrimary, fontSize: 16,
    width: 200, textAlign: 'center',
  },
  saveNameBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  cancelNameBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.dangerBg, alignItems: 'center', justifyContent: 'center',
  },
  userEmail: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
  userSince: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

  // Stats
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1, backgroundColor: Colors.bgSecondary, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 6,
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary },

  // Menu
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.bgSecondary, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 10,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.dangerBg, borderRadius: 12, height: 50, gap: 10,
    marginTop: 20, borderWidth: 1, borderColor: Colors.danger + '44',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.danger },
});