// ═══════════════════════════════════════════════════════════════
// Terra Nova — Componente FormInput
// Input estilizado com estado de Foco, Erro e Suporte a Ref
// ═══════════════════════════════════════════════════════════════

import React, { useState, forwardRef, ComponentProps } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface FormInputProps extends TextInputProps {
  iconName?: ComponentProps<typeof FontAwesome5>['name'];
  label?: string;
  rightIcon?: ComponentProps<typeof FontAwesome5>['name'];
  onRightIconPress?: () => void;
  error?: string;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ iconName, label, rightIcon, onRightIconPress, style, error, onFocus, onBlur, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Determina a cor de destaque (Borda/Icone)
    const highlightColor = error ? Colors.danger : (isFocused ? Colors.accent : Colors.border);
    const iconColor = error ? Colors.danger : (isFocused ? Colors.accent : Colors.textMuted);

    return (
      <View style={styles.wrapper}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        
        <View 
          style={[
            styles.container, 
            rest.multiline && { alignItems: 'flex-start', paddingVertical: 14, minHeight: 100 },
            { borderColor: highlightColor, backgroundColor: isFocused ? Colors.bgTertiary : Colors.bgInput }
          ]}
        >
          {iconName ? (
            <FontAwesome5 
              name={iconName} 
              size={16} 
              color={iconColor} 
              style={[styles.icon, rest.multiline && { marginTop: Platform.OS === 'ios' ? 2 : 4 }]} 
            />
          ) : null}
          
          <TextInput
            ref={ref}
            style={[styles.input, style, rest.multiline && { textAlignVertical: 'top', paddingTop: Platform.OS === 'android' ? 0 : undefined }]}
            placeholderTextColor={Colors.textMuted}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />
          
          {rightIcon && onRightIconPress ? (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightBtn}>
              <FontAwesome5 name={rightIcon} size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-circle" size={10} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>
    );
  }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  rightBtn: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 11,
    fontWeight: '500',
  }
});
