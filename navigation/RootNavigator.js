// navigation/RootNavigator.js
import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native'; // Để hiển thị loading

import { auth } from '../config/firebase'; // Import auth từ file firebase config
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true); // State để kiểm tra đang load hay không

  useEffect(() => {
    // Lắng nghe sự thay đổi trạng thái xác thực của người dùng từ Firebase
    // onAuthStateChanged trả về một hàm unsubscriber
    const unsubscribeAuthStateChanged = auth().onAuthStateChanged(authenticatedUser => {
      if (authenticatedUser) {
        setUser(authenticatedUser); // Nếu có người dùng, cập nhật context
      } else {
        setUser(null); // Nếu không, đặt user trong context là null
      }
      setIsLoading(false); // Kết thúc trạng thái loading
    });

    // Cleanup: Hủy lắng nghe khi component unmount
    return unsubscribeAuthStateChanged;
  }, [setUser]); // Dependency array, chạy lại effect nếu setUser thay đổi (thường chỉ 1 lần)

  if (isLoading) {
    // Hiển thị màn hình loading trong khi kiểm tra trạng thái xác thực
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}