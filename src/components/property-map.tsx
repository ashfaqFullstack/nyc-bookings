"use client";

import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface PropertyMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
}

function ChangeView({ center, zoom }: { center: L.LatLngExpression; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function PropertyMap({ coordinates }: PropertyMapProps) {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={14} scrollWheelZoom={false} className="h-full w-full rounded-lg z-0">
      <ChangeView center={[coordinates.lat, coordinates.lng]} zoom={14} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[coordinates.lat, coordinates.lng]}
        radius={500} // 500 meters radius for approximation
        pathOptions={{
          color: '#FF5A5F',
          fillColor: '#FF5A5F',
          fillOpacity: 0.2,
        }}
      />
    </MapContainer>
  );
}
