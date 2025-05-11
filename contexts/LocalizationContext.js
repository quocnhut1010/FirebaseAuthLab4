// contexts/LocalizationContext.js
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Import instance i18n đã cấu hình từ Bước 3
// và các file dịch để khởi tạo lại instance nếu cần hoặc để truyền translations
import i18nConfigured from '../config/i18n'; // Đảm bảo đường dẫn này đúng
import en from '../config/translations/en.json';
import vi from '../config/translations/vi.json';

const ASYNC_STORAGE_LANG_KEY = 'appLanguageFirebaseAuthLab4'; // Thêm một hậu tố để tránh trùng key nếu có app khác

const i18nInstance = i18nConfigured;

export const LocalizationContext = createContext({
  t: (scope, options) => i18nInstance.t(scope, options), // Hàm dịch mặc định
  setAppLanguage: async (lang) => {}, // Hàm để thay đổi ngôn ngữ
  appLanguage: i18nInstance.locale,     // Ngôn ngữ hiện tại của ứng dụng
  initializeAppLanguage: async () => {}, // Hàm khởi tạo ngôn ngữ khi app chạy
});

export const LocalizationProvider = ({ children }) => {
  const [appLanguage, setAppLanguageState] = useState(i18nInstance.locale);

  const setLanguage = useCallback(async (language) => {
    i18nInstance.locale = language; // Cập nhật locale của instance i18n
    setAppLanguageState(language);    // Cập nhật state của React
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_LANG_KEY, language);
    } catch (error) {
      console.error('LocalizationContext: Error saving language to AsyncStorage:', error);
    }
  }, []);

  const initializeAppLanguage = useCallback(async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(ASYNC_STORAGE_LANG_KEY);
      if (storedLanguage) {
        console.log('LocalizationContext: Found stored language:', storedLanguage);
        setLanguage(storedLanguage);
      } else {
        // Nếu chưa có lựa chọn nào được lưu, dùng ngôn ngữ từ cấu hình i18n (đã dựa trên thiết bị)
        console.log('LocalizationContext: No stored language, using device locale via i18n config:', i18nInstance.locale);
        setLanguage(i18nInstance.locale);
      }
    } catch (error) {
      console.error('LocalizationContext: Error initializing language from AsyncStorage:', error);
      // Fallback về ngôn ngữ từ cấu hình i18n nếu có lỗi
      setLanguage(i18nInstance.locale);
    }
  }, [setLanguage]);

  // Hàm dịch tiện lợi, đảm bảo sử dụng ngôn ngữ hiện tại trong state
  const t = useCallback(
    (scope, options) => i18nInstance.t(scope, { ...options, locale: appLanguage }),
    [appLanguage]
  );

  // Gọi initializeAppLanguage một lần khi Provider được mount
  // Điều này rất quan trọng để ngôn ngữ được load đúng khi app khởi động
  useEffect(() => {
    initializeAppLanguage();
  }, [initializeAppLanguage]);


  return (
    <LocalizationContext.Provider
      value={{
        t,
        setAppLanguage: setLanguage,
        appLanguage,
        initializeAppLanguage, // Có thể không cần export nếu chỉ dùng nội bộ useEffect
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook để dễ dàng sử dụng context trong các component
export const useLocalization = () => useContext(LocalizationContext);