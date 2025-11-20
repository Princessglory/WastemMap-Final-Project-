import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const MapComponent = ({ onLocationSelect, selectedLocation }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (selectedLocation.lat && selectedLocation.lng) {
      setMarker(selectedLocation);
    }
  }, [selectedLocation]);

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarker(location);
    onLocationSelect(location);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={selectedLocation.lat ? selectedLocation : defaultCenter}
        onClick={handleMapClick}
        onLoad={map => setMap(map)}
      >
        {marker && (
          <Marker
            position={marker}
            draggable={true}
            onDragEnd={handleMapClick}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
