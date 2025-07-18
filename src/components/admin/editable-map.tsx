"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

// Fix for default icon issue with webpack
delete ((L.Icon.Default.prototype as unknown) as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface EditableMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void;
}

function MapUpdater({ coordinates }: { coordinates: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.lat, coordinates.lng]);
  }, [coordinates, map]);

  return null;
}

function MapEvents({ onCoordinatesChange }: Pick<EditableMapProps, 'onCoordinatesChange'>) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      onCoordinatesChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
}

export function EditableMap({ coordinates, onCoordinatesChange }: EditableMapProps) {
  const [markerPosition, setMarkerPosition] = useState(coordinates);

  useEffect(() => {
    setMarkerPosition(coordinates);
  }, [coordinates]);

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      className="rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater coordinates={coordinates} />
      <MapEvents onCoordinatesChange={(coords) => {
        onCoordinatesChange(coords);
        setMarkerPosition(coords);
      }} />
      <Marker
        position={markerPosition}
        draggable
        eventHandlers={{
          dragend(e) {
            const marker = e.target as L.Marker;
            const position = marker.getLatLng();
            onCoordinatesChange({ lat: position.lat, lng: position.lng });
            setMarkerPosition({ lat: position.lat, lng: position.lng });
          }
        }}
      />
    </MapContainer>
  );
}
