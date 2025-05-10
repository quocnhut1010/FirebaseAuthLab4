// navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import HomeScreen from '../screens/HomeScreen'; // Hoặc '../screens' nếu dùng index.js

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }} // Hiển thị header cho Home
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang Chủ' }} />
    </Stack.Navigator>
  );
}