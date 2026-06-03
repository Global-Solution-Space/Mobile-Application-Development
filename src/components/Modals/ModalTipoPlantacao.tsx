import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Colors } from '../../theme/colors';
import { useAppStore } from '../../store/useAppStore';
import { TipoPlantacaoSchema } from '../../schemas';
import { ValidationError } from '../../components/ValidationError';

interface ModalTipoPlantacaoProps {
  visible: boolean;
  onClose: () => void;
}

export function ModalTipoPlantacao({ visible, onClose }: ModalTipoPlantacaoProps) {
  const { addTipoPlantacao } = useAppStore();
  const [novoTipoNome, setNovoTipoNome] = useState('');
  const [erro, setErro] = useState('');

  const handleSaveTipo = async () => {
    setErro('');
    const validation = TipoPlantacaoSchema.safeParse({ tipoPlant: novoTipoNome });
    if (!validation.success) {
      setErro(validation.error.issues[0].message);
      return;
    }
    await addTipoPlantacao({ tipoPlant: validation.data.tipoPlant });
    setNovoTipoNome('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Novo Tipo de Plantação</Text>
          <Text style={styles.label}>Nome da Cultura (ex: Soja, Milho)</Text>
          <TextInput
            style={styles.input}
            value={novoTipoNome}
            onChangeText={setNovoTipoNome}
            placeholder="Digite o tipo"
            placeholderTextColor={Colors.textMuted}
          />

          <ValidationError message={erro} />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSave} onPress={handleSaveTipo}>
              <Text style={styles.modalSaveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: Colors.bgSecondary, width: '100%', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: Colors.bgSecondary, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, color: Colors.textPrimary, fontSize: 14, marginBottom: 4,},
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancel: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, backgroundColor: Colors.bgTertiary },
  modalCancelText: { color: Colors.textSecondary, fontWeight: '600' },
  modalSave: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, backgroundColor: Colors.accent },
  modalSaveText: { color: Colors.bgPrimary, fontWeight: '700' },
});
