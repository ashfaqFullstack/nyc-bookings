import { useState } from 'react';

interface UploadResult {
  url: string;
  publicId: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const uploadImage = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    const fileId = `${file.name}-${Date.now()}`;
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      
      // Simulate progress for better UX
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: Math.min((prev[fileId] || 0) + 10, 90)
        }));
      }, 200);

      const response = await fetch('/api/admin/properties/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      
      // Clean up progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }, 1000);

      return result;
    } catch (error) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      try {
        const result = await uploadImage(file);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }
    
    return results;
  };

  return {
    uploadImage,
    uploadMultipleImages,
    uploading,
    uploadProgress
  };
}
