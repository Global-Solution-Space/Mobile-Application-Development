import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

export function PerfilScreen() {
  const navigation = useNavigation() as any;
  
  const { currentUser, lotes, estufas, colheitas, logout } = useAppStore() as any;

  const totalKg = colheitas.reduce((soma: number, c: any) => soma + c.quantidadeKg, 0);

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView style={styles.container}>
      {/* CABEÇALHO DO PERFIL */}
      <View style={styles.header}>
        <View style={styles.avatarBox}>
          <FontAwesome5 name="user" size={32} color={Colors.accent} />
        </View>
        <Text style={styles.userName}>{currentUser?.nome}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Produtor(a) Chefe</Text>
        </View>
        
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{currentUser?.base || 'Sede Terra Nova'}</Text>
          </View>
          <View style={styles.tag}><Text style={styles.tagText}>Cultivo Sustentável</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Acesso Padrão</Text></View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditarPerfil')}>
          <FontAwesome5 name="edit" size={12} color={Colors.textPrimary} />
          <Text style={styles.editBtnText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      {/* ESTATÍSTICAS DINÂMICAS */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{lotes.length}</Text>
          <Text style={styles.statLabel}>Lotes ativos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{totalKg.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Kg Colhidos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{estufas.length}</Text>
          <Text style={styles.statLabel}>Estufas</Text>
        </View>
      </View>

      {/* INFORMAÇÕES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
        <View style={styles.infoRow}>
          <FontAwesome5 name="envelope" size={14} color={Colors.textMuted} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{currentUser?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5 name="id-badge" size={14} color={Colors.textMuted} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Matrícula</Text>
          <Text style={styles.infoValue}>AST-2026</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5 name="calendar-alt" size={14} color={Colors.textMuted} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Membro desde</Text>
          <Text style={styles.infoValue}>
            {currentUser?.criadoEm ? new Date(currentUser.criadoEm).toLocaleDateString('pt-BR') : ''}
          </Text>
        </View>
      </View>

      {/* CONFIGURAÇÕES E SUPORTE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONFIGURAÇÕES E SUPORTE</Text>
        
       {/* Substitua o botão antigo por este: */}
<TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Alertas')}>
  <Text style={styles.menuText}>Alertas da Estufa</Text>
  <FontAwesome5 name="chevron-right" size={12} color={Colors.accent} />
</TouchableOpacity>

        {/* 👇 AQUI ESTÁ O LINK CORRIGIDO PARA O FAQ 👇 */}
        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Faq')}>
          <Text style={styles.menuText}>Manual de Cultivo (FAQ)</Text>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.accent} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Suporte')}>
  <Text style={styles.menuText}>Suporte da Base</Text>
  <FontAwesome5 name="chevron-right" size={12} color={Colors.accent} />
</TouchableOpacity>

        {/* 👇 AQUI ESTÁ O LINK PARA O SOBRE 👇 */}
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
  header: { alignItems: 'center', paddingTop: 30, paddingBottom: 20 },
  avatarBox: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  roleBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  roleText: { color: Colors.accent, fontSize: 12, fontWeight: '600' },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tag: { backgroundColor: Colors.bgSecondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  tagText: { color: Colors.textSecondary, fontSize: 11 },
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