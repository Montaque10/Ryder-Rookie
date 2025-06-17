import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapView = ({ 
  initialRegion,
  markers = [],
  onMarkerPress,
  style,
  ...props 
}) => {
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    ...style
  };

  const center = {
    lat: initialRegion?.latitude || 0,
    lng: initialRegion?.longitude || 0
  };

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={initialRegion?.latitudeDelta ? Math.log2(360 / initialRegion.latitudeDelta) : 15}
        {...props}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{
              lat: marker.coordinate.latitude,
              lng: marker.coordinate.longitude
            }}
            onClick={() => onMarkerPress?.(marker)}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView; 