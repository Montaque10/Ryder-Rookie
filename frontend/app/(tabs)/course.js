import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CourseMap from '../../src/components/CourseMap';
import Scorecard from '../../src/components/Scorecard';
import { colors, spacing } from '../../src/styles/theme';

// Sample course data - replace with actual course data from your backend
const sampleCourseData = {
  name: "Pebble Beach Golf Links",
  holes: [
    {
      number: 1,
      par: 4,
      coordinates: [[36.5713, -121.9505], [36.5720, -121.9512]],
      hazards: [
        { type: "bunker", coords: [36.5715, -121.9508] }
      ]
    },
    {
      number: 2,
      par: 5,
      coordinates: [[36.5725, -121.9515], [36.5730, -121.9520]],
      hazards: [
        { type: "water", coords: [36.5727, -121.9517] }
      ]
    }
    // Add more holes as needed
  ]
};

const CourseScreen = () => {
  const [currentHole, setCurrentHole] = useState(sampleCourseData.holes[0]);
  const [scores, setScores] = useState(Array(18).fill(''));
  const router = useRouter();

  const handleScoreUpdate = (newScores, total) => {
    setScores(newScores);
    // Save score to Firebase
    // saveGolfRound({
    //   course: sampleCourseData.name,
    //   hole: currentHole.number,
    //   score: newScores[currentHole.number - 1],
    //   total,
    //   timestamp: new Date()
    // });
  };

  const handleHoleComplete = (holeNumber) => {
    // Move to next hole
    const nextHoleIndex = holeNumber;
    if (nextHoleIndex < sampleCourseData.holes.length) {
      setCurrentHole(sampleCourseData.holes[nextHoleIndex]);
    } else {
      // Round complete
      router.push('/rounds');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <CourseMap
          courseData={sampleCourseData}
          currentHole={currentHole}
          onHoleComplete={handleHoleComplete}
        />
      </View>
      <View style={styles.scorecardContainer}>
        <Scorecard
          course={sampleCourseData}
          onScoreUpdate={handleScoreUpdate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.5,
  },
  scorecardContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default CourseScreen; 