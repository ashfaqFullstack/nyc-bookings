'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
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
// import { EditableMap } from '@/components/admin/editableMap';
import dynamic from 'next/dynamic';

const EditableMap = dynamic(
  () => import('@/components/admin/editableMap').then((mod) => mod.EditableMap),
  {
    ssr: false, 
  }
);



export default function NewProperty() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const {
    property,
    saving,
    updateProperty,
    updateNestedProperty,
    saveProperty,
    createNewProperty
  } = usePropertyForm({ isEditing: false });

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || user?.role !== 'admin')) {
      router.push('/');
    }
    if(!property) {
      createNewProperty();
    }
  }, [authLoading, isLoggedIn, user, router, createNewProperty, property]);

  if (authLoading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'admin') {
    return null;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between flex-col md:flex-row gap-4 md:gap-0 md:items-center py-6">
            <div className="flex items-center md:space-x-4">
              <Link className='hidden md:block'  href="/admin/properties">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
                <p className="text-gray-600">Add a new property to your listings</p>
              </div>
            </div>
            <div className='flex flex-wrap gap-4 justify-between' >

              <Link className='block md:hidden'  href="/admin/properties">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Properties
                  </Button>
                </Link>
              <Button onClick={saveProperty} disabled={saving} className="bg-rose-500 hover:bg-rose-600">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Creating...' : 'Create Property'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="basic" className="space-y-6 ">
          <TabsList className='flex md:block flex-wrap w-full h-fit' >
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
