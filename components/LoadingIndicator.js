// components/LoadingIndicator.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { Colors } from '../config';

const LoadingIndicator = ({ visible = false }) => {
  // Nếu bạn muốn loading indicator là một modal overlay toàn màn hình:
  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={Colors.primary} animating={visible} />
        </View>
      </View>
    </Modal>
  );

  // Hoặc nếu bạn muốn nó là một component inline đơn giản:
  // if (!visible) return null;
  // return (
  //   <View style={styles.container}>
  //     <ActivityIndicator size="large" color={Colors.primary} />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  // Dành cho Modal overlay
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040', // Nền mờ
  },
  activityIndicatorWrapper: {
    backgroundColor: Colors.white, // Nền của box chứa activity indicator
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  // Dành cho component inline (nếu bạn chọn cách này)
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 20,
  // },
});

export default LoadingIndicator;