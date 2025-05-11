// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import các components, hooks, và configs của bạn
import {
  Button,
  TextInput,
  Logo,
  FormErrorMessage,
  LoadingIndicator,
} from '../components';
import CustomThemeSwitch from '../components/CustomThemeSwitch';
import { Images } from '../config'; // Giả sử Images.js chứa đường dẫn logo
// import { Colors } from '../config'; // Không cần nếu theme quản lý màu
import { useTogglePasswordVisibility } from '../hooks';
import { auth } from '../config/firebase'; // Firebase auth instance
import { useTheme } from '../contexts/ThemeContext'; // Hook để sử dụng theme
import { useLocalization } from '../contexts/LocalizationContext'; // Hook đa ngôn ngữ

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t, appLanguage, setAppLanguage } = useLocalization();

  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  // Định nghĩa Yup schema bên trong component để sử dụng hàm 't'
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
    password: Yup.string()
      .required(t('validation.passwordRequired'))
      .min(6, t('validation.passwordMinLength', { count: 6 })),
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    setErrorState('');
    const { email, password } = values;
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('Login successful for user:', email);
    } catch (error) {
      let friendlyErrorMessageKey = 'loginScreen.loginFailedDefault';
      const errorCode = error.code;

      console.log('--- Firebase Login Error ---');
      console.log('Error Code:', errorCode);
      console.log('Error Message:', error.message);
      console.log('---------------------------');

      switch (errorCode) {
        case 'auth/user-not-found':
          friendlyErrorMessageKey = 'loginScreen.errorUserNotFound';
          break;
        case 'auth/wrong-password':
          friendlyErrorMessageKey = 'loginScreen.errorWrongPassword';
          break;
        case 'auth/invalid-email':
          friendlyErrorMessageKey = 'loginScreen.errorInvalidEmail';
          break;
        case 'auth/invalid-credential':
          friendlyErrorMessageKey = 'loginScreen.errorInvalidCredential';
          break;
        case 'auth/user-disabled':
          friendlyErrorMessageKey = 'loginScreen.errorUserDisabled';
          break;
        case 'auth/too-many-requests':
          friendlyErrorMessageKey = 'loginScreen.errorTooManyRequests';
          break;
      }
      const errorMessage = t(friendlyErrorMessageKey, {
        defaultValue: t('loginScreen.loginFailedDefault'),
      });
      setErrorState(errorMessage);
      Alert.alert(t('loginScreen.loginButton'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setAppLanguage(languageCode);
    setLanguageModalVisible(false);
  };

  // StyleSheet động dựa trên theme
  const dynamicStyles = StyleSheet.create({
    containerWithTheme: {
      backgroundColor: colors.background,
    },
    screenTitleWithTheme: {
      color: colors.text,
    },
    languageSelectorButtonTextWithTheme: {
      color: colors.text,
    },
    modalViewWithTheme: {
      backgroundColor: colors.background,
    },
    modalTitleWithTheme: {
      color: colors.text,
    },
    languageOptionTextWithTheme: {
      color: colors.text,
    },
    languageOptionSelectedTextWithTheme: {
      color: colors.primary, // Màu chữ cho item được chọn
    },
    languageOptionSelectedWithTheme: {
      borderColor: colors.primary, // Màu viền cho item được chọn
      // backgroundColor: colors.selectedBackground, // Tùy chọn: màu nền nhẹ
    },
    languageIconWithTheme: {
        color: colors.text, // Màu cho icon mở modal
    },
    selectedLanguageIconWithTheme: {
        color: colors.primary, // Màu cho icon check
    }
  });

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          dynamicStyles.containerWithTheme, // Áp dụng màu nền theme cho scrollview
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* CustomThemeSwitch được đặt ở vị trí tuyệt đối */}
          <View style={styles.customThemeSwitchContainer}>
            <CustomThemeSwitch />
          </View>

          <Logo uri={Images.logo} style={styles.logo} />
          <Text
            style={[styles.screenTitle, dynamicStyles.screenTitleWithTheme]}
          >
            {t('loginScreen.welcome')}
          </Text>

          {/* Nút để mở Modal chọn ngôn ngữ */}
          <TouchableOpacity
            style={[styles.languageSelectorButton, { borderColor: colors.text }]} // Viền theo màu text
            onPress={() => setLanguageModalVisible(true)}
          >
            <MaterialCommunityIcons name="translate" size={24} style={dynamicStyles.languageIconWithTheme} />
            <Text
              style={[
                styles.languageSelectorButtonText,
                dynamicStyles.languageSelectorButtonTextWithTheme,
              ]}
            >
              {appLanguage === 'en' ? 'English' : 'Tiếng Việt'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} style={dynamicStyles.languageIconWithTheme} />
          </TouchableOpacity>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => handleLogin(values)}
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
                  placeholder={t('loginScreen.emailPlaceholder')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  // Truyền props theme/colors nếu TextInput của bạn hỗ trợ
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />

                <TextInput
                  name="password"
                  leftIconName="lock-outline"
                  placeholder={t('loginScreen.passwordPlaceholder')}
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
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />

                {errorState !== '' && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}

                <Button
                  title={t('loginScreen.loginButton')}
                  onPress={handleSubmit}
                  style={styles.loginButton}
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                />
              </>
            )}
          </Formik>

          <Button
            title={t('loginScreen.createAccountButton')}
            onPress={() => navigation.navigate('Signup')}
            variant="outlined"
            style={styles.navButton}
          />
          <Button
            title={t('loginScreen.forgotPasswordButton')}
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="outlined"
            style={styles.navButton}
          />
        </View>
      </KeyboardAwareScrollView>

      {/* Modal Chọn Ngôn Ngữ */}
      <Modal
        animationType="fade" // Đổi thành fade cho mượt hơn
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => {
          setLanguageModalVisible(!languageModalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLanguageModalVisible(false)} // Đóng khi nhấn ra ngoài
        >
          <View style={[styles.modalView, dynamicStyles.modalViewWithTheme]}>
            <Text
              style={[styles.modalTitle, dynamicStyles.modalTitleWithTheme]}
            >
              {t('settingsScreen.language')}
            </Text>

            <TouchableOpacity
              style={[
                styles.languageOption,
                appLanguage === 'en' && [styles.languageOptionSelected, dynamicStyles.languageOptionSelectedWithTheme]
              ]}
              onPress={() => handleLanguageSelect('en')}
            >
              <Text style={[
                  styles.languageOptionText,
                  appLanguage === 'en' ? dynamicStyles.languageOptionSelectedTextWithTheme : dynamicStyles.languageOptionTextWithTheme
                ]}
              >
                English
              </Text>
              {appLanguage === 'en' && (
                <MaterialCommunityIcons name="check" size={24} style={dynamicStyles.selectedLanguageIconWithTheme}/>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                appLanguage === 'vi' && [styles.languageOptionSelected, dynamicStyles.languageOptionSelectedWithTheme]
              ]}
              onPress={() => handleLanguageSelect('vi')}
            >
              <Text style={[
                styles.languageOptionText,
                appLanguage === 'vi' ? dynamicStyles.languageOptionSelectedTextWithTheme : dynamicStyles.languageOptionTextWithTheme
              ]}
              >
                Tiếng Việt
              </Text>
              {appLanguage === 'vi' && (
                <MaterialCommunityIcons name="check" size={24} style={dynamicStyles.selectedLanguageIconWithTheme}/>
              )}
            </TouchableOpacity>

            <Button
              title={t('common.close', { defaultValue: 'Close' })}
              onPress={() => setLanguageModalVisible(false)}
              style={styles.closeModalButton}
              variant="filled" // Hoặc "outlined"
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {isLoading && <LoadingIndicator visible={isLoading} />}
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center', // Căn giữa các children
    justifyContent: 'center', // Căn giữa theo chiều dọc nếu nội dung ngắn
  },
  customThemeSwitchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 30,
    right: 15,
    zIndex: 10, // Tăng zIndex để chắc chắn nó ở trên modal overlay nếu modal không che toàn màn hình
  },
  logo: {
    width: 100, // Giảm kích thước logo một chút
    height: 100,
    alignSelf: 'center',
    marginBottom: 15,
  },
  screenTitle: {
    fontSize: 26, // Giảm font size một chút
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15, // Giảm margin
  },
  languageSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor sẽ được set động từ dynamicStyles hoặc props
    marginBottom: 20,
    minWidth: 150, // Đặt chiều rộng tối thiểu
    alignSelf: 'center',
  },
  languageSelectorButtonText: {
    fontSize: 16,
    marginHorizontal: 8,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 16,
    width: '100%',
  },
  navButton: {
    marginTop: 10,
    width: '100%',
  },
  // Styles cho Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Tăng độ mờ
  },
  modalView: {
    // margin: 20, // Bỏ margin để kiểm soát kích thước bằng width/height
    borderRadius: 15, // Giảm bo tròn
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%', // Chiều rộng của modal
    maxWidth: 400, // Chiều rộng tối đa
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18, // Giảm font size
    fontWeight: '600', // Tăng độ đậm
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12, // Giảm padding
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1.5, // Tăng độ dày viền
    // borderColor: 'transparent', // Sẽ được set động
  },
  languageOptionSelected: {
    // borderColor sẽ được set từ dynamicStyles
    // backgroundColor sẽ được set từ dynamicStyles nếu cần
  },
  languageOptionText: {
    fontSize: 16, // Giảm font size
    fontWeight: '500',
  },
  closeModalButton: {
    marginTop: 15, // Giảm margin
    width: '100%',
  },
});

export default LoginScreen;