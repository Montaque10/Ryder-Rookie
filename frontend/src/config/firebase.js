import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: Platform.select({
    ios: "AIzaSyCpi5bn41Z2g2ZZ44RaChG2d68oQMBRPl8",
    android: "AIzaSyCfM8Y1kmg_j_H6yTt7HBXUDY9-C2PK7UA",
    default: "AIzaSyCpi5bn41Z2g2ZZ44RaChG2d68oQMBRPl8"
  }),
  authDomain: "ryder-rookie.firebaseapp.com",
  projectId: "ryder-rookie",
  storageBucket: "ryder-rookie.firebasestorage.app",
  messagingSenderId: "387707737583",
  appId: Platform.select({
    ios: "1:387707737583:ios:64b1dadb016380df40121a",
    android: "1:387707737583:android:2c4570743ad51f2b40121a",
    default: "1:387707737583:ios:64b1dadb016380df40121a"
  }),
  measurementId: "G-E3JQBZ1267"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally
let analytics = null;
if (Platform.OS === 'web') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, analytics }; 