import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, shadows } from '../../src/styles/theme';
import { auth, getUserRounds } from '../../src/config/firebase';
import Scorecard from '../../src/components/Scorecard';

const RoundsScreen = () => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = async () => {
    try {
      if (!auth.currentUser) {
        router.replace('/login');
        return;
      }

      const userRounds = await getUserRounds(auth.currentUser.uid);
      setRounds(userRounds);
    } catch (error) {
      console.error('Error loading rounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRound = ({ item }) => (
    <TouchableOpacity
      style={styles.roundCard}
      onPress={() => router.push(`/round/${item.id}`)}
    >
      <View style={styles.roundHeader}>
        <Text style={styles.courseName}>{item.course}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt?.toDate()).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.roundDetails}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{item.total}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Handicap</Text>
          <Text style={styles.scoreValue}>{item.handicap || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading rounds...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rounds</Text>
        <TouchableOpacity
          style={styles.newRoundButton}
          onPress={() => router.push('/new-round')}
        >
          <Text style={styles.newRoundButtonText}>New Round</Text>
        </TouchableOpacity>
      </View>

      {rounds.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No rounds recorded yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start a new round to track your progress
          </Text>
        </View>
      ) : (
        <FlatList
          data={rounds}
          renderItem={renderRound}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.roundsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    ...shadows.medium,
  },
  title: {
    ...typography.h2,
    color: colors.background,
  },
  newRoundButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  newRoundButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: 'bold',
  },
  roundsList: {
    padding: spacing.md,
  },
  roundCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.small,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  courseName: {
    ...typography.h3,
    color: colors.text,
  },
  date: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
  },
  roundDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
  },
  scoreValue: {
    ...typography.h3,
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    ...typography.body,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default RoundsScreen; 