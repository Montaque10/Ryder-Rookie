import { Platform } from 'react-native';

export const MAPS_API_KEY = Platform.select({
  android: 'AIzaSyA-SIihVArqeWYoOIIqJNbrPXJsh0B6RGU',
  ios: 'AIzaSyA-SIihVArqeWYoOIIqJNbrPXJsh0B6RGU',
  default: 'AIzaSyA-SIihVArqeWYoOIIqJNbrPXJsh0B6RGU'
});

export const MAPS_CONFIG = {
  initialRegion: {
    latitude: 36.5713,
    longitude: -121.9505,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  mapType: 'standard',
  showsUserLocation: true,
  showsMyLocationButton: true,
  showsCompass: true,
  showsScale: true,
  zoomEnabled: true,
  rotateEnabled: true,
  scrollEnabled: true,
  pitchEnabled: true,
}; 