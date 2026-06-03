import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';

interface ModalPropriedadeProps {
  visible: boolean;
  onClose: () => void;
}

export function ModalPropriedade({ visible, onClose }: ModalPropriedadeProps) {
  const { addPropriedade, localizacoes, addLocalizacao, currentUser } = useAppStore();
  
  const [novaPropNome, setNovaPropNome] = useState('');
  const [novaPropTamanho, setNovaPropTamanho] = useState('');
  const [novaPropLat, setNovaPropLat] = useState('');
  const [novaPropLon, setNovaPropLon] = useState('');

  const handleSaveProp = async () => {
    if (!novaPropNome.trim() || !novaPropTamanho.trim() || !novaPropLat.trim() || !novaPropLon.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos da Propriedade.');
      return;
    }
    const latitude = parseFloat(novaPropLat);
    const longitude = parseFloat(novaPropLon);

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert('Erro', 'Latitude e Longitude devem ser numéricos.');
      return;
    }

    if (!currentUser) {
      Alert.alert('Erro', 'Produtor não autenticado.');
      return;
    }

    let locId = localizacoes.find(l => l.locLatitude === latitude && l.locLongitude === longitude)?.id;
    if (!locId) {
      const novaLoc = await addLocalizacao({ locLatitude: latitude, locLongitude: longitude });
      if (!novaLoc) {
        Alert.alert('Erro', 'Erro ao cadastrar localização.');
        return;
      }
      locId = novaLoc.id;
    }

    await addPropriedade({
      nome: novaPropNome.trim(),
      tamanhoTotal: parseFloat(novaPropTamanho),
      idProdutor: currentUser.id,
      idLocalizacao: locId,
    });

    setNovaPropNome('');
    setNovaPropTamanho('');
    setNovaPropLat('');
    setNovaPropLon('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoiding}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Propriedade</Text>
            
            <Text style={styles.label}>Nome da Propriedade</Text>
            <TextInput
              style={styles.input}
              value={novaPropNome}
              onChangeText={setNovaPropNome}
              placeholder="Ex: Fazenda Boa Vista"
              placeholderTextColor={Colors.textMuted}
            />
            
            <Text style={styles.label}>Tamanho Total (ha)</Text>
            <TextInput
              style={styles.input}
              value={novaPropTamanho}
              onChangeText={setNovaPropTamanho}
              placeholder="Ex: 100"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput style={styles.input} value={novaPropLat} onChangeText={setNovaPropLat} keyboardType="numeric" placeholderTextColor={Colors.textMuted} />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput style={styles.input} value={novaPropLon} onChangeText={setNovaPropLon} keyboardType="numeric" placeholderTextColor={Colors.textMuted} />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveProp}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  keyboardAvoiding: { width: '100%', alignItems: 'center' },
  modalContent: { backgroundColor: Colors.bgSecondary, width: '100%', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    color: Colors.textPrimary, fontSize: 14, marginBottom: 4,
  },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  col: { flex: 1 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancel: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, backgroundColor: Colors.bgTertiary },
  modalCancelText: { color: Colors.textSecondary, fontWeight: '600' },
  modalSave: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, backgroundColor: Colors.accent },
  modalSaveText: { color: Colors.bgPrimary, fontWeight: '700' },
});
