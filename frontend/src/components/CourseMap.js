import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors, spacing } from '../styles/theme';
import { MAPS_CONFIG } from '../config/maps';
import { courseToGeoJSON, calculateDistance, getNearestHazard } from '../utils/geoJsonUtils';

// Default marker colors
const MARKER_COLORS = {
  tee: '#4CAF50',    // Green
  hole: '#F44336',   // Red
  bunker: '#FFC107', // Yellow
  water: '#2196F3',  // Blue
  player: '#9C27B0'  // Purple
};

const CourseMap = ({ courseData, currentHole, onHoleComplete }) => {
  const mapRef = useRef(null);
  const [playerLocation, setPlayerLocation] = useState(null);
  const [distanceToHole, setDistanceToHole] = useState(null);
  const [nearestHazard, setNearestHazard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);

  useEffect(() => {
    if (!courseData?.holes?.length) {
      setError('Invalid course data');
      setLoading(false);
      return;
    }
    requestLocationPermission();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [courseData]);

  useEffect(() => {
    if (currentHole && playerLocation) {
      updateDistances();
    }
  }, [currentHole, playerLocation]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        startLocationTracking();
      } else {
        setError('Location permission denied');
        setLoading(false);
      }
    } catch (error) {
      setError('Error requesting location permission');
      console.error('Location permission error:', error);
      setLoading(false);
    }
  };

  const startLocationTracking = async () => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 5000,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setPlayerLocation({ latitude, longitude });
          setLoading(false);
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      setError('Error starting location tracking');
      console.error('Location tracking error:', error);
      setLoading(false);
    }
  };

  const updateDistances = () => {
    try {
      const holeData = courseData.holes.find(hole => hole.number === currentHole);
      if (!holeData) return;

      // Calculate distance to hole
      const holeLocation = {
        latitude: holeData.coordinates[1][0],
        longitude: holeData.coordinates[1][1]
      };
      const distance = calculateDistance(
        [playerLocation.latitude, playerLocation.longitude],
        [holeLocation.latitude, holeLocation.longitude]
      );
      setDistanceToHole(distance);

      // Find nearest hazard
      const hazard = getNearestHazard(
        [playerLocation.latitude, playerLocation.longitude],
        holeData.hazards
      );
      setNearestHazard(hazard);

      // Check if player is near the hole (within 10 meters)
      if (distance < 10) {
        onHoleComplete?.(currentHole);
      }
    } catch (error) {
      console.error('Error updating distances:', error);
    }
  };

  const renderMarker = (coordinate, type, title, description, zIndex = 1) => (
    <Marker
      coordinate={coordinate}
      title={title}
      description={description}
      zIndex={zIndex}
    >
      <View style={[styles.marker, { backgroundColor: MARKER_COLORS[type] }]} />
    </Marker>
  );

  const renderHoleMarkers = () => {
    if (!courseData?.holes) return null;

    return courseData.holes.map((hole) => {
      const isCurrentHole = hole.number === currentHole;
      const [teeLat, teeLng] = hole.coordinates[0];
      const [holeLat, holeLng] = hole.coordinates[1];

      return (
        <React.Fragment key={hole.number}>
          {renderMarker(
            { latitude: teeLat, longitude: teeLng },
            'tee',
            `Hole ${hole.number} - Tee`,
            `Par ${hole.par}`,
            isCurrentHole ? 2 : 1
          )}
          {renderMarker(
            { latitude: holeLat, longitude: holeLng },
            'hole',
            `Hole ${hole.number} - Pin`,
            `Par ${hole.par}`,
            isCurrentHole ? 2 : 1
          )}
          <Polyline
            coordinates={[
              { latitude: teeLat, longitude: teeLng },
              { latitude: holeLat, longitude: holeLng },
            ]}
            strokeColor={isCurrentHole ? colors.primary : colors.border}
            strokeWidth={isCurrentHole ? 3 : 1}
            zIndex={isCurrentHole ? 2 : 1}
          />
          {hole.hazards?.map((hazard, index) => (
            <React.Fragment key={`${hole.number}-hazard-${index}`}>
              {renderMarker(
                {
                  latitude: hazard.coords[0],
                  longitude: hazard.coords[1],
                },
                hazard.type,
                `${hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)}`,
                isCurrentHole ? `${Math.round(calculateDistance(
                  [playerLocation.latitude, playerLocation.longitude],
                  hazard.coords
                ))}m` : '',
                1
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    });
  };

  const renderPlayerMarker = () => {
    if (!playerLocation) return null;

    return renderMarker(
      playerLocation,
      'player',
      'Your Location',
      `${Math.round(distanceToHole)}m to hole${nearestHazard ? `, ${Math.round(nearestHazard.distance)}m to nearest ${nearestHazard.type}` : ''}`,
      3
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: courseData?.holes[0]?.coordinates[0][0] || MAPS_CONFIG.initialRegion.latitude,
          longitude: courseData?.holes[0]?.coordinates[0][1] || MAPS_CONFIG.initialRegion.longitude,
          latitudeDelta: MAPS_CONFIG.initialRegion.latitudeDelta,
          longitudeDelta: MAPS_CONFIG.initialRegion.longitudeDelta,
        }}
        {...MAPS_CONFIG}
      >
        {renderHoleMarkers()}
        {renderPlayerMarker()}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
});

export default CourseMap; 