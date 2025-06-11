import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import CourseMap from './CourseMap';
import { testCourseData } from '../utils/testCourseData';

const TestMap = () => {
  const [currentHole, setCurrentHole] = useState(1);

  const handleHoleComplete = (holeNumber) => {
    console.log(`Hole ${holeNumber} completed!`);
    if (holeNumber < testCourseData.holes.length) {
      setCurrentHole(holeNumber + 1);
    } else {
      console.log('Course completed!');
    }
  };

  return (
    <View style={styles.container}>
      <CourseMap
        courseData={testCourseData}
        currentHole={currentHole}
        onHoleComplete={handleHoleComplete}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Previous Hole"
          onPress={() => setCurrentHole(Math.max(1, currentHole - 1))}
          disabled={currentHole === 1}
        />
        <Button
          title="Next Hole"
          onPress={() => setCurrentHole(Math.min(testCourseData.holes.length, currentHole + 1))}
          disabled={currentHole === testCourseData.holes.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default TestMap; 