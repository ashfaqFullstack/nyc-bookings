// hooks/useHostImageUpload.ts
import { useState } from 'react';

interface HostImageUploadResult {
  url: string;
  publicId: string;
}

export function useHostImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadHostImage = async (file: File): Promise<HostImageUploadResult> => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'host-avatars'); // Different folder for host images

      const token = localStorage.getItem('authToken');

      const response = await fetch('/api/admin/properties/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Host image upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadHostImage,
    uploading
  };
}