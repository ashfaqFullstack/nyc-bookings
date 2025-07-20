// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { useEffect, useRef } from 'react';

// interface EditableMapProps {
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
//   onCoordinatesChange: (coords: { lat: number; lng: number }) => void;
// }

// export function EditableMap({ coordinates, onCoordinatesChange }: EditableMapProps) {
//   const mapRef = useRef<HTMLDivElement | null>(null);
//   const leafletMapRef = useRef<L.Map | null>(null);
//   const markerRef = useRef<L.Marker | null>(null);

//   // ✅ Define your custom icon
//   const customIcon = L.icon({
//     iconUrl: '/marker-icon.png', // put your custom image in the public folder
//     // shadowUrl: '/marker-shadow.png',
//     iconSize: [40, 40],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   });

//   useEffect(() => {
//     if (mapRef.current && !leafletMapRef.current) {
//       leafletMapRef.current = L.map(mapRef.current).setView(
//         [coordinates.lat, coordinates.lng],
//         13
//       );

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors',
//       }).addTo(leafletMapRef.current);

//       const marker = L.marker([coordinates.lat, coordinates.lng], {
//         draggable: true,
//         icon: customIcon, // ✅ Use the custom icon
//       }).addTo(leafletMapRef.current);

//       marker.on('dragend', () => {
//         const pos = marker.getLatLng();
//         onCoordinatesChange({ lat: pos.lat, lng: pos.lng });
//       });

//       markerRef.current = marker;

//       leafletMapRef.current.on('click', (e: L.LeafletMouseEvent) => {
//         const { lat, lng } = e.latlng;
//         marker.setLatLng([lat, lng]);
//         onCoordinatesChange({ lat, lng });
//       });
//     }

//     // Update marker position if coordinates change
//     if (markerRef.current) {
//       markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
//     }
//   }, [coordinates, onCoordinatesChange, customIcon]);

//   return <div ref={mapRef} style={{ height: '400px', width: '100%' }} className="rounded-lg z-10" />;
// }



import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

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
  const circleRef = useRef<L.Circle | null>(null);
  const [showExactLocation, setShowExactLocation] = useState(false);

  // ✅ Define your custom icon for exact location mode
  const customIcon = L.icon({
    iconUrl: '/marker-icon.png',
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

      // Create initial circle or marker based on mode
      updateMapDisplay();

      // Handle map clicks
      leafletMapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onCoordinatesChange({ lat, lng });
      });
    }

    // Update display when coordinates change
    updateMapDisplay();
  }, [coordinates, showExactLocation, onCoordinatesChange]);

  const updateMapDisplay = () => {
    if (!leafletMapRef.current) return;

    // Clear existing circle or marker
    if (circleRef.current) {
      leafletMapRef.current.removeLayer(circleRef.current);
      circleRef.current = null;
    }

    if (showExactLocation) {
      // Show exact location with draggable marker
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        draggable: true,
        icon: customIcon,
      }).addTo(leafletMapRef.current);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onCoordinatesChange({ lat: pos.lat, lng: pos.lng });
      });

      circleRef.current = marker as unknown as L.Circle;
    } else {
      // Show generalized area with circle
      const radius = getRadiusForZoom(leafletMapRef.current.getZoom());
      const circle = L.circle([coordinates.lat, coordinates.lng], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.2,
        radius: radius,
        weight: 2,
      }).addTo(leafletMapRef.current);

      // Make circle draggable
      circle.on('mousedown', (e) => {
        const map = leafletMapRef.current!;
        map.dragging.disable();
        
        const onMouseMove = (e: L.LeafletMouseEvent) => {
          const newLatLng = e.latlng;
          circle.setLatLng(newLatLng);
          onCoordinatesChange({ lat: newLatLng.lat, lng: newLatLng.lng });
        };

        const onMouseUp = () => {
          map.dragging.enable();
          map.off('mousemove', onMouseMove);
          map.off('mouseup', onMouseUp);
        };

        map.on('mousemove', onMouseMove);
        map.on('mouseup', onMouseUp);
      });

      circleRef.current = circle;
    }
  };

  // Calculate radius based on zoom level to maintain consistent visual size
  const getRadiusForZoom = (zoom: number): number => {
    // Base radius at zoom level 13
    const baseRadius = 500; // 500 meters
    const baseZoom = 13;
    
    // Adjust radius based on zoom level
    // Higher zoom = smaller radius to maintain visual consistency
    const zoomDiff = zoom - baseZoom;
    const radius = baseRadius / Math.pow(1.5, zoomDiff);
    
    // Minimum and maximum radius bounds
    return Math.max(100, Math.min(2000, radius));
  };

  // Handle zoom events to update circle radius
  useEffect(() => {
    if (leafletMapRef.current && !showExactLocation) {
      const handleZoom = () => {
        if (circleRef.current && circleRef.current instanceof L.Circle) {
          const newRadius = getRadiusForZoom(leafletMapRef.current!.getZoom());
          circleRef.current.setRadius(newRadius);
        }
      };

      leafletMapRef.current.on('zoom', handleZoom);

      return () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.off('zoom', handleZoom);
        }
      };
    }
  }, [showExactLocation]);

  const toggleLocationMode = () => {
    setShowExactLocation(!showExactLocation);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Location Display Mode</h4>
          <p className="text-sm text-gray-600">
            {showExactLocation 
              ? "Showing exact location with precise marker" 
              : "Showing generalized area for privacy"
            }
          </p>
        </div>
        <button
          onClick={toggleLocationMode}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            showExactLocation
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {showExactLocation ? 'Use General Area' : 'Use Exact Location'}
        </button>
      </div>

      {/* Coordinates Display */}
      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={coordinates.lat.toFixed(6)}
            onChange={(e) => onCoordinatesChange({ 
              lat: parseFloat(e.target.value) || coordinates.lat, 
              lng: coordinates.lng 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={coordinates.lng.toFixed(6)}
            onChange={(e) => onCoordinatesChange({ 
              lat: coordinates.lat, 
              lng: parseFloat(e.target.value) || coordinates.lng 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ height: '400px', width: '100%' }} 
        className="rounded-lg z-10 border border-gray-300" 
      />

      {/* Instructions */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>General Area Mode:</strong> Shows an approximate area circle that maintains consistent size when zooming. 
          Drag the circle to move the location.
        </p>
        <p>
          <strong>Exact Location Mode:</strong> Shows a precise marker. Drag the marker or click anywhere on the map to set location.
        </p>
        <p>
          You can also manually enter coordinates in the fields above.
        </p>
      </div>
    </div>
  );
}
