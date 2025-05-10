// config/firebase.js
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';


// Đảm bảo Firebase chỉ được khởi tạo một lần
if (!firebase.apps.length) {
  console.log('Firebase has been initialized automatically by the native SDKs.');
}

export { firebase, auth }; // Export auth để sử dụng trong các màn hình
// export { firestore, storage }; // Export các dịch vụ khác 