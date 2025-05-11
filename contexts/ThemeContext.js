// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';

// Tạo Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Lấy scheme màu mặc định của hệ thống
  const systemColorScheme = Appearance.getColorScheme(); // 'light' | 'dark' | null
  const [theme, setTheme] = useState(systemColorScheme || 'light'); // Mặc định là 'light' nếu không có scheme hệ thống

  // Hàm để chuyển đổi theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Lắng nghe sự thay đổi scheme màu của hệ thống
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Cập nhật theme của ứng dụng nếu người dùng chưa tự chọn
      // (Trong trường hợp này, chúng ta sẽ ưu tiên cài đặt hệ thống khi nó thay đổi)
      if (colorScheme) {
        setTheme(colorScheme);
      }
    });

    // Dọn dẹp listener khi component unmount
    return () => subscription.remove();
  }, []);

  // Định nghĩa các màu sắc cho từng theme
  // Bạn có thể mở rộng với nhiều màu sắc hơn
  const themeColors = {
    light: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#6200EE',
      // ... các màu khác của bạn
      disabledText: '#9E9E9E', // Màu cho text/icon bị vô hiệu hóa ở light mode
      switchTrackLight: '#D1D1D6',
      switchThumbLight: '#FFFFFF', // Thường là màu trắng hoặc rất sáng
      // cardBackground: '#F5F5F5', // Ví dụ nếu bạn muốn nền cho switch container
    },
    dark: {
      background: '#121212',
      text: '#FFFFFF',
      primary: '#BB86FC',
      // ... các màu khác của bạn
      disabledText: '#757575', // Màu cho text/icon bị vô hiệu hóa ở dark mode
      switchTrackDark: '#424242', // Hoặc một màu track tối hơn, có thể là màu primary mờ
      switchThumbDark: '#BB86FC',   // Thường là màu primary hoặc màu sáng nổi bật
      // cardBackground: '#1E1E1E',
    },
  };

  const currentColors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook để sử dụng ThemeContext dễ dàng hơn
export const useTheme = () => useContext(ThemeContext);