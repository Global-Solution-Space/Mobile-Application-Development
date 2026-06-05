import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useScreenSync } from '../../hooks/useScreenSync';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

export function PerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { currentUser, talhoes, propriedades, telefones, logout } = useAppStore();
  useScreenSync();

  const phone = telefones.find((t) => t.idProdutor === currentUser?.id);
  const phoneFormatted = phone ? `(${phone.ddd}) ${phone.numero}` : 'Não cadastrado';

  const handleLogout = () => {
    logout();
  };

  const statusBarHeight = Platform.OS === 'android'
    ? (StatusBar.currentHeight || insets.top || 30)
    : insets.top;

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho do Perfil */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 30 }]}>
        <View style={styles.avatarBox}>
          <FontAwesome5 name="user" size={32} color={Colors.accent} />
        </View>
        <Text style={styles.userName}>{currentUser?.nome}</Text>

        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditarPerfil')}>
          <FontAwesome5 name="edit" size={12} color={Colors.textPrimary} />
          <Text style={styles.editBtnText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas dinâmicas */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{talhoes.length}</Text>
          <Text style={styles.statLabel}>Talhões ativos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{propriedades.length}</Text>
          <Text style={styles.statLabel}>Propriedades</Text>
        </View>
      </View>

      {/* Informações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
        <View style={styles.infoRow}>
          <FontAwesome5 name="envelope" size={14} color={Colors.textMuted} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{currentUser?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5 name="phone" size={14} color={Colors.textMuted} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={styles.infoValue}>{phoneFormatted}</Text>
        </View>

      </View>

      {/* Configurações e ajuda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONFIGURAÇÕES E AJUDA</Text>
        
        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Logs')}>
          <Text style={styles.menuText}>Log de Auditoria</Text>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Faq')}>
          <Text style={styles.menuText}>Manual de Cultivo (FAQ)</Text>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Sobre')}>
          <Text style={styles.menuText}>Sobre o Terra Nova</Text>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <FontAwesome5 name="sign-out-alt" size={14} color={Colors.danger} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: { alignItems: 'center', paddingBottom: 20 },
  avatarBox: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.textMuted },
  editBtnText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600' },
  
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 24, gap: 10 },
  statBox: { flex: 1, backgroundColor: Colors.bgSecondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderTopWidth: 2, borderTopColor: Colors.accent },
  statNum: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textMuted },

  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginBottom: 16, letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoIcon: { width: 24 },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  infoValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.danger },
  logoutText: { color: Colors.danger, fontSize: 14, fontWeight: '600' }
});