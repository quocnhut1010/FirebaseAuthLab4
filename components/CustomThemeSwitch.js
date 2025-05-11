//components/CustomThemeSwitch.js
import React from 'react';
import { View, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext'; // Đường dẫn tới ThemeContext của bạn

const CustomThemeSwitch = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const isDarkMode = theme === 'dark';

  // Màu sắc cho Switch component dựa trên theme
  // Bạn có thể cần điều chỉnh các màu này cho phù hợp
  const trackColor = {
    false: colors.switchTrackLight || '#767577', // Màu track khi switch OFF (Light mode)
    true: colors.switchTrackDark || '#81b0ff',   // Màu track khi switch ON (Dark mode)
  };
  const thumbColor = isDarkMode ? (colors.switchThumbDark || '#f5dd4b') : (colors.switchThumbLight || '#f4f3f4');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleTheme} style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="weather-sunny"
          size={26}
          color={isDarkMode ? colors.disabledText : colors.primary} // Mờ đi khi không active
        />
      </TouchableOpacity>

      <Switch
        trackColor={trackColor}
        thumbColor={thumbColor}
        ios_backgroundColor={trackColor.false} // Màu nền cho track trên iOS
        onValueChange={toggleTheme}
        value={isDarkMode}
        style={styles.switch}
      />

      <TouchableOpacity onPress={toggleTheme} style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="weather-night"
          size={26}
          color={isDarkMode ? colors.primary : colors.disabledText} // Mờ đi khi không active
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Căn giữa các item
    paddingVertical: 10,     // Tăng khoảng cách trên dưới
    // marginVertical: 15,      // Thêm khoảng cách với các element khác
  },
  iconContainer: {
    paddingHorizontal: 10, // Khoảng cách giữa icon và switch
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Làm switch to hơn một chút nếu cần
    marginHorizontal: 5,
  },
});

export default CustomThemeSwitch;