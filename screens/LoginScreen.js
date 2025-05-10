// screens/LoginScreen.js
import React, { useState } from 'react'; // Thêm useState
import { View, Text, StyleSheet, Alert } from 'react-native'; // Thêm Alert
import { Formik } from 'formik';
import * as Yup from 'yup'; // Thư viện Yup để validation
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Xử lý bàn phím

import { Button, TextInput, Logo, FormErrorMessage, LoadingIndicator } from '../components'; // Import thêm các component
import { Colors, Images } from '../config'; // Import Colors và Images
import { useTogglePasswordVisibility } from '../hooks'; // Hook ẩn/hiện password
import { auth } from '../config/firebase'; // Firebase auth

// Schema validation với Yup
const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email') // Nhãn cho thông báo lỗi
    .email('Enter a valid email') // Kiểm tra định dạng email
    .required('Please enter a registered email'), // Bắt buộc nhập
  password: Yup.string()
    .label('Password')
    .required('Please enter your password') // Bắt buộc nhập
    .min(6, 'Password must have at least 6 characters '), // Độ dài tối thiểu
});

const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState(''); // State để lưu lỗi từ Firebase
  const [isLoading, setIsLoading] = useState(false); // State cho loading indicator

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility(); // Sử dụng hook

  const handleLogin = async (values) => {
    setIsLoading(true); // Bắt đầu loading
    const { email, password } = values;
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Đăng nhập thành công, RootNavigator sẽ tự động chuyển sang AppStack
      // không cần navigation.navigate('Home') ở đây vì onAuthStateChanged sẽ xử lý
      console.log('Login successful');
    } catch (error) {
      setErrorState(error.message); // Hiển thị lỗi từ Firebase
      // Ví dụ một số mã lỗi phổ biến từ Firebase Auth:
      // error.code === 'auth/user-not-found' -> Tài khoản không tồn tại
      // error.code === 'auth/wrong-password' -> Sai mật khẩu
      // error.code === 'auth/invalid-email' -> Email không hợp lệ
      Alert.alert('Login Error', error.message); // Hiển thị lỗi bằng Alert
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Quan trọng để scroll hoạt động đúng
        keyboardShouldPersistTaps="handled" // Xử lý tap khi bàn phím mở
        enableOnAndroid={true} // Bật cho Android
      >
        <View style={styles.container}>
          <Logo uri={Images.logo} style={styles.logo} /> {/* Hiển thị Logo */}
          <Text style={styles.screenTitle}>Welcome back!</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema} // Áp dụng schema validation
            onSubmit={values => handleLogin(values)} // Hàm xử lý khi submit form
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid, // Kiểm tra form có valid không
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
                  // autoFocus={true} // Tự động focus vào trường này
                />
                <FormErrorMessage error={errors.email} visible={touched.email} />

                <TextInput
                  name="password"
                  leftIconName="lock-outline"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility} // Sử dụng state từ hook
                  textContentType="password"
                  rightIconName={rightIcon} // Sử dụng icon từ hook
                  onRightIconPress={handlePasswordVisibility} // Hàm xử lý từ hook
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
                  disabled={!isValid || isLoading} // Disable nút nếu form không valid hoặc đang loading
                  loading={isLoading} // Hiển thị loading trên nút
                />
              </>
            )}
          </Formik>

          <Button
            title="Create a new account?"
            onPress={() => navigation.navigate('Signup')}
            variant="outlined" // Sử dụng variant 'outlined' cho nút này
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
      <LoadingIndicator visible={isLoading} /> {/* Hiển thị loading overlay */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white, // Màu nền
    paddingHorizontal: 20,
    paddingVertical: 20, // Thêm padding dọc
    justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
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
    marginTop: 16, // Thêm khoảng cách trên cho nút Login
  },
  navButton: {
    marginTop: 10,
    backgroundColor: 'transparent', // Nền trong suốt cho nút điều hướng
    borderColor: 'transparent', // Bỏ viền cho nút điều hướng
  },
  navButtonText: {
    color: Colors.primary, // Màu chữ cho nút điều hướng
    fontWeight: 'normal', // Bỏ bold
    fontSize: 15,
  },
});

export default LoginScreen;