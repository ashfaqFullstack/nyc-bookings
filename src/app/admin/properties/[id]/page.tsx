'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { usePropertyForm } from '@/hooks/use-property-form';
import {
  BasicInfoSection,
  PropertyDetailsSection,
  ImagesSection,
  AmenitiesSection,
  LocationDetailsSection,
  HouseRulesSection,
  ReviewsSection,
} from '@/components/admin/property-form-sections';
import { EditableMap } from '@/components/admin/editableMap';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

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


export default function EditProperty() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const {
    property,
    loading,
    saving,
    updateProperty,
    updateNestedProperty,
    saveProperty,
    loadProperty,
  } = usePropertyForm({ isEditing: true });

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || user?.role !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, isLoggedIn, user, router]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin' && params.id) {
      loadProperty(params.id as string);
    }
  }, [isLoggedIn, user, params.id, loadProperty]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'admin' || !property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/properties">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
                <p className="text-gray-600">{property.title}</p>
              </div>
            </div>
            <Button onClick={saveProperty} disabled={saving} className="bg-rose-500 hover:bg-rose-600">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="rules">Rules & Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <BasicInfoSection
              property={property}
              updateProperty={updateProperty}
              updateNestedProperty={updateNestedProperty}
            />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <PropertyDetailsSection
              property={property}
              updateProperty={updateProperty}
              updateNestedProperty={updateNestedProperty}
            />
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <ImagesSection
              property={property}
              updateProperty={updateProperty}
              updateNestedProperty={updateNestedProperty}
            />
          </TabsContent>

          <TabsContent value="amenities" className="space-y-6">
            <AmenitiesSection
              property={property}
              updateProperty={updateProperty}
              updateNestedProperty={updateNestedProperty}
            />
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <LocationDetailsSection
              property={property}
              updateProperty={updateProperty}
              updateNestedProperty={updateNestedProperty}
            />
            <EditableMap
              coordinates={property.coordinates}
              onCoordinatesChange={(coords) => updateProperty('coordinates', coords)}
            />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewsSection
              property={property}
              updateProperty={updateProperty}
              updateNestedProperty={updateNestedProperty}
            />
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <HouseRulesSection
              property={property}
              updateProperty={updateProperty}
              updateNestedProperty={updateNestedProperty}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
