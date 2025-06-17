import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapTest from '../src/components/Map/MapTest';

export default function MapTestScreen() {
  return (
    <View style={styles.container}>
      <MapTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 