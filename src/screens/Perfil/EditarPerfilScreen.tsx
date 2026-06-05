import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { FormInput } from '../../components/FormInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ValidationError } from '../../components/ValidationError';
import { useAppStore } from '../../store/useAppStore';

export function EditarPerfilScreen() {
  const navigation = useNavigation();
  const { currentUser, telefones, updateProfile } = useAppStore();

  const phone = currentUser ? telefones.find((t) => t.idProdutor === currentUser.id) : null;

  const [nome, setNome]                     = useState(currentUser?.nome || '');
  const [ddd, setDdd]                       = useState(phone?.ddd || '');
  const [telefone, setTelefone]             = useState(phone?.numero || '');
  const [novoEmail, setNovoEmail]           = useState('');
  const [novaSenha, setNovaSenha]           = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha]   = useState(false);
  const [showConfirmar, setShowConfirmar]   = useState(false);
  const [erro, setErro]                     = useState('');

  const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const senhasIguais = novaSenha.length > 0 && novaSenha === confirmarSenha;

  const handleSave = () => {
    setErro('');

    if (!nome.trim()) {
      setErro('O nome não pode ficar vazio.');
      return;
    }
    if (novoEmail && !emailValido(novoEmail)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (novaSenha && novaSenha.length < 6) {
      setErro('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha && novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    const updates: Record<string, string> = { nome };
    if (novoEmail) updates.email = novoEmail;
    if (novaSenha && senhasIguais) updates.senha = novaSenha;

    const telefoneUpdates = {
      ddd: ddd.trim(),
      numero: telefone.trim(),
    };

    updateProfile(updates, telefoneUpdates);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <Header title="Editar perfil" showBackButton />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── AVATAR ── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarCircle}>
                <FontAwesome5 name="user" size={26} color={Colors.accent} />
              </View>
            </View>
            <Text style={styles.avatarName}>{currentUser?.nome}</Text>
          </View>

          {/* ── INFORMAÇÕES GERAIS ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMAÇÕES GERAIS</Text>

            <FormInput
              label="Nome de exibição"
              iconName="user"
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 0.3 }}>
                <FormInput
                  label="DDD"
                  value={ddd}
                  onChangeText={setDdd}
                  placeholder="Ex: 11"
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={{ flex: 0.7 }}>
                <FormInput
                  label="Telefone"
                  iconName="phone"
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="Ex: 999999999"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* ── SEGURANÇA DA CONTA ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SEGURANÇA DA CONTA</Text>

            {/* e-mail atual — somente leitura */}
            <Text style={{ fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6, marginLeft: 2 }}>E-mail atual</Text>
            <View style={styles.inputLocked}>
              <Text style={styles.inputLockedText}>{currentUser?.email}</Text>
              <FontAwesome5 name="lock" size={13} color={Colors.textMuted} />
            </View>
            <View style={styles.verifiedBadge}>
              <FontAwesome5 name="check-circle" size={11} color={Colors.accent} />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>

            {/* novo e-mail opcional */}
            <FormInput
              label="Novo e-mail (opcional)"
              iconName="envelope"
              value={novoEmail}
              onChangeText={setNovoEmail}
              placeholder="Digite o novo e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {novoEmail.length > 0 && !emailValido(novoEmail) && (
              <Text style={styles.hintError}>E-mail inválido</Text>
            )}
            {novoEmail.length > 0 && emailValido(novoEmail) && (
              <Text style={styles.hintOk}>E-mail válido ✓</Text>
            )}

            {/* nova senha opcional */}
            <FormInput
              label="Nova senha (opcional)"
              iconName="lock"
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="Deixe em branco para não alterar"
              secureTextEntry={!showNovaSenha}
              rightIcon={showNovaSenha ? 'eye-slash' : 'eye'}
              onRightIconPress={() => setShowNovaSenha(v => !v)}
            />

            {/* confirmar senha */}
            <FormInput
              label="Confirmar nova senha"
              iconName="shield-alt"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Repita a nova senha"
              secureTextEntry={!showConfirmar}
              rightIcon={showConfirmar ? 'eye-slash' : 'eye'}
              onRightIconPress={() => setShowConfirmar(v => !v)}
            />
            {confirmarSenha.length > 0 && (
              <Text style={senhasIguais ? styles.hintOk : styles.hintError}>
                {senhasIguais ? 'Senhas coincidem ✓' : 'Senhas não coincidem'}
              </Text>
            )}
          </View>

          {/* ── ERRO GERAL ── */}
          <ValidationError message={erro} onClear={() => setErro('')} />

          {/* ── BOTÕES ── */}
          <View style={styles.actions}>
            <PrimaryButton
              title="Salvar alterações"
              icon="save"
              onPress={handleSave}
            />

            <PrimaryButton
              title="Voltar sem salvar"
              icon="arrow-left"
              variant="outline"
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },

  scroll: { paddingBottom: 48 },

  // avatar
  avatarSection: {
    alignItems: 'center', paddingVertical: 24,
    borderBottomWidth: 0.5, borderBottomColor: Colors.border, gap: 8,
  },
  avatarRing: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 2, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },

  // seções
  section: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '700',
    color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 16,
  },

  // inputs especiais (locked)
  inputLocked: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.bgTertiary, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 14,
  },
  inputLockedText: { color: Colors.textMuted, fontSize: 14 },

  // badge verificado
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgSecondary,
    borderWidth: 0.5, borderColor: Colors.border,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    marginTop: 6, marginBottom: 14,
  },
  verifiedText: { color: Colors.accent, fontSize: 10 },

  // hints
  hintOk:    { fontSize: 11, color: Colors.accent, marginTop: -8, marginBottom: 14, marginLeft: 2 },
  hintError: { fontSize: 11, color: Colors.danger,  marginTop: -8, marginBottom: 14, marginLeft: 2 },

  // botões
  actions: { padding: 20, gap: 10, marginTop: 4 },
});