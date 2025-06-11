import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { analytics } from '../../src/config/firebase';
import { logEvent } from 'firebase/analytics';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Track login attempt
      logEvent(analytics, 'login_attempt', {
        method: 'email',
        email: email
      });

      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Track successful login
        logEvent(analytics, 'login_success', {
          method: 'email'
        });
        router.replace('/(tabs)');
      } else {
        // Track failed login
        logEvent(analytics, 'login_failure', {
          method: 'email',
          error: 'Invalid credentials'
        });
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      // Track login error
      logEvent(analytics, 'login_error', {
        method: 'email',
        error: error.message
      });
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  // ... rest of the component code ...
} 