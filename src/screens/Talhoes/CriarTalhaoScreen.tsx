// ═══════════════════════════════════════════════════════════════
// Terra Nova — Criar Talhão (e Entidades Vinculadas)
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FormInput } from '../../components/FormInput';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { SelectChip } from '../../components/SelectChip';
import { ModalTipoPlantacao } from '../../components/Modals/ModalTipoPlantacao';
import { ModalPropriedade } from '../../components/Modals/ModalPropriedade';
import { useAppStore } from '../../store/useAppStore';
import { TalhaoSchema } from '../../schemas';
import { ValidationError } from '../../components/ValidationError';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface CriarTalhaoScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CriarTalhao'>;
}

export function CriarTalhaoScreen({ navigation }: CriarTalhaoScreenProps) {
  const { 
    addTalhao, propriedades, tiposPlantacao, localizacoes, 
    addLocalizacao, currentUser 
  } = useAppStore();

  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  
  const [tipoId, setTipoId] = useState<number | null>(null);
  const [propId, setPropId] = useState<number | null>(null);

  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const [erro, setErro] = useState('');

  // Modais de Criação Rápida
  const [modalTipo, setModalTipo] = useState(false);
  const [modalProp, setModalProp] = useState(false);

  const handleSaveTalhao = async () => {
    setErro('');

    const validation = TalhaoSchema.safeParse({
      nomeTalhao: nome,
      volumArea: area,
      locLatitude: lat,
      locLongitude: lon,
      idTipoPlantacao: tipoId,
      idPropriedade: propId
    });

    if (!validation.success) {
      setErro(validation.error.issues[0].message);
      return;
    }

    const { nomeTalhao, volumArea, locLatitude, locLongitude, idTipoPlantacao, idPropriedade } = validation.data;

    // Procura localização existente
    let locId = localizacoes.find(l => l.locLatitude === locLatitude && l.locLongitude === locLongitude)?.id;
    
    // Se não existir, cria
    if (!locId) {
      const novaLoc = await addLocalizacao({ locLatitude, locLongitude });
      if (!novaLoc) {
        setErro('Erro ao cadastrar localização do Talhão.');
        return;
      }
      locId = novaLoc.id;
    }

    await addTalhao({
      nomeTalhao,
      volumArea,
      idTipoPlantacao,
      idPropriedade,
      idLocalizacao: locId,
    });

    Alert.alert('Sucesso', 'Talhão cadastrado com sucesso!');
    
    // Reseta form
    setNome('');
    setArea('');
    setTipoId(null);
    setPropId(null);
    setLat('');
    setLon('');
    
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Criar Talhão" showBackButton />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMAÇÕES DO TALHÃO</Text>

            <FormInput
              label="Nome / Identificação *"
              iconName="tag"
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Talhão Sul 01"
            />

            <FormInput
              label="Volume / Área (ha) *"
              iconName="ruler-combined"
              value={area}
              onChangeText={setArea}
              placeholder="Ex: 5.5"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VÍNCULOS</Text>

            <View style={styles.labelRow}>
              <Text style={styles.label}>Tipo de Plantação *</Text>
              <TouchableOpacity onPress={() => setModalTipo(true)}>
                <Text style={styles.addLink}>+ Novo</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {tiposPlantacao.map(t => (
                <SelectChip
                  key={t.id}
                  label={t.tipoPlant}
                  isActive={tipoId === t.id}
                  onPress={() => setTipoId(t.id)}
                />
              ))}
              {tiposPlantacao.length === 0 && (
                <Text style={styles.emptyText}>Nenhum tipo encontrado. Adicione um novo.</Text>
              )}
            </ScrollView>

            <View style={[styles.labelRow, { marginTop: 16 }]}>
              <Text style={styles.label}>Propriedade *</Text>
              <TouchableOpacity onPress={() => setModalProp(true)}>
                <Text style={styles.addLink}>+ Nova</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {propriedades.map(p => (
                <SelectChip
                  key={p.id}
                  label={p.nome}
                  isActive={propId === p.id}
                  onPress={() => setPropId(p.id)}
                />
              ))}
              {propriedades.length === 0 && (
                <Text style={styles.emptyText}>Nenhuma propriedade encontrada. Adicione uma nova.</Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCALIZAÇÃO (GPS) DO TALHÃO</Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <FormInput
                  label="Latitude *"
                  iconName="map-marker-alt"
                  value={lat}
                  onChangeText={setLat}
                  placeholder="Ex: -23.5505"
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormInput
                  label="Longitude *"
                  iconName="map-marker-alt"
                  value={lon}
                  onChangeText={setLon}
                  placeholder="Ex: -46.6333"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <ValidationError message={erro} />

          <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
            <PrimaryButton
              title="Salvar Talhão"
              icon="save"
              onPress={handleSaveTalhao}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <ModalTipoPlantacao visible={modalTipo} onClose={() => setModalTipo(false)} />
      <ModalPropriedade visible={modalProp} onClose={() => setModalProp(false)} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingBottom: 60 },
  
  section: {
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '700',
    color: Colors.accent, letterSpacing: 1.5, marginBottom: 16,
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  addLink: { fontSize: 12, color: Colors.info, fontWeight: '700' },
  chipScroll: { paddingBottom: 4 },
  emptyText: { color: Colors.textMuted, fontSize: 12, fontStyle: 'italic' },
});
