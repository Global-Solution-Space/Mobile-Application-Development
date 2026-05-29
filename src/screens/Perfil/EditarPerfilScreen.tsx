import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

export function EditarPerfilScreen() {
  const navigation = useNavigation();
  const { currentUser, updateProfile } = useAppStore() as any;

  const [nome, setNome]                     = useState(currentUser.nome);
  const [base, setBase]                     = useState(currentUser.base);
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

    const updates: Record<string, string> = { nome, base };
    if (novoEmail) updates.email = novoEmail;

    updateProfile(updates);

    Alert.alert(
      '✅ Perfil atualizado!',
      'Suas informações foram salvas com sucesso.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="arrow-left" size={14} color="#ffffff99" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <View style={{ width: 32 }} />
        </View>

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
            <Text style={styles.avatarName}>{currentUser.nome}</Text>
          </View>

          {/* ── INFORMAÇÕES GERAIS ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMAÇÕES GERAIS</Text>

            <Text style={styles.label}>Nome de exibição</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.label}>Planeta / Base</Text>
            <TextInput
              style={styles.input}
              value={base}
              onChangeText={setBase}
              placeholder="Ex: Marte Alpha"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* ── SEGURANÇA DA CONTA ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SEGURANÇA DA CONTA</Text>

            {/* e-mail atual — somente leitura */}
            <Text style={styles.label}>E-mail atual</Text>
            <View style={styles.inputLocked}>
              <Text style={styles.inputLockedText}>{currentUser.email}</Text>
              <FontAwesome5 name="lock" size={13} color="#ffffff22" />
            </View>
            <View style={styles.verifiedBadge}>
              <FontAwesome5 name="check-circle" size={11} color={Colors.accent} />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>

            {/* novo e-mail opcional */}
            <Text style={[styles.label, { marginTop: 16 }]}>
              Novo e-mail{' '}
              <Text style={styles.optional}>(opcional)</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                novoEmail.length > 0 && !emailValido(novoEmail) && styles.inputError,
              ]}
              value={novoEmail}
              onChangeText={setNovoEmail}
              placeholder="Digite o novo e-mail"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {novoEmail.length > 0 && !emailValido(novoEmail) && (
              <Text style={styles.hintError}>E-mail inválido</Text>
            )}
            {novoEmail.length > 0 && emailValido(novoEmail) && (
              <Text style={styles.hintOk}>E-mail válido ✓</Text>
            )}

            {/* nova senha opcional */}
            <Text style={[styles.label, { marginTop: 16 }]}>
              Nova senha{' '}
              <Text style={styles.optional}>(opcional)</Text>
            </Text>
            <View style={[
              styles.inputRow,
              novaSenha.length > 0 && styles.inputRowFocus,
            ]}>
              <TextInput
                style={styles.inputInner}
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Deixe em branco para não alterar"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showNovaSenha}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNovaSenha(v => !v)}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name={showNovaSenha ? 'eye-slash' : 'eye'}
                  size={14}
                  color="#ffffff44"
                />
              </TouchableOpacity>
            </View>

            {/* confirmar senha */}
            <Text style={[styles.label, { marginTop: 16 }]}>
              Confirmar nova senha
            </Text>
            <View style={[
              styles.inputRow,
              confirmarSenha.length > 0 && (
                senhasIguais ? styles.inputRowOk : styles.inputRowError
              ),
            ]}>
              <TextInput
                style={styles.inputInner}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Repita a nova senha"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showConfirmar}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmar(v => !v)}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name={showConfirmar ? 'eye-slash' : 'eye'}
                  size={14}
                  color="#ffffff44"
                />
              </TouchableOpacity>
            </View>
            {confirmarSenha.length > 0 && (
              <Text style={senhasIguais ? styles.hintOk : styles.hintError}>
                {senhasIguais ? 'Senhas coincidem ✓' : 'Senhas não coincidem'}
              </Text>
            )}
          </View>

          {/* ── ERRO GERAL ── */}
          {erro !== '' && (
            <View style={styles.errorBox}>
              <FontAwesome5 name="exclamation-triangle" size={13} color={Colors.danger} />
              <Text style={styles.errorText}>{erro}</Text>
            </View>
          )}

          {/* ── BOTÕES ── */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <FontAwesome5 name="save" size={14} color={Colors.bgPrimary} />
              <Text style={styles.saveBtnText}>Salvar alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="arrow-left" size={13} color="#ffffff55" />
              <Text style={styles.cancelBtnText}>Voltar sem salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ffffff14',
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

  // avatar
  avatarSection: {
    alignItems: 'center', paddingVertical: 24,
    borderBottomWidth: 0.5, borderBottomColor: '#ffffff10', gap: 8,
  },
  avatarRing: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 1.5, borderColor: '#ffffff22',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#0a2218',
    borderWidth: 2, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarName: { color: '#fff', fontSize: 15, fontWeight: '600' },

  // seções
  section: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    borderBottomWidth: 0.5, borderBottomColor: '#ffffff10',
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '700',
    color: '#ffffff44', letterSpacing: 1.5, marginBottom: 16,
  },
  label:    { fontSize: 11, color: '#8BA89A', marginBottom: 6, marginLeft: 2 },
  optional: { fontSize: 10, color: '#ffffff33' },

  // inputs
  input: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 10, borderWidth: 0.5, borderColor: '#ffffff14',
    paddingHorizontal: 14, paddingVertical: 12,
    color: '#fff', fontSize: 14, marginBottom: 4,
  },
  inputError: { borderColor: Colors.danger },
  inputLocked: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#050f0a', borderRadius: 10,
    borderWidth: 0.5, borderColor: '#ffffff08',
    paddingHorizontal: 14, paddingVertical: 12,
  },
  inputLockedText: { color: '#ffffff44', fontSize: 14 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    borderRadius: 10, borderWidth: 0.5, borderColor: '#ffffff14',
    paddingHorizontal: 14, marginBottom: 4,
  },
  inputRowFocus: { borderColor: Colors.accent },
  inputRowOk:    { borderColor: Colors.accent },
  inputRowError: { borderColor: Colors.danger },
  inputInner:    { flex: 1, paddingVertical: 12, color: '#fff', fontSize: 14 },

  // badge verificado
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgSecondary,
    borderWidth: 0.5, borderColor: '#0d2e1c',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    marginTop: 6,
  },
  verifiedText: { color: '#6EE7B7', fontSize: 10 },

  // hints
  hintOk:    { fontSize: 11, color: Colors.accent, marginTop: 4, marginLeft: 2 },
  hintError: { fontSize: 11, color: Colors.danger,  marginTop: 4, marginLeft: 2 },

  // erro geral
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.dangerBg, padding: 12,
    borderRadius: 10, marginHorizontal: 20, marginTop: 16,
    borderWidth: 0.5, borderColor: Colors.danger,
  },
  errorText: { color: Colors.danger, fontSize: 13, flex: 1 },

  // botões
  actions: { padding: 20, gap: 10, marginTop: 4 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.accent, borderRadius: 10, padding: 14,
  },
  saveBtnText:  { color: Colors.bgPrimary, fontSize: 15, fontWeight: '700' },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 0.5, borderColor: '#ffffff20', borderRadius: 10, padding: 13,
  },
  cancelBtnText: { color: '#ffffff77', fontSize: 14 },
});