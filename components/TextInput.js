// components/TextInput.js
import React from 'react';
import { View, TextInput as DefaultTextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Hoặc bộ icon khác bạn thích
import { Colors } from '../config'; // Giả sử bạn đã tạo config/theme.js

const TextInput = ({
  leftIconName,
  rightIconName,
  onRightIconPress,
  style,
  inputStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      {leftIconName && (
        <MaterialCommunityIcons
          name={leftIconName}
          size={22}
          color={Colors.darkGray} // Màu icon
          style={styles.icon}
        />
      )}
      <DefaultTextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={Colors.darkGray} // Màu placeholder
        {...rest}
      />
      {rightIconName && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
          <MaterialCommunityIcons
            name={rightIconName}
            size={22}
            color={Colors.darkGray}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray, // Màu viền
    borderRadius: 8, // Bo góc
    paddingHorizontal: 10,
    marginBottom: 12, // Khoảng cách dưới mặc định
    backgroundColor: Colors.white, // Nền input
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48, // Chiều cao input
    fontSize: 16,
    color: Colors.black, // Màu chữ khi nhập
  },
  rightIconContainer: {
    paddingLeft: 10, // Tạo khoảng cách nếu có icon phải
  }
});

export default TextInput;