import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../styles/theme';

const ScoreInput = ({
  holeNumber,
  score,
  putts,
  fairwayHit,
  sandSave,
  onScoreChange,
  onPuttsChange,
  onFairwayHitToggle,
  onSandSaveToggle,
}) => {
  const { colors, typography, spacing, borderRadius, shadows } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.light,
    },
    holeTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    labelText: {
      ...typography.body,
      color: colors.textSecondary,
      width: 80,
    },
    textInput: {
      flex: 1,
      height: 40,
      borderColor: colors.lightGray,
      borderWidth: 1,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm,
      color: colors.textPrimary,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.lightGray,
      marginLeft: spacing.sm,
    },
    toggleButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    toggleButtonText: {
      ...typography.body,
      color: colors.textPrimary,
      marginLeft: spacing.xs,
    },
    toggleButtonTextActive: {
      color: '#FFFFFF',
    },
    icon: {
      marginRight: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.holeTitle}>Hole {holeNumber}</Text>

      <View style={styles.inputRow}>
        <Text style={styles.labelText}>Score:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={score ? String(score) : ''}
          onChangeText={(text) => onScoreChange(holeNumber, text)}
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.labelText}>Putts:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={putts ? String(putts) : ''}
          onChangeText={(text) => onPuttsChange(holeNumber, text)}
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.labelText}>Fairway:</Text>
        <TouchableOpacity
          style={[styles.toggleButton, fairwayHit && styles.toggleButtonActive]}
          onPress={() => onFairwayHitToggle(holeNumber)}
        >
          <Icon
            name={fairwayHit ? "check-circle" : "circle-outline"}
            size={20}
            color={fairwayHit ? '#FFFFFF' : colors.textPrimary}
            style={styles.icon}
          />
          <Text style={[styles.toggleButtonText, fairwayHit && styles.toggleButtonTextActive]}>
            {fairwayHit ? 'Hit' : 'Miss'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.labelText}>Sand Save:</Text>
        <TouchableOpacity
          style={[styles.toggleButton, sandSave && styles.toggleButtonActive]}
          onPress={() => onSandSaveToggle(holeNumber)}
        >
          <Icon
            name={sandSave ? "check-circle" : "circle-outline"}
            size={20}
            color={sandSave ? '#FFFFFF' : colors.textPrimary}
            style={styles.icon}
          />
          <Text style={[styles.toggleButtonText, sandSave && styles.toggleButtonTextActive]}>
            {sandSave ? 'Saved' : 'No'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScoreInput; 