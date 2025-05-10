// screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button, TextInput, Logo, FormErrorMessage, LoadingIndicator } from '../components';
import { Colors, Images } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { auth } from '../config/firebase';

const signupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required('Please enter your password')
    .min(6, 'Password must have at least 6 characters'),
  confirmPassword: Yup.string()
    .label('Confirm Password')
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'), // Kiểm tra khớp mật khẩu
});

const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  // ... useTogglePasswordVisibility ...

   const {
    passwordVisibility,          
    rightIcon,                   
    handlePasswordVisibility,    
    confirmPasswordVisibility,   
    confirmPasswordIcon,         
    handleConfirmPasswordVisibility 
  } = useTogglePasswordVisibility();

    const handleSignup = async (values, { resetForm }) => {
    setIsLoading(true);
    setErrorState('');
    setSignupSuccess(false);
    const { email, password } = values;

    try {
      // 1. Tạo người dùng
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      console.log('User account created successfully!', userCredential.user.uid);

      // 2. Gửi email xác nhận tài khoản
      // `userCredential.user` chính là user object vừa được tạo
      if (userCredential.user) {
        try {
          await userCredential.user.sendEmailVerification();
          console.log('Verification email sent to:', userCredential.user.email);
        } catch (verificationError) {
          console.error('Error sending verification email:', verificationError);
          // nhưng thường thì việc đăng ký vẫn được coi là thành công.
          setErrorState('Account created, but failed to send verification email. Please try logging in.');
        }
      }

      // 3. Đăng xuất người dùng vừa tạo ngay lập tức (để họ phải login lại sau khi xác nhận, hoặc theo yêu cầu lab là về Login)
      if (auth().currentUser) {
        await auth().signOut();
        console.log('User signed out immediately after creation and email verification sent.');
      }

      // 4. Đánh dấu đăng ký thành công, reset form và thông báo
      setSignupSuccess(true);
      resetForm();

      Alert.alert(
        'Signup Successful!',
        `Your account has been created and a verification email has been sent to ${email}. Please verify your email before logging in.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
              setSignupSuccess(false);
            }
          }
        ],
        { cancelable: false }
      );

    } catch (error) { // Lỗi từ createUserWithEmailAndPassword
      let friendlyErrorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        friendlyErrorMessage = 'This email address is already in use by another account.';
      } else if (error.code === 'auth/invalid-email') {
        friendlyErrorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        friendlyErrorMessage = 'The password is too weak. It must be at least 6 characters long.';
      } else {
        friendlyErrorMessage = 'An unexpected error occurred during signup. Please try again.';
      }
      setErrorState(friendlyErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        <View style={styles.container}>
          <Logo uri={Images.logo} style={styles.logo} />
          <Text style={styles.screenTitle}>Create a new account!</Text>

          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={signupValidationSchema}
            onSubmit={(values, formikActions) => handleSignup(values, formikActions)}
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
                  textContentType="newPassword" // Quan trọng cho iOS để gợi ý tạo mật khẩu mạnh
                  rightIconName={rightIcon}
                  onRightIconPress={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage error={errors.password} visible={touched.password} />

                <TextInput
                  name="confirmPassword"
                  leftIconName="lock-outline"
                  placeholder="Confirm password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={confirmPasswordVisibility}
                  textContentType="newPassword"
                  rightIconName={confirmPasswordIcon}
                  onRightIconPress={handleConfirmPasswordVisibility}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                />
                <FormErrorMessage error={errors.confirmPassword} visible={touched.confirmPassword} />

                {errorState !== '' && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}

                <Button
                  title="Signup"
                  onPress={handleSubmit}
                  style={styles.signupButton}
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                />
              </>
            )}
          </Formik>

          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 100, // Logo nhỏ hơn chút
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26, // Tiêu đề nhỏ hơn chút
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 25,
  },
  signupButton: {
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

export default SignupScreen;