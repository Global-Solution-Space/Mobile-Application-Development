import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { FAQ_DATA } from '../../data/faq';

export function FaqScreen() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>

      <Header title="Manual de Cultivo" showBackButton />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={20} color={Colors.accent} />
          <Text style={styles.infoText}>
            Encontre respostas rápidas sobre o uso do Terra Nova e o manejo das suas propriedades.
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

  scroll: { padding: 20, paddingBottom: 40 },

  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.accentGlow,
    padding: 16, borderRadius: 12, marginBottom: 24, gap: 12,
    borderWidth: 1, borderColor: Colors.accent,
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
    backgroundColor: Colors.accentGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  iconCircleActive: { backgroundColor: Colors.accent },
  answerBox: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 },
  answerText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});