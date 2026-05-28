import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  bg: '#04100B',
  bgCard: '#071a10',
  primary: '#10B981',
  text: '#ffffff',
  textMuted: '#8BA89A',
  danger: '#f87171',
};

export function EditarPerfilScreen() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('Luna de Carvalho');
  const [base, setBase] = useState('Marte Alpha');
  const [email, setEmail] = useState('luna@terranova.com');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSave = () => {
    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    Alert.alert("Sucesso", "Perfil atualizado com êxito!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Editar Perfil" />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <InputField label="Nome de Exibição" value={nome} onChangeText={setNome} />
          <InputField label="Planeta/Base" value={base} onChangeText={setBase} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança da Conta</Text>
          <InputField label="E-mail Atual" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField label="Nova Senha" secureTextEntry value={novaSenha} onChangeText={setNovaSenha} />
          <InputField label="Confirmar Nova Senha" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={COLORS.textMuted} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { color: COLORS.primary, fontSize: 14, fontWeight: '700', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputGroup: { marginBottom: 15 },
  label: { color: COLORS.textMuted, fontSize: 12, marginBottom: 5, marginLeft: 2 },
  input: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: '#ffffff12', borderRadius: 10, padding: 14, color: COLORS.text, fontSize: 15 },
  buttonGroup: { gap: 10, marginTop: 10 },
  saveButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: COLORS.bg, fontSize: 15, fontWeight: 'bold' },
  backButton: { padding: 16, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ffffff20' },
  backButtonText: { color: COLORS.text, fontSize: 15, fontWeight: '600' }
});