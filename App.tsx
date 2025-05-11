// // App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar'; // Cho phép tùy chỉnh thanh trạng thái
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import các provider và navigator (chúng ta sẽ tạo các file này sau)
import { AuthenticatedUserProvider } from './providers'; // Đường dẫn sẽ được tạo
import { RootNavigator } from './navigation'; // thay vì './navigation/RootNavigator'
import { LocalizationProvider } from './contexts/LocalizationContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider

export default function App() {
  return (
    <AuthenticatedUserProvider>
       <ThemeProvider>
        <LocalizationProvider> 
        <SafeAreaProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </SafeAreaProvider>
        </LocalizationProvider>
       </ThemeProvider>
    </AuthenticatedUserProvider>
  );
}