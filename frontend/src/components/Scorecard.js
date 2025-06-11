import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/theme';

const Scorecard = ({ course, onScoreUpdate }) => {
  const [scores, setScores] = useState(Array(18).fill(''));
  const [totals, setTotals] = useState({
    frontNine: 0,
    backNine: 0,
    total: 0
  });

  const handleScoreChange = (index, value) => {
    // Validate input (only numbers)
    if (!/^\d*$/.test(value)) return;

    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);

    // Calculate totals
    const frontNine = newScores.slice(0, 9).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
    const backNine = newScores.slice(9).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
    const total = frontNine + backNine;

    setTotals({ frontNine, backNine, total });
    onScoreUpdate?.(newScores, total);
  };

  const renderHole = (index) => (
    <View key={index} style={styles.holeContainer}>
      <Text style={styles.holeNumber}>Hole {index + 1}</Text>
      <TextInput
        style={styles.scoreInput}
        value={scores[index]}
        onChangeText={(value) => handleScoreChange(index, value)}
        keyboardType="numeric"
        maxLength={2}
        placeholder="Score"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.courseName}>{course?.name || 'Golf Course'}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.scorecard}>
        <View style={styles.holesContainer}>
          {Array(18).fill(0).map((_, index) => renderHole(index))}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Front Nine:</Text>
            <Text style={styles.totalValue}>{totals.frontNine}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Back Nine:</Text>
            <Text style={styles.totalValue}>{totals.backNine}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{totals.total}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    ...shadows.medium,
  },
  courseName: {
    ...typography.h2,
    color: colors.background,
  },
  date: {
    ...typography.body,
    color: colors.background,
    opacity: 0.8,
  },
  scorecard: {
    padding: spacing.md,
  },
  holesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  holeContainer: {
    width: '30%',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    ...shadows.small,
  },
  holeNumber: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  scoreInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: spacing.xs,
    textAlign: 'center',
    ...typography.body,
  },
  totalsContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
    ...shadows.medium,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.body,
    color: colors.text,
  },
  totalValue: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
  },
});

export default Scorecard; 