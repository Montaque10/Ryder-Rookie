import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { analytics } from '../../src/config/firebase';
import { logEvent } from 'firebase/analytics';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      // Track signup attempt
      logEvent(analytics, 'signup_attempt', {
        method: 'email',
        email: email
      });

      if (password !== confirmPassword) {
        // Track password mismatch
        logEvent(analytics, 'signup_error', {
          error: 'password_mismatch'
        });
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Track successful signup
        logEvent(analytics, 'signup_success', {
          method: 'email'
        });
        router.replace('/(tabs)');
      } else {
        const data = await response.json();
        // Track failed signup
        logEvent(analytics, 'signup_failure', {
          method: 'email',
          error: data.message || 'Registration failed'
        });
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      // Track signup error
      logEvent(analytics, 'signup_error', {
        method: 'email',
        error: error.message
      });
      Alert.alert('Error', 'An error occurred during registration');
    }
  };

  // ... rest of the component code ...
} 