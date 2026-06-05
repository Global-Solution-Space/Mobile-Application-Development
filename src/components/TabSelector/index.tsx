import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface TabSelectorProps {
  activeTab: 'satveg' | 'nasa';
  onChange: (tab: 'satveg' | 'nasa') => void;
}

export function TabSelector({ activeTab, onChange }: TabSelectorProps) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'satveg' && styles.tabButtonActive]}
        onPress={() => onChange('satveg')}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="satellite" size={14} color={activeTab === 'satveg' ? Colors.accent : Colors.textSecondary} />
        <Text 
          style={[styles.tabButtonText, activeTab === 'satveg' && styles.tabButtonTextActive]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Embrapa SATveg
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'nasa' && styles.tabButtonActive]}
        onPress={() => onChange('nasa')}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="cloud-sun-rain" size={14} color={activeTab === 'nasa' ? Colors.accent : Colors.textSecondary} />
        <Text 
          style={[styles.tabButtonText, activeTab === 'nasa' && styles.tabButtonTextActive]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          NASA Power
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: Colors.accent,
  },
  tabButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    flexShrink: 1,
  },
  tabButtonTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
});
