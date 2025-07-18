import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

interface EditableMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void;
}

export function EditableMap({ coordinates, onCoordinatesChange }: EditableMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // ✅ Define your custom icon
  const customIcon = L.icon({
    iconUrl: '/marker-icon.png', // put your custom image in the public folder
    // shadowUrl: '/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        [coordinates.lat, coordinates.lng],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMapRef.current);

      const marker = L.marker([coordinates.lat, coordinates.lng], {
        draggable: true,
        icon: customIcon, // ✅ Use the custom icon
      }).addTo(leafletMapRef.current);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onCoordinatesChange({ lat: pos.lat, lng: pos.lng });
      });

      markerRef.current = marker;

      leafletMapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onCoordinatesChange({ lat, lng });
      });
    }

    // Update marker position if coordinates change
    if (markerRef.current) {
      markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
    }
  }, [coordinates, onCoordinatesChange, customIcon]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} className="rounded-lg z-10" />;
}