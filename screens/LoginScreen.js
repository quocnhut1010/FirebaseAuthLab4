// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native'; // Thêm Platform nếu bạn dùng trong styles hoặc logic khác
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button, TextInput, Logo, FormErrorMessage, LoadingIndicator } from '../components';
import { Colors, Images } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { auth } from '../config/firebase';

// Schema validation với Yup
const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter your email address'),
  password: Yup.string()
    .label('Password')
    .required('Please enter your password')
    .min(6, 'Password must have at least 6 characters'),
});

const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const handleLogin = async (values) => {
    setIsLoading(true);
    setErrorState(''); // Reset lỗi cũ khi bắt đầu một lần thử mới
    const { email, password } = values;
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Đăng nhập thành công, RootNavigator sẽ tự động chuyển sang AppStack
      console.log('Login successful for user:', email);
    } catch (error) {
      let friendlyErrorMessage = 'Login failed. Please check your credentials or network connection and try again.'; // Thông báo mặc định chung hơn

      // --- Dòng DEBUG quan trọng ---
      console.log('--- Firebase Login Error ---');
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
      console.log('---------------------------');
      // --- Kết thúc dòng DEBUG ---

      switch (error.code) {
        case 'auth/user-not-found':
          friendlyErrorMessage = 'No account found with this email. Would you like to sign up?';
          break;
        case 'auth/wrong-password':
          friendlyErrorMessage = 'Incorrect password. Please try again or consider resetting your password.';
          break;
        case 'auth/invalid-email': // Thường cho định dạng email sai, không phải email không tồn tại
          friendlyErrorMessage = 'The email address format is not valid.';
          break;
        case 'auth/invalid-credential':
          friendlyErrorMessage = 'Invalid email or password. Please double-check and try again.';
          break;
        case 'auth/user-disabled':
          friendlyErrorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          friendlyErrorMessage = 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
          break;
        default:
          // Nếu không có case nào khớp, friendlyErrorMessage sẽ giữ giá trị mặc định đã đặt ở trên.
          // Hoặc bạn có thể hiển thị error.message gốc từ Firebase nếu muốn, nhưng nó có thể không thân thiện:
          // friendlyErrorMessage = error.message;
          break;
      }
      setErrorState(friendlyErrorMessage); // Cập nhật state để FormErrorMessage hiển thị
      Alert.alert('Login Error', friendlyErrorMessage); // Tùy chọn: có thể bỏ Alert nếu FormErrorMessage đã đủ
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={styles.container}>
          <Logo uri={Images.logo} style={styles.logo} />
          <Text style={styles.screenTitle}>Welcome back!</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={values => handleLogin(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <TextInput
                  name="email"
                  leftIconName="email-outline"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FormErrorMessage error={errors.email} visible={touched.email} />

                <TextInput
                  name="password"
                  leftIconName="lock-outline"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="password"
                  rightIconName={rightIcon}
                  onRightIconPress={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage error={errors.password} visible={touched.password} />

                {/* Hiển thị lỗi chung từ Firebase */}
                {errorState !== '' && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}

                <Button
                  title="Login"
                  onPress={handleSubmit}
                  style={styles.loginButton}
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                />
              </>
            )}
          </Formik>

          <Button
            title="Create a new account?"
            onPress={() => navigation.navigate('Signup')}
            variant="outlined"
            style={styles.navButton}
            textStyle={styles.navButtonText}
          />
          <Button
            title="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="outlined"
            style={styles.navButton}
            textStyle={styles.navButtonText}
          />
        </View>
      </KeyboardAwareScrollView>
      <LoadingIndicator visible={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    marginTop: 16,
  },
  navButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  navButtonText: {
    color: Colors.primary,
    fontWeight: 'normal',
    fontSize: 15,
  },
});

export default LoginScreen;