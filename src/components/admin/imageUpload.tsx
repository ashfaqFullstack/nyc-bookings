// components/ImageUploadComponent.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface ImageUploadComponentProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label?: string;
  uploading?: boolean;
  onUpload: (file: File) => Promise<{ url: string }>;
}

export function ImageUploadComponent({
  imageUrl,
  onImageChange,
  label = 'Image',
  uploading = false,
  onUpload,
}: ImageUploadComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      const result = await onUpload(file);
      onImageChange(result.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {imageUrl && (
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="Host avatar" 
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
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500">
            Upload an image. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}