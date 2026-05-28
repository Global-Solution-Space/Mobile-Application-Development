// ═══════════════════════════════════════════════════════════════
// Terra Nova — Tela de Login
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, Animated
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FormInput } from '../../components/FormInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAppStore } from '../../store/useAppStore';

interface LoginScreenProps {
  navigation: any;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  const login = useAppStore(s => s.login);

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha para acessar.');
      return;
    }
    const ok = login(email.trim(), senha);
    if (!ok) {
      Alert.alert('Falha no login', 'E-mail ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        {/* ── Logo ─── */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="seedling" size={36} color={Colors.accent} />
          </View>
          <Text style={styles.appName}>Terra Nova</Text>
          <Text style={styles.subtitle}>Gestão Agrícola c/ Dados de Satélite</Text>
        </View>

        {/* ── Form ─── */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Acesso ao Sistema</Text>

          <FormInput
            iconName="envelope"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            iconName="lock"
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showSenha}
            rightIcon={showSenha ? 'eye-slash' : 'eye'}
            onRightIconPress={() => setShowSenha(!showSenha)}
          />

          <PrimaryButton
            title="Entrar no Sistema"
            icon="sign-in-alt"
            onPress={handleLogin}
          />

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Novo produtor?{' '}
              <Text style={styles.registerHighlight}>Criar conta</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Info ─── */}
        <Text style={styles.hint}>
          Demo: enzo@terranova.com / 123456
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentGlow,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  eyeBtn: {
    padding: 8,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 52,
    gap: 10,
    marginTop: 8,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.bgPrimary,
  },
  registerLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerHighlight: {
    color: Colors.accent,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 24,
    fontStyle: 'italic',
  },
});
