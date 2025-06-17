import React from 'react';
import RNMapView from 'react-native-maps';

const MapView = ({ 
  initialRegion,
  markers = [],
  onMarkerPress,
  style,
  ...props 
}) => {
  return (
    <RNMapView
      style={[{ flex: 1 }, style]}
      initialRegion={initialRegion}
      {...props}
    >
      {markers.map((marker, index) => (
        <RNMapView.Marker
          key={index}
          coordinate={marker.coordinate}
          onPress={() => onMarkerPress?.(marker)}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </RNMapView>
  );
};

export default MapView; 