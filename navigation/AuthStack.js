// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import LoginScreen from '../screens/LoginScreen'; // Hoặc '../screens' nếu dùng index.js
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}