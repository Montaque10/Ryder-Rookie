import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { ThemeContext } from '../styles/theme';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, spacing, borderRadius, shadows } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      marginTop: spacing.md,
    },
    title: {
      ...typography.h1,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    buttonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    buttonWrapper: {
      width: '48%', // Roughly half minus spacing for two columns
      marginBottom: spacing.md,
    },
    button: {
      paddingVertical: spacing.lg,
      backgroundColor: colors.cardBackground, // Use card background for buttons on home screen
      borderRadius: borderRadius.lg,
      ...shadows.medium,
    },
    buttonText: {
      ...typography.h3,
      color: colors.primary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, Golfer!</Text>
        <Text style={styles.subtitle}>Your journey to better golf starts here. What would you like to do?</Text>
      </View>

      <View style={styles.buttonGrid}>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="My Clubs"
            onPress={() => navigation.navigate('MyClubs')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="On-Course Tracker"
            onPress={() => navigation.navigate('OnCourseTracker')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Scorecard"
            onPress={() => navigation.navigate('Scorecard')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Course Planner"
            onPress={() => navigation.navigate('CoursePlanner')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Practice Tips"
            onPress={() => navigation.navigate('PracticeTips')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Leaderboard"
            onPress={() => navigation.navigate('Leaderboard')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="My Profile"
            onPress={() => navigation.navigate('Profile')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Test APIs"
            onPress={() => navigation.navigate('ApiTest')}
            style={[styles.button, { backgroundColor: colors.accent }]}
            textStyle={[styles.buttonText, { color: colors.textPrimary }]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen; 