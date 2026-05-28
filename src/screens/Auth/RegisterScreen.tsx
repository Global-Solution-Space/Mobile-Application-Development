// ═══════════════════════════════════════════════════════════════
// Terra Nova — Tela de Cadastro de Usuário
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

interface RegisterScreenProps {
  navigation: any;
}

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const register = useAppStore(s => s.register);

  const handleRegister = () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para criar sua conta.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem. Verifique e tente novamente.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    const ok = register(nome.trim(), email.trim(), senha);
    if (!ok) {
      Alert.alert('E-mail em uso', 'Este e-mail já está cadastrado no sistema.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        {/* ── Header ─── */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color={Colors.accent} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="user-circle" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Registre-se na plataforma agrícola</Text>
        </View>

        {/* ── Form ─── */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <FontAwesome5 name="user" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={Colors.textMuted}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome5 name="envelope" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome5 name="lock" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha (mín. 6 caracteres)"
              placeholderTextColor={Colors.textMuted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome5 name="shield-alt" size={16} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor={Colors.textMuted}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.8}>
            <FontAwesome5 name="user-plus" size={16} color={Colors.bgPrimary} />
            <Text style={styles.registerBtnText}>Criar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginText}>
              Já tem conta?{' '}
              <Text style={styles.loginHighlight}>Fazer login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 44 : 20,
    left: 0,
    padding: 12,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accentGlow,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  formContainer: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
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
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 52,
    gap: 10,
    marginTop: 8,
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.bgPrimary,
  },
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginHighlight: {
    color: Colors.accent,
    fontWeight: '600',
  },
});
