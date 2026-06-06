import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { FormInput } from '../../components/FormInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ValidationError } from '../../components/ValidationError';
import { useAppStore } from '../../store/useAppStore';
import { EditarPerfilSchema } from '../../schemas';

type PerfilFormField = 'nome' | 'ddd' | 'telefone' | 'novoEmail' | 'novaSenha' | 'confirmarSenha';
type PerfilFormErrors = Partial<Record<PerfilFormField, string>>;

const perfilFormFields: PerfilFormField[] = ['nome', 'ddd', 'telefone', 'novoEmail', 'novaSenha', 'confirmarSenha'];

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
  const [errors, setErrors]                 = useState<PerfilFormErrors>({});

  const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const senhasIguais = novaSenha.length > 0 && novaSenha === confirmarSenha;

  const clearFieldError = (field: PerfilFormField) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (erro) setErro('');
  };

  const sanitizeDigits = (value: string) => value.replace(/\D/g, '');

  const setValidationErrors = (issues: Array<{ path: PropertyKey[]; message: string }>) => {
    const nextErrors: PerfilFormErrors = {};
    let fallbackMessage = '';

    issues.forEach((issue) => {
      const field = issue.path[0] as PerfilFormField | undefined;
      if (field && perfilFormFields.includes(field) && !nextErrors[field]) {
        nextErrors[field] = issue.message;
      } else if (!fallbackMessage) {
        fallbackMessage = issue.message;
      }
    });

    setErrors(nextErrors);
    setErro(Object.keys(nextErrors).length > 0 ? '' : fallbackMessage || 'Revise os campos destacados.');
  };

  const handleSave = async () => {
    setErro('');
    setErrors({});

    const validation = EditarPerfilSchema.safeParse({
      nome,
      ddd,
      telefone,
      novoEmail,
      novaSenha,
      confirmarSenha,
    });

    if (!validation.success) {
      setValidationErrors(validation.error.issues);
      return;
    }

    const {
      nome: nomeValid,
      ddd: dddValid,
      telefone: telefoneValid,
      novoEmail: novoEmailValid,
      novaSenha: novaSenhaValid,
    } = validation.data;

    const updates: Record<string, string> = { nome: nomeValid };
    if (novoEmailValid) updates.email = novoEmailValid;
    if (novaSenhaValid) updates.senha = novaSenhaValid;

    const telefoneUpdates = {
      ddd: dddValid,
      numero: telefoneValid,
    };

    const success = await updateProfile(updates, telefoneUpdates);

    if (success) {
      navigation.goBack();
    } else {
      setErro('Não foi possível atualizar o perfil. Verifique os Dados e tente novamente.');
    }
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
              onChangeText={(value) => {
                setNome(value);
                clearFieldError('nome');
              }}
              placeholder="Seu nome"
              error={errors.nome}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 0.3 }}>
                <FormInput
                  label="DDD"
                  value={ddd}
                  onChangeText={(value) => {
                    setDdd(sanitizeDigits(value));
                    clearFieldError('ddd');
                    clearFieldError('telefone');
                  }}
                  placeholder="Ex: 11"
                  keyboardType="numeric"
                  maxLength={2}
                  error={errors.ddd}
                />
              </View>
              <View style={{ flex: 0.7 }}>
                <FormInput
                  label="Telefone"
                  iconName="phone"
                  value={telefone}
                  onChangeText={(value) => {
                    setTelefone(sanitizeDigits(value));
                    clearFieldError('telefone');
                  }}
                  placeholder="Ex: 999999999"
                  keyboardType="numeric"
                  maxLength={9}
                  error={errors.telefone}
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
              onChangeText={(value) => {
                setNovoEmail(value);
                clearFieldError('novoEmail');
              }}
              placeholder="Digite o novo e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.novoEmail}
            />
            {!errors.novoEmail && novoEmail.length > 0 && !emailValido(novoEmail) && (
              <Text style={styles.hintError}>E-mail inválido</Text>
            )}
            {!errors.novoEmail && novoEmail.length > 0 && emailValido(novoEmail) && (
              <Text style={styles.hintOk}>E-mail válido ✓</Text>
            )}

            {/* nova senha opcional */}
            <FormInput
              label="Nova senha (opcional)"
              iconName="lock"
              value={novaSenha}
              onChangeText={(value) => {
                setNovaSenha(value);
                clearFieldError('novaSenha');
                clearFieldError('confirmarSenha');
              }}
              placeholder="Deixe em branco para não alterar"
              secureTextEntry={!showNovaSenha}
              rightIcon={showNovaSenha ? 'eye-slash' : 'eye'}
              onRightIconPress={() => setShowNovaSenha(v => !v)}
              error={errors.novaSenha}
            />

            {/* confirmar senha */}
            <FormInput
              label="Confirmar nova senha"
              iconName="shield-alt"
              value={confirmarSenha}
              onChangeText={(value) => {
                setConfirmarSenha(value);
                clearFieldError('confirmarSenha');
              }}
              placeholder="Repita a nova senha"
              secureTextEntry={!showConfirmar}
              rightIcon={showConfirmar ? 'eye-slash' : 'eye'}
              onRightIconPress={() => setShowConfirmar(v => !v)}
              error={errors.confirmarSenha}
            />
            {!errors.confirmarSenha && confirmarSenha.length > 0 && (
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
