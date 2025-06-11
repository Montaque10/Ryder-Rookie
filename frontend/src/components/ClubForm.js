import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createClub, updateClub } from '../services/api';
import { ThemeContext } from '../styles/theme';
import CustomButton from './CustomButton';

const CLUB_TYPES = [
  'Driver', '3 Wood', '5 Wood', '7 Wood',
  '2 Iron', '3 Iron', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron',
  'Pitching Wedge', 'Gap Wedge', 'Sand Wedge', 'Lob Wedge',
  'Putter', 'Other'
];

const ClubForm = ({ visible, onClose, club }) => {
  const isEdit = !!club;
  const [clubType, setClubType] = useState(club ? club.club_type : 'Driver');
  const [distance, setDistance] = useState(club && club.average_distance_yards ? String(club.average_distance_yards) : '');
  const [notes, setNotes] = useState(club ? club.notes : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useContext(ThemeContext);
  const { colors, spacing, borderRadius, shadows, typography } = theme;

  useEffect(() => {
    if (club) {
      setClubType(club.club_type);
      setDistance(club.average_distance_yards ? String(club.average_distance_yards) : '');
      setNotes(club.notes || '');
    } else {
      setClubType('Driver');
      setDistance('');
      setNotes('');
    }
    setError('');
  }, [club, visible]);

  const handleSave = async () => {
    setError('');
    if (!clubType) {
      setError('Please select a club type.');
      return;
    }
    if (distance && isNaN(Number(distance))) {
      setError('Distance must be a number.');
      return;
    }
    setLoading(true);
    try {
      const data = {
        club_type: clubType,
        average_distance_yards: distance ? parseFloat(distance) : null,
        notes: notes || '',
      };
      if (isEdit) {
        await updateClub(club.id, data);
      } else {
        await createClub(data);
      }
      onClose(true);
    } catch (err) {
      setError('Failed to save club.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    form: {
      width: '90%',
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.medium,
    },
    label: {
      ...typography.body,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    picker: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.md,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },
    notesInput: {
      minHeight: 60,
      textAlignVertical: 'top',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    error: {
      color: colors.error,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      ...typography.h2,
      color: colors.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.modalContainer}>
      <View style={styles.form}>
        <Text style={styles.title}>{isEdit ? 'Edit Club' : 'Add New Club'}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.label}>Club Type</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={clubType}
            onValueChange={setClubType}
            mode="dropdown"
          >
            {CLUB_TYPES.map(type => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Average Distance (yards)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
          placeholder="e.g. 150"
        />
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any notes about this club?"
          multiline
        />
        <View style={styles.buttonRow}>
          <CustomButton title="Cancel" onPress={() => onClose(false)} style={{ flex: 1, marginRight: 8, backgroundColor: colors.lightGray }} textStyle={{ color: colors.textPrimary }} />
          <CustomButton title={loading ? 'Saving...' : 'Save Club'} onPress={handleSave} style={{ flex: 1 }} disabled={loading} />
        </View>
      </View>
    </View>
  );
};

export default ClubForm; 