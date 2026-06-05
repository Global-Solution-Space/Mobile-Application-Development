// ═══════════════════════════════════════════════════════════════
// Terra Nova — Gerenciamento de Talhões (Criar e Editar)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FormInput } from '../../components/FormInput';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { SelectChip } from '../../components/SelectChip';
import { ModalTipoPlantacao } from '../../components/Modals/ModalTipoPlantacao';
import { useAppStore } from '../../store/useAppStore';
import { TalhaoSchema } from '../../schemas';
import { ValidationError } from '../../components/ValidationError';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { validarCoordenadasNoBrasil } from '../../utils/geolocation';

type Props = NativeStackScreenProps<RootStackParamList, 'GerenciarTalhoes'>;

export function GerenciarTalhoesScreen({ navigation, route }: Props) {
  const editId = route.params?.editId;
  const { talhoes, addTalhao, updateTalhao, propriedades, tiposPlantacao, localizacoes, addLocalizacao } = useAppStore();

  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  const [tipoId, setTipoId] = useState<number | null>(null);
  const [propId, setPropId] = useState<number | null>(null);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [erro, setErro] = useState('');

  const [modalTipo, setModalTipo] = useState(false);

  useEffect(() => {
    if (editId) {
      const talhaoToEdit = talhoes.find(t => t.id === editId);
      if (talhaoToEdit) {
        setNome(talhaoToEdit.nomeTalhao);
        setArea(talhaoToEdit.volumArea.toString());
        setTipoId(talhaoToEdit.idTipoPlantacao);
        setPropId(talhaoToEdit.idPropriedade);

        const loc = localizacoes.find(l => l.id === talhaoToEdit.idLocalizacao);
        if (loc) {
          setLat(loc.locLatitude.toString());
          setLon(loc.locLongitude.toString());
        }
      }
    }
  }, [editId, talhoes, localizacoes]);

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

    const geoValidation = await validarCoordenadasNoBrasil(locLatitude, locLongitude);
    if (!geoValidation.isValid) {
      setErro(geoValidation.message!);
      return;
    }

    // Validação local de limites de área da propriedade
    const prop = propriedades.find(p => p.id === idPropriedade);
    if (prop) {
      const otherTalhoes = talhoes.filter(t => t.idPropriedade === idPropriedade && t.id !== editId);
      const currentSum = otherTalhoes.reduce((sum, t) => sum + t.volumArea, 0);
      if (currentSum + volumArea > prop.tamanhoTotal) {
        setErro(`A área total ocupada pelos talhões (${currentSum + volumArea} ha) excederia o tamanho total da propriedade "${prop.nome}" (${prop.tamanhoTotal} ha).`);
        return;
      }
    }

    // Procura localização existente
    let finalLocId = localizacoes.find(l => l.locLatitude === locLatitude && l.locLongitude === locLongitude)?.id;

    // Se não existir, cria
    if (!finalLocId) {
      const novaLoc = await addLocalizacao({ locLatitude, locLongitude });
      if (!novaLoc) {
        setErro('Erro ao cadastrar localização do Talhão.');
        return;
      }
      finalLocId = novaLoc.id;
    }

    let success = false;
    if (editId) {
      success = await updateTalhao(editId, {
        nomeTalhao,
        volumArea,
        idTipoPlantacao,
        idPropriedade,
        idLocalizacao: finalLocId,
      });
    } else {
      success = await addTalhao({
        nomeTalhao,
        volumArea,
        idTipoPlantacao,
        idPropriedade,
        idLocalizacao: finalLocId,
      });
    }

    if (success) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Header title={editId ? "Editar Talhão" : "Criar Talhão"} showBackButton />
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

            <Text style={[styles.label, { marginTop: 16, marginBottom: 8 }]}>Propriedade *</Text>
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
                <Text style={styles.emptyText}>Nenhuma propriedade encontrada. Você precisa cadastrar uma propriedade primeiro.</Text>
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

          <View style={{ paddingHorizontal: 20 }}>
            <ValidationError message={erro} onClear={() => setErro('')} />
          </View>

          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                title="Cancelar"
                icon="times"
                variant="outline"
                onPress={() => navigation.goBack()}
              />
            </View>
            <View style={{ flex: 2 }}>
              <PrimaryButton
                title={editId ? "Salvar Alterações" : "Salvar Talhão"}
                icon="save"
                onPress={handleSaveTalhao}
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <ModalTipoPlantacao visible={modalTipo} onClose={() => setModalTipo(false)} />

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
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 12,
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
