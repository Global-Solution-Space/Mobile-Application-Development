// ═══════════════════════════════════════════════════════════════
// Terra Nova — Tela de Cadastro de Usuário
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FormInput } from '../../components/FormInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAppStore } from '../../store/useAppStore';
import { RegisterSchema } from '../../schemas';
import { ValidationError } from '../../components/ValidationError';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
}

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [ddd, setDdd] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  const register = useAppStore(s => s.register);

  const handleRegister = async () => {
    setErro('');
    const validation = RegisterSchema.safeParse({ nome, email, senha, confirmarSenha, ddd, telefone });
    
    if (!validation.success) {
      setErro(validation.error.issues[0].message);
      return;
    }

    const { nome: nomeValid, email: emailValid, senha: senhaValid, ddd: dddValid, telefone: telValid } = validation.data;
    const res = await register(nomeValid, emailValid, senhaValid, dddValid || '', telValid || '');
    if (!res.success) {
      if (res.errorType === 'network') {
        Alert.alert(
          'Erro de Conexão',
          'Não foi possível conectar ao servidor. Certifique-se de que a API Spring Boot está rodando e que o IP configurado em api.ts está correto.'
        );
      } else {
        Alert.alert('E-mail em uso', 'Este e-mail já está cadastrado no sistema.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.inner} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
          <FormInput
            iconName="user"
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
          />

          <FormInput
            iconName="envelope"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 0.3 }}>
              <FormInput
                placeholder="DDD"
                value={ddd}
                onChangeText={setDdd}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={{ flex: 0.7 }}>
              <FormInput
                iconName="phone"
                placeholder="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          <FormInput
            iconName="lock"
            placeholder="Senha (mín. 6 caracteres)"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <FormInput
            iconName="shield-alt"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          <ValidationError message={erro} />

          <PrimaryButton
            title="Criar Conta"
            icon="user-plus"
            onPress={handleRegister}
          />

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
    paddingTop: 60,
    paddingBottom: 80,
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
