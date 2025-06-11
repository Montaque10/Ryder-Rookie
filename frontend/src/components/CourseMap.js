import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as turf from '@turf/turf';
import { colors, spacing } from '../styles/theme';

const CourseMap = ({ courseData, currentHole, onHoleComplete }) => {
  const mapRef = useRef(null);
  const [playerLocation, setPlayerLocation] = useState(null);
  const [distanceToHole, setDistanceToHole] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Custom markers for different golf course features
  const markers = {
    tee: require('../assets/markers/tee.png'),
    hole: require('../assets/markers/hole.png'),
    bunker: require('../assets/markers/bunker.png'),
    water: require('../assets/markers/water.png'),
  };

  useEffect(() => {
    requestLocationPermission();
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    if (currentHole && playerLocation) {
      calculateDistanceToHole();
    }
  }, [currentHole, playerLocation]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        startLocationTracking();
      }
    } else {
      startLocationTracking();
    }
  };

  const startLocationTracking = () => {
    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPlayerLocation({ latitude, longitude });
      },
      (error) => console.error('Location error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 5, // Update every 5 meters
        interval: 5000, // Update every 5 seconds
        fastestInterval: 2000, // Fastest rate in milliseconds
      }
    );
    setWatchId(id);
  };

  const calculateDistanceToHole = () => {
    if (!currentHole || !playerLocation) return;

    const from = turf.point([playerLocation.longitude, playerLocation.latitude]);
    const to = turf.point([
      currentHole.coordinates[1][1],
      currentHole.coordinates[1][0],
    ]);

    const distance = turf.distance(from, to, { units: 'meters' });
    setDistanceToHole(Math.round(distance));

    // Check if player is near the hole (within 10 meters)
    if (distance < 10) {
      onHoleComplete?.(currentHole.number);
    }
  };

  const renderHoleMarkers = () => {
    if (!courseData?.holes) return null;

    return courseData.holes.map((hole) => {
      const isCurrentHole = hole.number === currentHole?.number;
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
        description={`${distanceToHole}m to hole`}
        zIndex={3}
      >
        <View style={styles.playerMarker} />
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: courseData?.holes[0]?.coordinates[0][0] || 0,
          longitude: courseData?.holes[0]?.coordinates[0][1] || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
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
});

export default CourseMap; 