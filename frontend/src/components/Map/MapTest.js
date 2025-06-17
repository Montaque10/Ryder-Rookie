import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView from './MapView';

const MapTest = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Test location (San Francisco)
  const initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Test markers
  const markers = [
    {
      coordinate: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      title: 'San Francisco',
      description: 'The Golden City',
    },
    {
      coordinate: {
        latitude: 37.7833,
        longitude: -122.4167,
      },
      title: 'Financial District',
      description: 'Downtown SF',
    },
  ];

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    console.log('Marker pressed:', marker);
  };

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={initialRegion}
        markers={markers}
        onMarkerPress={handleMarkerPress}
        style={styles.map}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: Platform.OS === 'web' ? '80vh' : '100%',
  },
});

export default MapTest; 