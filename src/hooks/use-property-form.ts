import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  user: string;
  userImage: string;
  rating: number;
  date: string;
  comment: string;
}

interface PropertyFormData {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  host: string;
  hostImage: string;
  hostJoinedDate: string;
  amenities: string[];
  description: string;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  houseRules: string[];
  cancellationPolicy: string;
  coordinates: { lat: number; lng: number };
  neighborhoodInfo: {
    description: string;
    highlights: string[];
    walkScore: number;
    transitScore: number;
  };
  reviews: Review[];
  hostexwidgetid : string;
  scriptsrc: string;
  listing_id: string;
  isActive: boolean;
}

interface UsePropertyFormProps {
  isEditing?: boolean;
}

const createNewPropertyObject = (): PropertyFormData => ({
  id: '',
  title: '',
  location: '',
  neighborhood: '',
  price: 0,
  rating: 0,
  reviewCount: 0,
  images: [],
  host: 'NYC Bookings',
  hostImage: 'https://ext.same-assets.com/2551202436/1824038998.png',
  hostJoinedDate: new Date().getFullYear().toString(),
  amenities: [],
  description: '',
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  guests: 2,
  checkIn: '3:00 PM',
  checkOut: '11:00 AM',
  houseRules: [],
  cancellationPolicy: 'Flexible cancellation policy',
  coordinates: { lat: 40.7589, lng: -73.9851 },
  neighborhoodInfo: {
    description: '',
    highlights: [],
    walkScore: 0,
    transitScore: 0
  },
  hostexwidgetid: '',
  scriptsrc: '',
  listing_id:'',
  reviews: [],
  isActive: true
});

export function usePropertyForm({ isEditing = false }: UsePropertyFormProps = {}) {
  const router = useRouter();
  const [property, setProperty] = useState<PropertyFormData | null>(isEditing ? null : createNewPropertyObject());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const loadProperty = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const prop = data.data.property;

        // Transform database fields to match frontend format
        const transformedProperty: PropertyFormData = {
          ...prop,
          coordinates: typeof prop.coordinates === 'string'
            ? JSON.parse(prop.coordinates)
            : prop.coordinates,
          neighborhoodInfo: typeof prop.neighborhoodinfo === 'string'
            ? JSON.parse(prop.neighborhoodinfo)
            : prop.neighborhoodinfo,
          reviewCount: prop.reviewcount,
          listing_id : prop.listing_id,
          hostImage: prop.hostimage,
          hostJoinedDate: prop.hostjoineddate,
          checkIn: prop.checkin,
          checkOut: prop.checkout,
          houseRules: prop.houserules,
          hostexwidgetid: prop.hostexwidgetid,
          scriptsrc: prop.scriptsrc,
          cancellationPolicy: prop.cancellationpolicy,
          reviews: typeof prop.reviews === 'string'
            ? JSON.parse(prop.reviews)
            : prop.reviews,
        };

        setProperty(transformedProperty);
      } else {
        console.error('Failed to load property');
      }
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProperty = useCallback((field: keyof PropertyFormData, value: unknown) => {
    setProperty(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const updateNestedProperty = useCallback((parentField: keyof PropertyFormData, field: string, value: unknown) => {
    setProperty(prev => {
      if (!prev) return null;
      const parent = prev[parentField] as Record<string, unknown>;
      return {
        ...prev,
        [parentField]: {
          ...parent,
          [field]: value
        }
      };
    });
  }, []);

  const saveProperty = useCallback(async () => {
    if (!property) return;
  // Step 1: Define required fields
  const requiredFields = [
    'reviewCount',
    'hostImage',
    'hostJoinedDate',
    'location',
    'checkIn',
    'checkOut',
    'houseRules',
    'description',
    'cancellationPolicy',
    'title',
    'images',
    'neighborhoodInfo',
    'coordinates',
    'hostexwidgetid',
    'scriptsrc',
    'listing_id',
    'reviews'
  ];

  // Step 2: Check for missing fields
  const missingFields = requiredFields.filter(field => {
    const value = property[field as keyof typeof property];
    return value === undefined || value === null || value === '' || field.length <= 0;
  });
  
  if (missingFields.length > 0) {
    alert(`Missing required fields: ${missingFields.join(', ')}`);
    return;
  }
  
  
  if(property?.images.length <= 0){
    alert(`Images are required to create new property.`);
    return;
  }
  setSaving(true);
    try {
      const token = localStorage.getItem('authToken');

      // Transform frontend format back to database format
      const payload = {
        ...property,
        reviewCount: property.reviewCount,
        hostImage: property.hostImage,
        hostJoinedDate: property.hostJoinedDate,
        checkIn: property.checkIn,
        checkOut: property.checkOut,
        houseRules: property.houseRules,
        cancellationPolicy: property.cancellationPolicy,
        neighborhoodInfo: property.neighborhoodInfo,
        coordinates: property.coordinates,
        hoxtexwidgetid:property.hostexwidgetid,
        scriptsrc: property.scriptsrc,
        listing_id:property.listing_id,
        reviews: property.reviews
      };
      

      const url = isEditing ? `/api/admin/properties/${property.id}` : '/api/admin/properties';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push('/admin/properties');
      } else {
        const error = await response.json();
        console.error('Failed to save property:', error);
        alert(`Failed to save property: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Failed to save property');
    } finally {
      setSaving(false);
    }
  }, [property, isEditing, router]);

  const createNewProperty = useCallback(() => {
    const newProperty: PropertyFormData = {
      id: '',
      title: '',
      location: '',
      neighborhood: '',
      price: 0,
      rating: 0,
      reviewCount: 0,
      images: [],
      host: 'NYC Bookings',
      hostImage: 'https://ext.same-assets.com/2551202436/1824038998.png',
      hostJoinedDate: new Date().getFullYear().toString(),
      amenities: [],
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      guests: 2,
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      hostexwidgetid: '',
      scriptsrc : '',
      listing_id: '',
      houseRules: [],
      cancellationPolicy: 'Flexible cancellation policy',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      neighborhoodInfo: {
        description: '',
        highlights: [],
        walkScore: 0,
        transitScore: 0
      },
      reviews: [],
      isActive: true
    };
    setProperty(newProperty);
  }, []);

  // Auto-create new property when not editing
  useEffect(() => {
    if (!isEditing && !property) {
      createNewProperty();
    }
  }, [isEditing, property, createNewProperty]);

  return {
    property,
    loading,
    saving,
    updateProperty,
    updateNestedProperty,
    saveProperty,
    loadProperty,
    createNewProperty
  };
}
