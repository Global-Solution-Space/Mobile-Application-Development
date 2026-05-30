import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 👈 adiciona
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    id: '1',
    pergunta: 'O que significa quando um Lote está em status "Crítico"?',
    resposta: 'Indica que os sensores ou a análise de satélite detectaram anomalias graves, como estresse hídrico agudo, pragas ou temperatura extrema. Recomenda-se verificar o lote imediatamente.'
  },
  {
    id: '2',
    pergunta: 'Como funciona a análise por satélite?',
    resposta: 'O sistema utiliza dados geoespaciais e análise espectral para varrer a área de cultivo buscando anomalias foliares e problemas no solo. Quando detectados, alertas vermelhos aparecerão no seu Dashboard inicial.'
  },
  {
    id: '3',
    pergunta: 'Posso alterar a quantidade mínima de um insumo?',
    resposta: 'Sim! Acesse a aba "Estoque", toque no ícone de lápis do insumo desejado e ajuste o valor no campo "Alerta de Estoque Baixo". O sistema te avisará quando a quantidade cair abaixo desse número.'
  },
  {
    id: '4',
    pergunta: 'O que fazer se o sistema de irrigação falhar?',
    resposta: 'O aplicativo emitirá um Evento Crítico. Você pode acionar a irrigação manual de emergência indo até as ações rápidas do Lote específico ou registrando a irrigação manual no menu.'
  },
  {
    id: '5',
    pergunta: 'Como o Terra Nova ajuda na sustentabilidade?',
    resposta: 'Ao monitorar exatamente o que a planta precisa (água, luz e nutrientes), evitamos o desperdício de recursos naturais e a aplicação excessiva de fertilizantes químicos, protegendo o solo e economizando água.'
  },
];

export function FaqScreen() {
  const navigation = useNavigation(); // 👈 adiciona
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>

      {/* ── HEADER COM VOLTAR ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="arrow-left" size={14} color="#ffffff99" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual de Cultivo</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={20} color={Colors.accent} />
          <Text style={styles.infoText}>
            Encontre respostas rápidas sobre o uso do Terra Nova e o manejo das suas estufas inteligentes.
          </Text>
        </View>

        {FAQ_DATA.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <View key={item.id} style={[styles.card, isExpanded && styles.cardExpanded]}>
              <TouchableOpacity
                style={styles.cardHeader}
                activeOpacity={0.7}
                onPress={() => toggleExpand(item.id)}
              >
                <Text style={[styles.questionText, isExpanded && styles.questionTextActive]}>
                  {item.pergunta}
                </Text>
                <View style={[styles.iconCircle, isExpanded && styles.iconCircleActive]}>
                  <FontAwesome5
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={12}
                    color={isExpanded ? Colors.bgPrimary : Colors.accent}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerText}>{item.resposta}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },

  // ── header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ffffff14',
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 0.5, borderColor: '#ffffff14',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    color: '#fff', fontSize: 16, fontWeight: '600',
  },

  scroll: { padding: 20, paddingBottom: 40 },

  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16, borderRadius: 12, marginBottom: 24, gap: 12,
    borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  infoText: { flex: 1, color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },

  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: 12,
    marginBottom: 12, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  cardExpanded: { borderColor: Colors.accent },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 16, gap: 16,
  },
  questionText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  questionTextActive: { color: Colors.accent },
  iconCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconCircleActive: { backgroundColor: Colors.accent },
  answerBox: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 },
  answerText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});