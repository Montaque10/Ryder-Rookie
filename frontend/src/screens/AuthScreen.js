import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser, registerUser } from '../services/api';
import { ThemeContext } from '../styles/theme';
import CustomButton from '../components/CustomButton';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { colors, typography, spacing, borderRadius, shadows } = useContext(ThemeContext);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await loginUser({ username, password });
        Alert.alert('Success', 'Logged in successfully!');
        navigation.replace('Home');
      } else {
        await registerUser({ username, email, password });
        Alert.alert('Success', 'Registered successfully! Please log in.');
        setIsLogin(true); // Switch to login after registration
      }
    } catch (error) {
      console.error('Authentication error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response && error.response.data ? JSON.stringify(error.response.data) : 'An error occurred.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    title: {
      ...typography.h1,
      color: colors.primary,
      marginBottom: spacing.xl,
    },
    input: {
      width: '90%',
      padding: spacing.md,
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.md,
      ...shadows.light,
    },
    buttonContainer: {
      width: '90%',
      marginTop: spacing.md,
    },
    switchText: {
      color: colors.textSecondary,
      marginTop: spacing.md,
      ...typography.body,
    },
    switchButton: {
      color: colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rookie Ryder</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <CustomButton title={isLogin ? "Login" : "Register"} onPress={handleAuth} />
      </View>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text style={styles.switchButton}>{isLogin ? "Register" : "Login"}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen; 