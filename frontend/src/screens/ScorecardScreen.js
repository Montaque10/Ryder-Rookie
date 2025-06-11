import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { ThemeContext } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createRound, getRound, createHoleScore, updateHoleScore, getCourses } from '../services/api';

const ScorecardScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentRound, setCurrentRound] = useState(null);
  const [currentHole, setCurrentHole] = useState(1);
  const [holeScore, setHoleScore] = useState({
    score: 0,
    putts: 0,
    fairway_hit: false,
    sand_save: false,
  });
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const theme = useContext(ThemeContext);
  const { colors, spacing, borderRadius, shadows, typography } = theme;

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
    }
  };

  const startNewRound = async (courseId = null) => {
    setLoading(true);
    setError('');
    try {
      const response = await createRound({ course: courseId });
      setCurrentRound(response.data);
      setCurrentHole(1);
      setHoleScore({
        score: 0,
        putts: 0,
        fairway_hit: false,
        sand_save: false,
      });
    } catch (err) {
      setError('Failed to start new round');
    } finally {
      setLoading(false);
      setShowCourseModal(false);
    }
  };

  const saveHoleScore = async () => {
    if (!currentRound) return;

    setLoading(true);
    setError('');
    try {
      const data = {
        round: currentRound.id,
        hole_number: currentHole,
        ...holeScore,
      };

      // Try to update existing hole score first
      try {
        const existingScore = await getHoleScoreForRoundAndHole(currentRound.id, currentHole);
        if (existingScore) {
          await updateHoleScore(existingScore.id, data);
        } else {
          await createHoleScore(data);
        }
      } catch (err) {
        await createHoleScore(data);
      }

      // Move to next hole or end round
      if (currentHole < 18) {
        setCurrentHole(currentHole + 1);
        setHoleScore({
          score: 0,
          putts: 0,
          fairway_hit: false,
          sand_save: false,
        });
      } else {
        endRound();
      }
    } catch (err) {
      setError('Failed to save hole score');
    } finally {
      setLoading(false);
    }
  };

  const endRound = async () => {
    Alert.alert(
      'End Round',
      'Are you sure you want to end this round?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Round',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await updateRound(currentRound.id, { is_completed: true });
              setCurrentRound(null);
              setCurrentHole(1);
            } catch (err) {
              setError('Failed to end round');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const adjustScore = (amount) => {
    setHoleScore(prev => ({
      ...prev,
      score: Math.max(0, prev.score + amount),
    }));
  };

  const adjustPutts = (amount) => {
    setHoleScore(prev => ({
      ...prev,
      putts: Math.max(0, prev.putts + amount),
    }));
  };

  const toggleFairwayHit = () => {
    setHoleScore(prev => ({
      ...prev,
      fairway_hit: !prev.fairway_hit,
    }));
  };

  const toggleSandSave = () => {
    setHoleScore(prev => ({
      ...prev,
      sand_save: !prev.sand_save,
    }));
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
    currentHole: {
      ...typography.h2,
      color: colors.secondary,
    },
    scoreCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...shadows.medium,
    },
    scoreSection: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    scoreButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.md,
    },
    scoreButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minWidth: 60,
      alignItems: 'center',
    },
    scoreButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    statButton: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    statButtonText: {
      color: colors.textPrimary,
      textAlign: 'center',
      ...typography.body,
    },
    statButtonActive: {
      backgroundColor: colors.accent,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    error: {
      color: colors.error,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    loading: {
      marginVertical: spacing.lg,
    },
    courseModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    courseList: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      width: '90%',
      maxHeight: '80%',
    },
    courseItem: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
    },
    courseName: {
      ...typography.body,
      color: colors.textPrimary,
    },
  });

  if (!currentRound) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Scorecard</Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <CustomButton
          title="Start New Round"
          onPress={() => setShowCourseModal(true)}
          disabled={loading}
        />
        {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />}
        
        <Modal
          visible={showCourseModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCourseModal(false)}
        >
          <View style={styles.courseModal}>
            <View style={styles.courseList}>
              <Text style={styles.sectionTitle}>Select a Course</Text>
              <ScrollView>
                <TouchableOpacity
                  style={styles.courseItem}
                  onPress={() => startNewRound()}
                >
                  <Text style={styles.courseName}>Generic Round</Text>
                </TouchableOpacity>
                {courses.map(course => (
                  <TouchableOpacity
                    key={course.id}
                    style={styles.courseItem}
                    onPress={() => startNewRound(course.id)}
                  >
                    <Text style={styles.courseName}>{course.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <CustomButton
                title="Cancel"
                onPress={() => setShowCourseModal(false)}
                style={{ marginTop: spacing.md }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scorecard</Text>
        <Text style={styles.currentHole}>Hole {currentHole} of 18</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.scoreCard}>
        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>Score</Text>
          <View style={styles.scoreButtons}>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => adjustScore(-1)}
            >
              <Text style={styles.scoreButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.scoreButtonText}>{holeScore.score}</Text>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => adjustScore(1)}
            >
              <Text style={styles.scoreButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>Putts</Text>
          <View style={styles.scoreButtons}>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => adjustPutts(-1)}
            >
              <Text style={styles.scoreButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.scoreButtonText}>{holeScore.putts}</Text>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => adjustPutts(1)}
            >
              <Text style={styles.scoreButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.statButton,
            holeScore.fairway_hit && styles.statButtonActive,
          ]}
          onPress={toggleFairwayHit}
        >
          <Text style={styles.statButtonText}>
            {holeScore.fairway_hit ? '✓ Fairway Hit' : '✗ Fairway Missed'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statButton,
            holeScore.sand_save && styles.statButtonActive,
          ]}
          onPress={toggleSandSave}
        >
          <Text style={styles.statButtonText}>
            {holeScore.sand_save ? '✓ Sand Save' : '✗ No Sand Save'}
          </Text>
        </TouchableOpacity>

        <View style={styles.navigationButtons}>
          <CustomButton
            title="Previous Hole"
            onPress={() => setCurrentHole(Math.max(1, currentHole - 1))}
            disabled={currentHole === 1 || loading}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <CustomButton
            title={currentHole === 18 ? "End Round" : "Next Hole"}
            onPress={currentHole === 18 ? endRound : saveHoleScore}
            disabled={loading}
            style={{ flex: 1, marginLeft: spacing.sm }}
          />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />}
    </ScrollView>
  );
};

export default ScorecardScreen; 