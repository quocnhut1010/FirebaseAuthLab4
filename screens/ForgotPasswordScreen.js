// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button, TextInput, Logo, FormErrorMessage, LoadingIndicator } from '../components';
import { Colors, Images } from '../config';
import { auth } from '../config/firebase';

const passwordResetValidationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter your email address'),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // State để theo dõi email đã được gửi chưa

  const handlePasswordReset = async (values) => {
    setIsLoading(true);
    setEmailSent(false); // Reset trạng thái emailSent
    const { email } = values;
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent successfully!');
      setEmailSent(true); // Đánh dấu email đã được gửi
      Alert.alert(
        'Email Sent',
        'A password reset link has been sent to your email address. Please check your inbox (and spam folder).'
      );
      // Không tự động navigate, để người dùng đọc thông báo
    } catch (error) {
      setErrorState(error.message);
      Alert.alert('Error', error.message);
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
          <Text style={styles.screenTitle}>Reset your password</Text>
          <Text style={styles.description}>
            Enter your email address below and we'll send you a link to reset your password.
          </Text>

          {!emailSent ? ( // Chỉ hiển thị form nếu email chưa được gửi
            <Formik
              initialValues={{ email: '' }}
              validationSchema={passwordResetValidationSchema}
              onSubmit={values => handlePasswordReset(values)}
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
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  <FormErrorMessage error={errors.email} visible={touched.email} />

                  {errorState !== '' && (
                    <FormErrorMessage error={errorState} visible={true} />
                  )}

                  <Button
                    title="Send Reset Link"
                    onPress={handleSubmit}
                    style={styles.sendButton}
                    disabled={!isValid || isLoading}
                    loading={isLoading}
                  />
                </>
              )}
            </Formik>
          ) : (
            <Text style={styles.emailSentText}>
              Password reset email has been sent! Please check your email.
            </Text>
          )}


          <Button
            title="Go back to Login"
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
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  sendButton: {
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
  emailSentText: {
    fontSize: 16,
    color: Colors.success, // Màu xanh cho thành công
    textAlign: 'center',
    marginVertical: 20,
  }
});

export default ForgotPasswordScreen;