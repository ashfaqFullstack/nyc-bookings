import { useState } from 'react';

interface UserImageUploadResult {
  url: string;
  publicId: string;
}

export function useUserImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadUserImage = async (file: File): Promise<UserImageUploadResult> => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'user-avatars'); // Different folder for user images

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
      console.error('User image upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadUserImage,
    uploading
  };
}
