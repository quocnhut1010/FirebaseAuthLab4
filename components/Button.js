// components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { Colors } from '../config'; 
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

const Button = ({ title, onPress, style, textStyle, variant = 'filled', disabled, loading }) => {
  const { colors, theme } = useTheme(); // Lấy theme và colors từ context

  // Xác định màu nền và màu chữ dựa trên variant và theme
  let backgroundColor, textColor, borderColor;

  if (variant === 'filled') {
    backgroundColor = colors.primary; // Màu chính của theme
    textColor = theme === 'light' ? '#FFFFFF' : colors.text; // Chữ trắng trên nền tối (hoặc màu text của theme nếu nền sáng)
    // Điều chỉnh màu chữ của filled button trên dark theme nếu cần.
    // Ví dụ: nếu colors.primary của dark theme là màu sáng, chữ có thể cần là màu tối.
    // Hiện tại, giả định colors.primary đủ tương phản với colors.text hoặc #FFFFFF.
    // Nếu bạn muốn màu chữ của filled button luôn là một màu cụ thể (ví dụ: trắng) bất kể theme, bạn có thể đặt cứng ở đây.
    // textColor = colors.buttonTextOnPrimary; // Hoặc một màu cụ thể bạn định nghĩa trong themeColors
  } else { // outlined
    backgroundColor = colors.background; // Nền của theme
    textColor = colors.primary; // Chữ màu chính của theme
    borderColor = colors.primary; // Viền màu chính của theme
  }

  const buttonStyles = [
    styles.button,
    { backgroundColor },
    variant === 'outlined' && { borderColor, borderWidth: 1 },
    style,
    (disabled || loading) ? styles.disabledButton : {},
  ];

  const textStyles = [
    styles.text,
    { color: textColor },
    textStyle,
    (disabled || loading) ? { color: theme === 'light' ? '#A0A0A0' : '#888888' } : {}, // Màu chữ mờ khi disable
  ];

  const indicatorColor = variant === 'filled' ? (theme === 'light' ? '#FFFFFF' : colors.text) : colors.primary;

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
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
    width: '100%',
  },
  // filledButton, outlinedButton sẽ được xử lý trực tiếp trong component bằng `colors`
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // filledButtonText, outlinedButtonText sẽ được xử lý trực tiếp trong component bằng `colors`
  // disabledButtonText đã được xử lý trong `textStyles`
});

export default Button;