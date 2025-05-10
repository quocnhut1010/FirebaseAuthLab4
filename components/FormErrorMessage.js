// components/FormErrorMessage.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../config';

const FormErrorMessage = ({ error, visible }) => {
  if (!error || !visible) {
    return null;
  }
  
  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: Colors.error, // Màu đỏ cho lỗi
    fontSize: 13,
    marginBottom: 8,
    // marginLeft: 2, // Tùy chỉnh nếu cần
    // fontWeight: '600',
  },
});

export default FormErrorMessage;