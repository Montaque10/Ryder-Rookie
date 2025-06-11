import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

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
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics conditionally
let analytics = null;
if (Platform.OS === 'web') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

// Error handling for Firebase operations
export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  let message = 'An error occurred';
  
  switch (error.code) {
    case 'auth/invalid-email':
      message = 'Invalid email address';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password';
      break;
    case 'auth/email-already-in-use':
      message = 'Email is already registered';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection';
      break;
    default:
      message = error.message || 'An unexpected error occurred';
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    position: 'bottom',
  });
};

// Firestore helper functions
export const saveGolfRound = async (roundData) => {
  try {
    const roundRef = doc(db, 'rounds', roundData.id);
    await setDoc(roundRef, {
      ...roundData,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    handleFirebaseError(error);
    return false;
  }
};

export const getUserRounds = async (userId) => {
  try {
    const roundsRef = collection(db, 'rounds');
    const q = query(roundsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirebaseError(error);
    return [];
  }
};

export { app, auth, db, analytics }; 