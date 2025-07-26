 import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, MapPin, DollarSign, Bed, Bath, Users, Image as ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useUserImageUpload } from '@/hooks/user-user-image-upload'; 
import { Progress } from '@/components/ui/progress';
import { ImageUploadComponent } from './imageUpload';
import { useHostImageUpload } from '@/hooks/useHostImageUpload';
import ReactMarkdown from 'react-markdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '../ui/label';
import { Input } from '@/components/ui/input';

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
  bedroomBedTypes: {
    bedroomNumber: number;
    bedTypes: string;
  }[];
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
  isActive: boolean;
  hostexwidgetid?: string;
  scriptsrc?: string;
  listing_id: string;
}

interface SectionProps {
  property: PropertyFormData;
  updateProperty: (field: keyof PropertyFormData, value: unknown) => void;
  updateNestedProperty: (parentField: keyof PropertyFormData, field: string, value: unknown) => void;
}

export function BasicInfoSection({ property, updateProperty }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Basic property details and pricing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={property.title}
              onChange={(e) => updateProperty('title', e.target.value)}
              placeholder="Property title"
            />
          </div>
          <div>
            <Label htmlFor="price">Price (per night)</Label>
            <Input
              id="price"
              type="number"
              value={property.price}
              onChange={(e) => updateProperty('price', Number.parseInt(e.target.value) || 0)}
              placeholder="200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={property.location}
              onChange={(e) => updateProperty('location', e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          <div>
            <Label htmlFor="neighborhood">Neighborhood</Label>
            <Input
              id="neighborhood"
              value={property.neighborhood}
              onChange={(e) => updateProperty('neighborhood', e.target.value)}
              placeholder="Manhattan"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={property.description}
            onChange={(e) => updateProperty('description', e.target.value)}
            placeholder="Property description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={property.rating}
              onChange={(e) => updateProperty('rating', Number.parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="reviewCount">Review Count</Label>
            <Input
              id="reviewCount"
              type="number"
              value={property.reviewCount}
              onChange={(e) => updateProperty('reviewCount', Number.parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export function PropertyDetailsSection({ property, updateProperty }: SectionProps) {
  const { uploadHostImage, uploading: hostImageUploading } = useHostImageUpload();
  const [bedMenu , setBedMenu] = useState<boolean>(false)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>Accommodation specifics & Hostex Widget Source</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={property.bedrooms}
              onChange={(e) => updateProperty('bedrooms', Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-4">
            <Label>Bedroom Bed Types</Label>
            {Array.from({ length: property.bedrooms }, (_, index) => {
              const bedroomNumber = index + 1;
              const existing = property.bedroomBedTypes?.find(b => b.bedroomNumber === bedroomNumber);
              return (
                <div key={bedroomNumber} className="flex items-center gap-2">
                  <span className="w-24">Bedroom {bedroomNumber}:</span>
                  <Input
                    value={existing?.bedTypes?.join(', ') || ''}
                    onChange={(e) => {
                      const value = e.target.value.split(',').map(v => v.trim());
                      const updated = [...(property.bedroomBedTypes || [])];
                      const idx = updated.findIndex(b => b.bedroomNumber === bedroomNumber);
                      if (idx >= 0) {
                        updated[idx].bedTypes = value;
                      } else {
                        updated.push({ bedroomNumber, bedTypes: value });
                      }
                      updateProperty('bedroomBedTypes', updated);
                    }}
                    placeholder="e.g. Queen, Twin"
                  />
                </div>
              );
            })}
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              value={property.bathrooms}
              onChange={(e) => updateProperty('bathrooms', Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="beds">Beds</Label>
            <Input
              id="beds"
              type="number"
              min="0"
              value={property.beds}
              onChange={(e) => updateProperty('beds', Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="guests">Max Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={property.guests}
              onChange={(e) => updateProperty('guests', Number.parseInt(e.target.value) || 1)}
            />
          </div>
        </div> */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className='relative' >
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              onClick={()=>setBedMenu(!bedMenu)}
              value={property.bedrooms}
              onChange={(e) => {
                updateProperty('bedrooms', Number.parseInt(e.target.value) || 0)
              }}
            />
          {(property.bedrooms > 0  && bedMenu) && (
            <div className="space-y-3 absolute top-[45px] w-full bg-white border-x-2 border-b-2 rounded-[8px] border-gray-500 mt-4">
              {/* <Label>Bedroom Bed Types</Label> */}
              {Array.from({ length: property.bedrooms }, (_, index) => {
                  const bedroomNumber = index + 1;
                  const existing = property.bedroomBedTypes?.find(
                    (b) => b.bedroomNumber === bedroomNumber
                  );
                  const selectedBedType = existing?.bedTypes || '';

                  return (
                    <div key={bedroomNumber} className="flex items-center gap-2">
                      <Select
                        value={selectedBedType}
                        onValueChange={(newValue) => {
                          const updated = [...(property.bedroomBedTypes || [])];
                          const idx = updated.findIndex(
                            (b) => b.bedroomNumber === bedroomNumber
                          );

                          if (idx >= 0) {
                            updated[idx].bedTypes = newValue;
                          } else {
                            updated.push({ bedroomNumber, bedTypes: newValue });
                          }

                          updateProperty('bedroomBedTypes', updated);
                        }}
                      >
                        <SelectTrigger className="w-full border-0">
                          <SelectValue placeholder={`Bedroom ${bedroomNumber}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Queen">Queen</SelectItem>
                          <SelectItem value="King">King</SelectItem>
                          <SelectItem value="Twin">Twin</SelectItem>
                          <SelectItem value="Bunk Bed">Bunk Bed</SelectItem>
                          <SelectItem value="Sofa Bed">Sofa Bed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}

              {/* {Array.from({ length: property.bedrooms }, (_, index) => {
                const bedroomNumber = index + 1;
                const existing = property.bedroomBedTypes?.find(b => b.bedroomNumber === bedroomNumber);
                const selectedBedType = existing?.bedTypes?.[0] || '';

                return (
                  <div key={bedroomNumber} className="flex items-center gap-2">
                    
                    <Select
                      value={selectedBedType}
                      onValueChange={(newValue) => {
                        const updated = [...(property.bedroomBedTypes || [])];
                        const idx = updated.findIndex(b => b.bedroomNumber === bedroomNumber);
                        const newBedTypeArray = newValue;
                        if (idx >= 0) {
                          updated[idx].bedTypes = newBedTypeArray;
                        } else {
                          updated.push({ bedroomNumber, bedTypes: newBedTypeArray });
                        }
                        updateProperty('bedroomBedTypes', updated);
                      }}
                    >
                      <SelectTrigger className="w-full border-0">
                        <SelectValue placeholder={`Select Bed Type for Bedroom ${bedroomNumber}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Double">Double</SelectItem>
                        <SelectItem value="Queen">Queen</SelectItem>
                        <SelectItem value="King">King</SelectItem>
                        <SelectItem value="Twin">Twin</SelectItem>
                        <SelectItem value="Bunk Bed">Bunk Bed</SelectItem>
                        <SelectItem value="Sofa Bed">Sofa Bed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })} */}
            </div>
          )}
          </div>


  {/* Bedrooms input */}
  {/* <div>
    <Label htmlFor="bedrooms">Bedrooms</Label>
    <Input
      id="bedrooms"
      type="number"
      min="0"
      value={property.bedrooms}
      onChange={(e) => updateProperty('bedrooms', Number.parseInt(e.target.value) || 0)}
    />
  </div> */}

  {/* Bedroom Bed Types Dropdowns */}
  {/* <div className="col-span-2 space-y-3">
    <Label>Bedroom Bed Types</Label>
    {Array.from({ length: property.bedrooms }, (_, index) => {
      const bedroomNumber = index + 1;
      const existing = property.bedroomBedTypes?.find(b => b.bedroomNumber === bedroomNumber);
      const selectedBedType = existing?.bedTypes?.[0] || '';

      return (
        <div key={bedroomNumber} className="flex items-center gap-2">
          <span className="w-28 shrink-0">Bedroom {bedroomNumber}:</span>
          <select
            value={selectedBedType}
            onChange={(e) => {
              const updated = [...(property.bedroomBedTypes || [])];
              const idx = updated.findIndex(b => b.bedroomNumber === bedroomNumber);
              const newValue = [e.target.value];
              if (idx >= 0) {
                updated[idx].bedTypes = newValue;
              } else {
                updated.push({ bedroomNumber, bedTypes: newValue });
              }
              updateProperty('bedroomBedTypes', updated);
            }}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Select bed type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Queen">Queen</option>
            <option value="King">King</option>
            <option value="Twin">Twin</option>
            <option value="Bunk Bed">Bunk Bed</option>
            <option value="Sofa Bed">Sofa Bed</option>
          </select>
        </div>
      );
    })}
  </div> */}

  {/* Other Inputs */}
  <div>
    <Label htmlFor="bathrooms">Bathrooms</Label>
    <Input
      id="bathrooms"
      type="number"
      min="0"
      value={property.bathrooms}
      onChange={(e) => updateProperty('bathrooms', Number.parseInt(e.target.value) || 0)}
    />
  </div>

  <div>
    <Label htmlFor="beds">Beds</Label>
    <Input
      id="beds"
      type="number"
      min="0"
      value={property.beds}
      onChange={(e) => updateProperty('beds', Number.parseInt(e.target.value) || 0)}
    />
  </div>

  <div>
    <Label htmlFor="guests">Max Guests</Label>
    <Input
      id="guests"
      type="number"
      min="1"
      value={property.guests}
      onChange={(e) => updateProperty('guests', Number.parseInt(e.target.value) || 1)}
    />
  </div>
</div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="host">Host Name</Label>
            <Input
              id="host"
              value={property.host}
              onChange={(e) => updateProperty('host', e.target.value)}
              placeholder="Host name"
            />
          </div>
          <div>
            <Label htmlFor="hostJoinedDate">Host Joined Year</Label>
            <Input
              id="hostJoinedDate"
              value={property.hostJoinedDate}
              onChange={(e) => updateProperty('hostJoinedDate', e.target.value)}
              placeholder="2024"
            />
          </div>
          <div>
            <ImageUploadComponent
              imageUrl={property.hostImage}
              onImageChange={(url) => updateProperty('hostImage', url)}
              label="Host Image"
              uploading={hostImageUploading}
              onUpload={uploadHostImage}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="listing_id">Hostex Listing Id</Label>
            <Input
              id="listing_id"
              value={property.listing_id}
              onChange={(e) => updateProperty('listing_id', e.target.value)}
              placeholder="123456...."
            />
          </div>
          <div>
            <Label htmlFor="hostexwidgetid">Hostex Widget Id</Label>
            <Input
              id="hostexwidgetid"
              value={property.hostexwidgetid}
              onChange={(e) => updateProperty('hostexwidgetid', e.target.value)}
              placeholder="ey0........"
            />
          </div>
          <div>
            <Label htmlFor="scriptsrc">Hostex Script Source</Label>
            <Input
              id="scriptsrc"
              value={property.scriptsrc}
              onChange={(e) => updateProperty('scriptsrc', e.target.value)}
              placeholder="https://hostex.io/............"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn">Check-in Time</Label>
            <Input
              id="checkIn"
              value={property.checkIn}
              onChange={(e) => updateProperty('checkIn', e.target.value)}
              placeholder="3:00 PM"
            />
          </div>
          <div>
            <Label htmlFor="checkOut">Check-out Time</Label>
            <Input
              id="checkOut"
              value={property.checkOut}
              onChange={(e) => updateProperty('checkOut', e.target.value)}
              placeholder="11:00 AM"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export function ImagesSection({ property, updateProperty }: SectionProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadMultipleImages, uploading, uploadProgress } = useImageUpload();

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      updateProperty('images', [...property.images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = property.images.filter((_, i) => i !== index);
    updateProperty('images', newImages);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const results = await uploadMultipleImages(validFiles);
      const newImageUrls = results.map(result => result.url);
      updateProperty('images', [...property.images, ...newImageUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images. Please try again.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Images</CardTitle>
        <CardDescription>Upload images or add URLs for property photos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-rose-500 bg-rose-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop images here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
            </div>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-gray-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual URL Input */}
        {/* <div className="border-t pt-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Or add image URL manually
          </Label>
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              onKeyPress={(e) => e.key === 'Enter' && addImageUrl()}
            />
            <Button onClick={addImageUrl} disabled={!newImageUrl.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div> */}

        {/* Image Preview Grid */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Current Images ({property.images.length})
          </Label>
          
          {property.images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No images added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.jpg'; // Add a placeholder image
                      }}
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                  
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-rose-500">
                      Main Image
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


export function AmenitiesSection({ property, updateProperty }: SectionProps) {
  const [newAmenity, setNewAmenity] = useState('');

  const addAmenity = () => {
    if (newAmenity.trim() && !property.amenities.includes(newAmenity.trim())) {
      updateProperty('amenities', [...property.amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    updateProperty('amenities', property.amenities.filter(a => a !== amenity));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
        <CardDescription>Available amenities and features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Enter amenity"
            onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
          />
          <Button onClick={addAmenity} disabled={!newAmenity.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.amenities.map((amenity) => (
            <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
              {amenity}
              <button
                type="button"
                onClick={() => removeAmenity(amenity)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function LocationDetailsSection({ property, updateProperty, updateNestedProperty }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><MapPin className="mr-2" /> Location Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="location">Location (e.g., New York, NY)</label>
          <Input id="location" value={property.location} onChange={(e) => updateProperty('location', e.target.value)} />
        </div>
        <div>
          <label htmlFor="neighborhood">Neighborhood</label>
          <Input id="neighborhood" value={property.neighborhood} onChange={(e) => updateProperty('neighborhood', e.target.value)} />
        </div>

        {/* <EditableMap
          coordinates={property.coordinates}
          onCoordinatesChange={(coords) => updateProperty('coordinates', coords)}
        /> */}

        <div>
          <Label htmlFor="neighborhoodDescription">Neighborhood Description</Label>
          <Textarea
            id="neighborhoodDescription"
            value={property.neighborhoodInfo.description}
            onChange={(e) => updateNestedProperty('neighborhoodInfo', 'description', e.target.value)}
            placeholder="Describe the neighborhood"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="walkScore">Walk Score (0-100)</Label>
            <Input
              id="walkScore"
              type="number"
              min="0"
              max="100"
              value={property.neighborhoodInfo.walkScore}
              onChange={(e) => updateNestedProperty('neighborhoodInfo', 'walkScore', Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="transitScore">Transit Score (0-100)</Label>
            <Input
              id="transitScore"
              type="number"
              min="0"
              max="100"
              value={property.neighborhoodInfo.transitScore}
              onChange={(e) => updateNestedProperty('neighborhoodInfo', 'transitScore', Number.parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HouseRulesSection({ property, updateProperty }: SectionProps) {
  const [newRule, setNewRule] = useState('');

  const addRule = () => {
    if (newRule.trim()) {
      updateProperty('houseRules', [...property.houseRules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    updateProperty('houseRules', property.houseRules.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>House Rules & Policies</CardTitle>
        <CardDescription>Property rules and cancellation policy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div>
            <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
            <Textarea
              id="cancellationPolicy"
              rows={6}
              value={property.cancellationPolicy}
              onChange={(e) => updateProperty('cancellationPolicy', e.target.value)}
              placeholder="Enter cancellation policy using markdown..."
            />
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <Label className="mb-2 block">Preview:</Label>
              <ReactMarkdown>{property.cancellationPolicy}</ReactMarkdown>
            </div>
          </div>
        {/* <div>
          <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
          <Input
            id="cancellationPolicy"
            value={property.cancellationPolicy}
            onChange={(e) => updateProperty('cancellationPolicy', e.target.value)}
            placeholder="e.g., Flexible cancellation policy"
          />
        </div> */}

        <div>
          <Label>House Rules</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Enter house rule"
              onKeyPress={(e) => e.key === 'Enter' && addRule()}
            />
            <Button onClick={addRule} disabled={!newRule.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {property.houseRules.map((rule , index) => (
            <div key={rule} className="flex items-center gap-2 p-2 border rounded">
              <span className="flex-1">{rule}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRule(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


export function ReviewsSection({ property, updateProperty }: SectionProps) {
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState<Omit<Review, 'id'>>({
    user: '',
    userImage: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    comment: '',
  });
  
  const [uploadingUserImage, setUploadingUserImage] = useState<string | null>(null);
  const { uploadUserImage, uploading: userImageUploading } = useUserImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateReview = (review: Review) => {
    const updatedReviews = property.reviews.map(r => r.id === review.id ? review : r);
    updateProperty('reviews', updatedReviews);
    setEditingReview(null);
  };

  const handleAddReview = () => {
    if (!newReview.user.trim() || !newReview.comment.trim()) {
      alert('Please fill in user name and comment');
      return;
    }
    
    const reviewToAdd: Review = { ...newReview, id: `review_${Date.now()}` };
    const updatedReviews = [...property.reviews, reviewToAdd];
    updateProperty('reviews', updatedReviews);
    setNewReview({ 
      user: '', 
      userImage: '', 
      rating: 5, 
      date: new Date().toISOString().split('T')[0], 
      comment: '' 
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = property.reviews.filter(r => r.id !== reviewId);
    updateProperty('reviews', updatedReviews);
  };

  const handleUserImageUpload = async (file: File, isEditing: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit for user images
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingUserImage(isEditing ? 'editing' : 'new');
      const result = await uploadUserImage(file);
      
      if (isEditing && editingReview) {
        setEditingReview(prev => prev ? { ...prev, userImage: result.url } : null);
      } else {
        setNewReview(prev => ({ ...prev, userImage: result.url }));
      }
    } catch (error) {
      console.error('Failed to upload user image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingUserImage(null);
    }
  };

  const UserImageUploadSection = ({ 
    imageUrl, 
    onImageChange, 
    isEditing = false 
  }: { 
    imageUrl: string; 
    onImageChange: (url: string) => void;
    isEditing?: boolean;
  }) => (
    <div className="space-y-2">
      <Label>User Image</Label>
      <div className="flex items-center gap-4">
        {imageUrl && (
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="User avatar" 
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingUserImage === (isEditing ? 'editing' : 'new')}
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploadingUserImage === (isEditing ? 'editing' : 'new') ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUserImageUpload(file, isEditing);
              }
            }}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500">
            Upload an image or paste a URL. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>Manage property reviews</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form for adding a new review */}
        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="font-semibold">Add New Review</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>User Name</Label>
              <Input 
                placeholder="User Name" 
                value={newReview.user} 
                onChange={e => setNewReview(prev => ({ ...prev, user: e.target.value }))} 
              />
            </div>
            
            <div>
              <Label>Rating</Label>
              <Input 
                type="number" 
                min="1" 
                max="5" 
                placeholder="Rating (1-5)" 
                value={newReview.rating} 
                onChange={e => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))} 
              />
            </div>
          </div>


          <div>
            <Label>Date</Label>
            <Input 
              type="date" 
              value={newReview.date} 
              onChange={e => setNewReview(prev => ({ ...prev, date: e.target.value }))} 
            />
          </div>
          
          <div>
            <Label>Comment</Label>
            <Textarea 
              placeholder="Review comment" 
              value={newReview.comment} 
              onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={3}
            />
          </div>
          
          <UserImageUploadSection
            imageUrl={newReview.userImage}
            onImageChange={(url) => setNewReview(prev => ({ ...prev, userImage: url }))}
            isEditing={false}
          />
          
          <Button onClick={handleAddReview} disabled={!newReview.user.trim() || !newReview.comment.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>

        {/* List of existing reviews */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Existing Reviews ({property.reviews?.length || 0})
          </Label>
          
          {property.reviews && property.reviews.length > 0 ? (
            property.reviews.map((review: Review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-4">
                {editingReview?.id === review.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>User Name</Label>
                        <Input 
                          value={editingReview.user} 
                          onChange={e => setEditingReview(prev => prev ? { ...prev, user: e.target.value } : null)} 
                        />
                      </div>
                      
                      <div>
                        <Label>Rating</Label>
                        <Input 
                          type="number" 
                          min="1" 
                          max="5" 
                          value={editingReview.rating} 
                          onChange={e => setEditingReview(prev => prev ? { ...prev, rating: Number(e.target.value) } : null)} 
                        />
                      </div>
                    </div>

                    <UserImageUploadSection
                      imageUrl={editingReview.userImage}
                      onImageChange={(url) => setEditingReview(prev => prev ? { ...prev, userImage: url } : null)}
                      isEditing={true}
                    />

                    <div>
                      <Label>Date</Label>
                      <Input 
                        type="date" 
                        value={editingReview.date} 
                        onChange={e => setEditingReview(prev => prev ? { ...prev, date: e.target.value } : null)} 
                      />
                    </div>
                    
                    <div>
                      <Label>Comment</Label>
                      <Textarea 
                        value={editingReview.comment} 
                        onChange={e => setEditingReview(prev => prev ? { ...prev, comment: e.target.value } : null)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateReview(editingReview)}>
                        Save Changes
                      </Button>
                      <Button variant="ghost" onClick={() => setEditingReview(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-4 mb-3">
                      {review.userImage && (
                        <img 
                          src={review.userImage} 
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{review.rating}</span>
                          </div>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingReview(review)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No reviews yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function HostexConfigSection({ property, updateProperty }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hostex Widget Configuration</CardTitle>
        <CardDescription>
          Configure the Hostex widget for this property.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="hostexwidgetid">Hostex Widget ID</Label>
          <Input
            id="hostexwidgetid"
            value={property.hostexwidgetid || ''}
            onChange={(e) => updateProperty('hostexwidgetid', e.target.value)}
            placeholder="Enter Hostex widget ID"
          />
        </div>
        <div>
          <Label htmlFor="scriptsrc">Script Source URL</Label>
          <Input
            id="scriptsrc"
            value={property.scriptsrc || ''}
            onChange={(e) => updateProperty('scriptsrc', e.target.value)}
            placeholder="Enter script source URL"
          />
        </div>
      </CardContent>
    </Card>
  );
}
