// components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../config';

const Button = ({ title, onPress, style, textStyle, variant = 'filled', disabled, loading }) => {
  const buttonStyles = [
    styles.button,
    variant === 'filled' ? styles.filledButton : styles.outlinedButton,
    style,
    disabled || loading ? styles.disabledButton : {},
  ];

  const textStyles = [
    styles.text,
    variant === 'filled' ? styles.filledButtonText : styles.outlinedButtonText,
    textStyle,
    disabled || loading ? styles.disabledButtonText : {},
  ];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'filled' ? Colors.white : Colors.primary} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    width: '100%', // Mặc định full width, có thể override bằng style prop
  },
  filledButton: {
    backgroundColor: Colors.primary,
  },
  outlinedButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabledButton: {
    opacity: 0.6, // Giảm độ mờ khi bị disable
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filledButtonText: {
    color: Colors.white,
  },
  outlinedButtonText: {
    color: Colors.primary,
  },
  disabledButtonText: {
    // Có thể giữ nguyên màu hoặc thay đổi nếu muốn
  }
});

export default Button;