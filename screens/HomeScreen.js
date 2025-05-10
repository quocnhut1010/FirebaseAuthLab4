// screens/HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components'; // Import Button
import { AuthenticatedUserContext } from '../providers';
import { auth } from '../config/firebase';
import { Colors } from '../config'; // Import Colors

const HomeScreen = ({ navigation }) => { // navigation prop có thể không cần nếu bạn không có điều hướng từ Home
  const { user } = useContext(AuthenticatedUserContext); // Chỉ cần user ở đây

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // RootNavigator sẽ tự động xử lý việc chuyển màn hình
      console.log('User signed out!');
    } catch (error) {
      console.error('Sign out error', error);
      Alert.alert('Logout Error', error.message || 'Failed to logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      {user && <Text style={styles.welcomeText}>Welcome, {user.email}!</Text>}
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
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.black,
  },
  welcomeText: {
    fontSize: 18,
    color: Colors.darkGray,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%', // Giới hạn chiều rộng của nút
  }
});

export default HomeScreen;