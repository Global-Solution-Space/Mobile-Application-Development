// ═══════════════════════════════════════════════════════════════
// Terra Nova — Gerenciamento de Propriedades (CRUD Completo)
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { FormInput } from '../../components/FormInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { StatusBadge } from '../../components/StatusBadge';
import { ValidationError } from '../../components/ValidationError';
import { useAppStore } from '../../store/useAppStore';
import { PropriedadeSchema } from '../../schemas';
import { Propriedade } from '../../types';
import { validarCoordenadasNoBrasil } from '../../utils/geolocation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

interface GerenciarPropriedadesScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GerenciarPropriedades'>;
}

export function GerenciarPropriedadesScreen({ navigation }: GerenciarPropriedadesScreenProps) {
  const {
    propriedades, talhoes, localizacoes,
    addPropriedade, updatePropriedade, deletePropriedade,
    addLocalizacao, currentUser
  } = useAppStore();

  const [editProp, setEditProp] = useState<Propriedade | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [nome, setNome] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [erro, setErro] = useState('');

  const openCreate = () => {
    setIsCreating(true);
    setEditProp(null);
    setNome('');
    setTamanho('');
    setLat('');
    setLon('');
    setErro('');
  };

  const openEdit = (prop: Propriedade) => {
    setEditProp(prop);
    setIsCreating(false);
    setNome(prop.nome);
    setTamanho(prop.tamanhoTotal.toString());
    const loc = localizacoes.find(l => l.id === prop.idLocalizacao);
    if (loc) {
      setLat(loc.locLatitude.toString());
      setLon(loc.locLongitude.toString());
    } else {
      setLat('');
      setLon('');
    }
    setErro('');
  };

  const handleSave = async () => {
    setErro('');
    if (!currentUser) {
      setErro('Produtor não autenticado.');
      return;
    }

    const validation = PropriedadeSchema.safeParse({
      nome: nome,
      tamanhoTotal: tamanho,
      locLatitude: lat,
      locLongitude: lon
    });

    if (!validation.success) {
      setErro(validation.error.issues[0].message);
      return;
    }

    const { nome: propNome, tamanhoTotal, locLatitude, locLongitude } = validation.data;

    const geoValidation = await validarCoordenadasNoBrasil(locLatitude, locLongitude);
    if (!geoValidation.isValid) {
      setErro(geoValidation.message!);
      return;
    }

    if (editProp) {
      let locId = localizacoes.find(
        l => l.locLatitude === locLatitude && l.locLongitude === locLongitude
      )?.id;

      if (!locId) {
        const novaLoc = await addLocalizacao({ locLatitude, locLongitude });
        if (!novaLoc) {
          setErro('Erro ao cadastrar localização.');
          return;
        }
        locId = novaLoc.id;
      }

      const success = await updatePropriedade(editProp.id, {
        nome: propNome,
        tamanhoTotal,
        idProdutor: currentUser.id,
        idLocalizacao: locId
      });
      if (success) {
        setEditProp(null);
      }
    } else {
      let locId = localizacoes.find(l => l.locLatitude === locLatitude && l.locLongitude === locLongitude)?.id;

      if (!locId) {
        const novaLoc = await addLocalizacao({ locLatitude, locLongitude });
        if (!novaLoc) {
          setErro('Erro ao cadastrar localização.');
          return;
        }
        locId = novaLoc.id;
      }

      const success = await addPropriedade({
        nome: propNome,
        tamanhoTotal,
        idProdutor: currentUser.id,
        idLocalizacao: locId
      });
      if (success) {
        setIsCreating(false);
      }
    }
  };

  const confirmDelete = (prop: Propriedade) => {
    const talhoesVinculados = talhoes.filter(t => t.idPropriedade === prop.id).length;

    Alert.alert(
      'Remover Propriedade',
      `Deseja remover a propriedade ${prop.nome} permanentemente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deletePropriedade(prop.id) }
      ]
    );
  };

  // Se estiver criando ou editando, renderiza o formulário inline (como no TalhoesScreen)
  if (isCreating || editProp) {
    return (
      <View style={styles.container}>
        <Header title={editProp ? `Editar — ${editProp.nome}` : 'Nova Propriedade'} showBackButton={false} />
        <ScrollView style={styles.editContainer}>
          <FormInput
            label="Nome da Propriedade *"
            iconName="warehouse"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Fazenda Terra Nova"
          />

          <FormInput
            label="Tamanho Total (ha) *"
            iconName="ruler-combined"
            value={tamanho}
            onChangeText={setTamanho}
            keyboardType="numeric"
            placeholder="Ex: 120.5"
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
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

          <ValidationError message={erro} onClear={() => setErro('')} />

          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                title="Cancelar"
                icon="arrow-left"
                variant="outline"
                onPress={() => {
                  setEditProp(null);
                  setIsCreating(false);
                }}
              />
            </View>
            <View style={{ flex: 2 }}>
              <PrimaryButton
                title="Salvar Alterações"
                icon="save"
                onPress={handleSave}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  const renderItem = ({ item }: { item: Propriedade }) => {
    const qtTalhoes = talhoes.filter(t => t.idPropriedade === item.id).length;
    const loc = localizacoes.find(l => l.id === item.idLocalizacao);

    return (
      <View style={styles.talhaoCard}>
        <View style={styles.talhaoHeader}>
          <View style={styles.talhaoNameRow}>
            <Text style={styles.talhaoEmoji}>🚜</Text>
            <View>
              <Text style={styles.talhaoCultura}>{item.nome}</Text>
              <Text style={styles.talhaoPropriedade}>
                {loc ? `Lat: ${loc.locLatitude} · Lon: ${loc.locLongitude}` : 'Sem coordenadas'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.talhaoDetails}>
          <View style={styles.detailItem}>
            <FontAwesome5 name="ruler-combined" size={11} color={Colors.textMuted} />
            <Text style={styles.detailText}>{item.tamanhoTotal} ha</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome5 name="seedling" size={11} color={Colors.textMuted} />
            <Text style={styles.detailText}>{qtTalhoes} talhão(ões)</Text>
          </View>
        </View>

        <View style={styles.talhaoActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)} activeOpacity={0.7}>
            <FontAwesome5 name="edit" size={13} color={Colors.info} />
            <Text style={[styles.irrigaBtnText, { color: Colors.info, marginLeft: 6 }]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)} activeOpacity={0.7}>
            <FontAwesome5 name="trash" size={13} color={Colors.danger} />
            <Text style={[styles.irrigaBtnText, { color: Colors.danger, marginLeft: 6 }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Propriedades" showBackButton />

      <TouchableOpacity style={styles.addTalhaoBtnFull} onPress={openCreate} activeOpacity={0.85}>
        <FontAwesome5 name="plus" size={14} color={Colors.bgPrimary} />
        <Text style={styles.addTalhaoBtnFullText}>Cadastrar Nova Propriedade</Text>
      </TouchableOpacity>

      <View style={styles.countRow}>
        <Text style={styles.countText}>{propriedades.length} propriedade(s) encontrada(s)</Text>
      </View>

      <FlatList
        data={propriedades}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="map"
            title="Nenhuma propriedade encontrada"
            subtitle='Toque em "Cadastrar Nova Propriedade" para começar!'
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { padding: 16, paddingBottom: 100 },

  addTalhaoBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },
  addTalhaoBtnFullText: { color: Colors.bgPrimary, fontSize: 15, fontWeight: '700' },
  countRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  countText: { fontSize: 12, color: Colors.textMuted },

  talhaoCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12
  },
  talhaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  talhaoNameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  talhaoEmoji: { fontSize: 28 },
  talhaoCultura: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  talhaoPropriedade: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  talhaoDetails: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailText: { fontSize: 12, color: Colors.textSecondary },

  talhaoActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  irrigaBtnText: { fontSize: 13, color: Colors.info, fontWeight: '700' },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center'
  },

  editContainer: { padding: 20 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 }
});
