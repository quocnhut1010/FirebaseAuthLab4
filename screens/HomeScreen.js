// screens/HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native'; // Thêm Alert nếu chưa có
import { Button } from '../components';
import { AuthenticatedUserContext } from '../providers';
import { auth } from '../config/firebase';
import { Colors } from '../config'; // Import Colors để styling

const HomeScreen = ({ navigation }) => { // navigation có thể không cần nếu không có điều hướng từ Home
  const { user } = useContext(AuthenticatedUserContext); // Lấy thông tin user từ context

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // Sau khi signOut, onAuthStateChanged trong RootNavigator sẽ tự động
      // cập nhật user context và chuyển về AuthStack.
      console.log('User signed out!');
    } catch (error) {
      console.error('Sign out error', error);
      Alert.alert('Logout Error', error.message || 'An error occurred while signing out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      {user && <Text style={styles.welcomeText}>Welcome, {user.email}!</Text>}
      {/* Hiển thị email của người dùng */}
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white, // Sử dụng màu từ theme
  },
  title: {
    fontSize: 28, // Kích thước tiêu đề
    fontWeight: 'bold',
    color: Colors.black, // Màu chữ
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: Colors.darkGray, // Màu chữ
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%', // Giới hạn chiều rộng của nút để trông đẹp hơn
  }
});

export default HomeScreen;