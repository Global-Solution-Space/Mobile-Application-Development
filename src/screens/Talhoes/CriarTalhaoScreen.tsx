// ═══════════════════════════════════════════════════════════════
// Terra Nova — Criar Talhão (e Entidades Vinculadas)
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { SelectChip } from '../../components/SelectChip';
import { ModalTipoPlantacao } from '../../components/Modals/ModalTipoPlantacao';
import { ModalPropriedade } from '../../components/Modals/ModalPropriedade';
import { useAppStore } from '../../store/useAppStore';

export function CriarTalhaoScreen({ navigation }: any) {
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

    if (!nome.trim() || !area.trim() || !tipoId || !propId || !lat.trim() || !lon.trim()) {
      setErro('Preencha todos os campos do Talhão.');
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      setErro('Latitude e Longitude devem ser numéricos.');
      return;
    }

    // Procura localização existente
    let locId = localizacoes.find(l => l.locLatitude === latitude && l.locLongitude === longitude)?.id;
    
    // Se não existir, cria
    if (!locId) {
      const novaLoc = await addLocalizacao({ locLatitude: latitude, locLongitude: longitude });
      if (!novaLoc) {
        setErro('Erro ao cadastrar localização do Talhão.');
        return;
      }
      locId = novaLoc.id;
    }

    await addTalhao({
      nomeTalhao: nome.trim(),
      volumArea: parseFloat(area),
      idTipoPlantacao: tipoId,
      idPropriedade: propId,
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
            
            <Text style={styles.label}>Nome / Identificação *</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Talhão Sul 01"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.label}>Volume / Área (ha) *</Text>
            <TextInput
              style={styles.input}
              value={area}
              onChangeText={setArea}
              placeholder="Ex: 5.5"
              placeholderTextColor={Colors.textMuted}
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
                <Text style={styles.label}>Latitude *</Text>
                <TextInput
                  style={styles.input}
                  value={lat}
                  onChangeText={setLat}
                  placeholder="Ex: -23.5505"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Longitude *</Text>
                <TextInput
                  style={styles.input}
                  value={lon}
                  onChangeText={setLon}
                  placeholder="Ex: -46.6333"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {erro !== '' && (
            <View style={styles.errorBox}>
              <FontAwesome5 name="exclamation-triangle" size={13} color={Colors.danger} />
              <Text style={styles.errorText}>{erro}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTalhao} activeOpacity={0.85}>
            <FontAwesome5 name="save" size={14} color={Colors.bgPrimary} />
            <Text style={styles.saveBtnText}>Salvar Talhão</Text>
          </TouchableOpacity>

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
  input: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    color: Colors.textPrimary, fontSize: 14, marginBottom: 4,
  },
  chipScroll: { paddingBottom: 4 },
  emptyText: { color: Colors.textMuted, fontSize: 12, fontStyle: 'italic' },
  
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.dangerBg, padding: 12,
    borderRadius: 10, marginHorizontal: 20, marginTop: 24,
    borderWidth: 1, borderColor: Colors.danger,
  },
  errorText: { color: Colors.danger, fontSize: 13, flex: 1 },
  
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.accent, borderRadius: 12, padding: 16,
    marginHorizontal: 20, marginTop: 24,
  },
  saveBtnText: { color: Colors.bgPrimary, fontSize: 16, fontWeight: '700' },
});
