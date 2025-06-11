import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemeContext } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getClubSuggestion } from '../services/api';

const OnCourseTrackerScreen = () => {
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const theme = useContext(ThemeContext);
  const { colors, spacing, borderRadius, shadows, typography } = theme;

  const handleSuggestClub = async () => {
    if (!distance || isNaN(Number(distance))) {
      setError('Please enter a valid distance');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const response = await getClubSuggestion(Number(distance));
      setSuggestion(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get club suggestion');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.lg,
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
    inputContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...shadows.light,
    },
    inputLabel: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: 24,
      textAlign: 'center',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    suggestionContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      alignItems: 'center',
      ...shadows.medium,
    },
    suggestionTitle: {
      ...typography.h2,
      color: colors.secondary,
      marginBottom: spacing.md,
    },
    clubType: {
      ...typography.h1,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    distance: {
      ...typography.h3,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    notes: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    error: {
      color: colors.error,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    loading: {
      marginVertical: spacing.lg,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>On-Course Companion</Text>
          <Text style={styles.subtitle}>Enter the distance to your target for a club suggestion</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Distance to Target (yards)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
            placeholder="e.g., 150"
            placeholderTextColor={colors.textSecondary}
          />
          <CustomButton
            title="Suggest Club"
            onPress={handleSuggestClub}
            disabled={loading}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
        ) : suggestion ? (
          <View style={styles.suggestionContainer}>
            <Text style={styles.suggestionTitle}>Suggested Club</Text>
            <Icon name="golf" size={48} color={colors.primary} style={{ marginBottom: spacing.md }} />
            <Text style={styles.clubType}>{suggestion.club_type}</Text>
            <Text style={styles.distance}>
              {suggestion.average_distance_yards} yards
            </Text>
            {suggestion.notes ? (
              <Text style={styles.notes}>{suggestion.notes}</Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OnCourseTrackerScreen; 