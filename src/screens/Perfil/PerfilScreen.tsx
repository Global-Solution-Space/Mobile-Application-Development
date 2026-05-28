import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';

const mockUser = {
  nome: 'Luna de Carvalho',
  lotesAtivos: 4,
  totalColheitas: 12,
  totalEstufas: 2,
  email: 'luna@terranova.com',
  matricula: 'AST-2026',
  base: 'Marte Alpha',
  criadoEm: 'Maio de 2026'
};

const COLORS = {
  bg: '#04100B',
  bgCard: '#071a10',
  bgCardBorder: '#ffffff12',
  primary: '#10B981',
  primaryLight: '#6EE7B7',
  text: '#ffffff',
  textMuted: '#8BA89A',
  danger: '#f87171',
  dangerBorder: '#7f1d1d',
};

export function PerfilScreen() {
  const navigation = useNavigation<any>();

  const handleSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => console.log('Deslogou') },
      ]
    );
  };

  const handleActionPress = (title: string) => {
    Alert.alert("Em desenvolvimento", `A tela de ${title} será adicionada em breve!`);
  };

  return (
    <View style={styles.container}>
      <Header title="Perfil" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-outline" size={32} color={COLORS.primary} />
            </View>
          </View>

          <Text style={styles.userName}>{mockUser.nome}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Engenheira de Cultivo</Text>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}><Text style={styles.tagText}>{mockUser.base}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Hidroponia</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Nível 3</Text></View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditarPerfil')}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={14} color={COLORS.text} />
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.statsRow}>
            <StatCard label="Lotes ativos" value={mockUser.lotesAtivos} />
            <StatCard label="Colheitas" value={mockUser.totalColheitas} />
            <StatCard label="Estufas" value={mockUser.totalEstufas} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Informações</Text>
          <InfoRow icon="mail-outline" label="E-mail" value={mockUser.email} />
          <InfoRow icon="id-card-outline" label="Matrícula" value={mockUser.matricula} />
          <InfoRow icon="planet-outline" label="Base" value={mockUser.base} />
          <InfoRow icon="calendar-outline" label="Membro desde" value={mockUser.criadoEm} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Configurações e Suporte</Text>
          <ActionRow icon="notifications-outline" label="Alertas da Estufa" onPress={() => handleActionPress('Notificações')} />
          <ActionRow icon="help-circle-outline" label="Manual de Cultivo (FAQ)" onPress={() => handleActionPress('FAQ')} />
          <ActionRow icon="headset-outline" label="Suporte da Base" onPress={() => handleActionPress('Suporte')} />
          <ActionRow icon="information-circle-outline" label="Sobre o Terra Nova" onPress={() => handleActionPress('Sobre')} />
        </View>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.dangerText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardAccent} />
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string; }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon as any} size={16} color="#8BA89A" />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ActionRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void; }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon as any} size={16} color="#8BA89A" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.primaryLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20, borderBottomWidth: 0.5, borderBottomColor: '#ffffff10', gap: 10 },
  avatarRing: { width: 84, height: 84, borderRadius: 42, borderWidth: 1.5, borderColor: '#ffffff22', alignItems: 'center', justifyContent: 'center' },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0a2218', borderWidth: 2, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  userName: { color: COLORS.text, fontSize: 18, fontWeight: '600' },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 4, backgroundColor: '#0a2218', borderWidth: 0.5, borderColor: '#ffffff14', borderRadius: 20 },
  roleText: { color: COLORS.primaryLight, fontSize: 12 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  tag: { backgroundColor: '#0a2218', borderWidth: 0.5, borderColor: '#ffffff14', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { color: '#8BA89A', fontSize: 11 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 0.5, borderColor: '#ffffff30', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 7, marginTop: 4 },
  editButtonText: { color: COLORS.text, fontSize: 13 },
  section: { padding: 16, paddingHorizontal: 20, borderBottomWidth: 0.5, borderBottomColor: '#ffffff10' },
  sectionLabel: { color: '#8BA89A', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.bgCard, borderWidth: 0.5, borderColor: COLORS.bgCardBorder, borderRadius: 10, padding: 10, alignItems: 'center', overflow: 'hidden' },
  statCardAccent: { width: '100%', height: 2, borderRadius: 2, backgroundColor: COLORS.primary, opacity: 0.6, marginBottom: 8 },
  statNum: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  statLabel: { color: COLORS.textMuted, fontSize: 10, marginTop: 2, textAlign: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#ffffff08', gap: 10 },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#ffffff08', gap: 10 },
  infoIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#0a2218', borderWidth: 0.5, borderColor: '#ffffff14', alignItems: 'center', justifyContent: 'center' },
  infoLabel: { flex: 1, color: COLORS.textMuted, fontSize: 12 },
  infoValue: { color: COLORS.text, fontSize: 13, fontWeight: '500' },
  actionLabel: { flex: 1, color: COLORS.text, fontSize: 14, fontWeight: '500' },
  dangerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 16, borderWidth: 0.5, borderColor: COLORS.dangerBorder, borderRadius: 10, padding: 13 },
  dangerText: { color: COLORS.danger, fontSize: 14 },
});