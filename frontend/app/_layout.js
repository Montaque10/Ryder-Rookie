import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { app, analytics } from '../src/config/firebase';
import { logEvent } from 'firebase/analytics';

export default function Layout() {
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        if (app) {
          console.log('Firebase initialized successfully');
          
          // Log app start event
          if (Platform.OS === 'web') {
            logEvent(analytics, 'app_start', {
              platform: Platform.OS,
              version: '1.0.0'
            });
          }
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    };

    initializeFirebase();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
} 