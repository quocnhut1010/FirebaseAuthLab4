// components/Logo.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Images } from '../config'; // Giả sử bạn đã tạo config/images.js

const Logo = ({ uri, style }) => {
  return (
    <Image
      source={uri || Images.logo} // Sử dụng uri nếu được cung cấp, nếu không dùng logo mặc định
      style={[styles.logo, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150, // Kích thước mặc định, có thể tùy chỉnh qua props
    height: 150, // Kích thước mặc định
    alignSelf: 'center', // Tự căn giữa
    // marginBottom: 20, // Khoảng cách dưới nếu cần
  },
});

export default Logo;