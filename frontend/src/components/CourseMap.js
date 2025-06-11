import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { colors, spacing } from '../styles/theme';
import { MAPS_CONFIG } from '../config/maps';
import {
  calculateDistance,
  calculateBearing,
  validateCourseData,
  getCurrentHoleData,
  calculateDistanceToHazard,
  formatDistance
} from '../utils/courseData';

const CourseMap = ({ courseData, currentHole, onHoleComplete }) => {
  const mapRef = useRef(null);
  const [playerLocation, setPlayerLocation] = useState(null);
  const [distanceToHole, setDistanceToHole] = useState(null);
  const [distanceToHazard, setDistanceToHazard] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom markers for different golf course features
  const markers = {
    tee: require('../assets/markers/tee.png'),
    hole: require('../assets/markers/hole.png'),
    bunker: require('../assets/markers/bunker.png'),
    water: require('../assets/markers/water.png'),
  };

  useEffect(() => {
    if (!validateCourseData(courseData)) {
      setError('Invalid course data');
      setLoading(false);
      return;
    }
    requestLocationPermission();
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [courseData]);

  useEffect(() => {
    if (currentHole && playerLocation) {
      updateDistances();
    }
  }, [currentHole, playerLocation]);

  const updateDistances = () => {
    const holeData = getCurrentHoleData(courseData, currentHole);
    if (!holeData) return;

    // Calculate distance to hole
    const holeLocation = {
      latitude: holeData.coordinates[1][0],
      longitude: holeData.coordinates[1][1]
    };
    const distance = calculateDistance(playerLocation, holeLocation);
    setDistanceToHole(distance);

    // Calculate distance to nearest hazard
    if (holeData.hazards && holeData.hazards.length > 0) {
      const nearestHazard = holeData.hazards.reduce((nearest, hazard) => {
        const distance = calculateDistanceToHazard(playerLocation, hazard.coords);
        return (!nearest || distance < nearest.distance) ? { distance, hazard } : nearest;
      }, null);
      setDistanceToHazard(nearestHazard?.distance || null);
    }

    // Check if player is near the hole (within 10 meters)
    if (distance < 10) {
      onHoleComplete?.(currentHole);
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          startLocationTracking();
        } else {
          setError('Location permission denied');
          setLoading(false);
        }
      } else {
        startLocationTracking();
      }
    } catch (error) {
      setError('Error requesting location permission');
      console.error('Location permission error:', error);
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    try {
      const id = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPlayerLocation({ latitude, longitude });
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setError('Error getting location');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5, // Update every 5 meters
          interval: 5000, // Update every 5 seconds
          fastestInterval: 2000, // Fastest rate in milliseconds
        }
      );
      setWatchId(id);
    } catch (error) {
      setError('Error starting location tracking');
      console.error('Location tracking error:', error);
      setLoading(false);
    }
  };

  const renderHoleMarkers = () => {
    if (!courseData?.holes) return null;

    return courseData.holes.map((hole) => {
      const isCurrentHole = hole.number === currentHole;
      const [teeLat, teeLng] = hole.coordinates[0];
      const [holeLat, holeLng] = hole.coordinates[1];

      return (
        <React.Fragment key={hole.number}>
          <Marker
            coordinate={{ latitude: teeLat, longitude: teeLng }}
            image={markers.tee}
            title={`Hole ${hole.number} - Tee`}
            description={`Par ${hole.par}`}
            zIndex={isCurrentHole ? 2 : 1}
          />
          <Marker
            coordinate={{ latitude: holeLat, longitude: holeLng }}
            image={markers.hole}
            title={`Hole ${hole.number} - Pin`}
            description={`Par ${hole.par}`}
            zIndex={isCurrentHole ? 2 : 1}
          />
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
            <Marker
              key={`${hole.number}-hazard-${index}`}
              coordinate={{
                latitude: hazard.coords[0],
                longitude: hazard.coords[1],
              }}
              image={markers[hazard.type]}
              title={`${hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)}`}
              description={isCurrentHole ? formatDistance(calculateDistanceToHazard(playerLocation, hazard.coords)) : ''}
              zIndex={1}
            />
          ))}
        </React.Fragment>
      );
    });
  };

  const renderPlayerMarker = () => {
    if (!playerLocation) return null;

    return (
      <Marker
        coordinate={playerLocation}
        title="Your Location"
        description={`${formatDistance(distanceToHole)} to hole${distanceToHazard ? `, ${formatDistance(distanceToHazard)} to nearest hazard` : ''}`}
        zIndex={3}
      >
        <View style={styles.playerMarker} />
      </Marker>
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
  playerMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
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