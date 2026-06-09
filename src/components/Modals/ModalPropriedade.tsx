import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { PropriedadeSchema } from '../../schemas';
import { ValidationError } from '../../components/ValidationError';
import { validarCoordenadasNoBrasil } from '../../utils/geolocation';

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
  const [erro, setErro] = useState('');

  const handleSaveProp = async () => {
    setErro('');
    if (!currentUser) {
      setErro('Produtor não autenticado.');
      return;
    }

    const validation = PropriedadeSchema.safeParse({
      nome: novaPropNome,
      tamanhoTotal: novaPropTamanho,
      locLatitude: novaPropLat,
      locLongitude: novaPropLon
    });

    if (!validation.success) {
      setErro(validation.error.issues[0].message);
      return;
    }

    const { nome, tamanhoTotal, locLatitude, locLongitude } = validation.data;

    const geoValidation = await validarCoordenadasNoBrasil(locLatitude, locLongitude);
    if (!geoValidation.isValid) {
      setErro(geoValidation.message!);
      return;
    }

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
      nome,
      tamanhoTotal,
      idProdutor: currentUser.id,
      idLocalizacao: locId,
    });

    if (success) {
      setNovaPropNome('');
      setNovaPropTamanho('');
      setNovaPropLat('');
      setNovaPropLon('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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

            <ValidationError message={erro} onClear={() => setErro('')} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveProp}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
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
