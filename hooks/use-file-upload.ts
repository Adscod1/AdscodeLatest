import { useState } from 'react';
import { toast } from 'sonner';

interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  type?: string;
  size?: number;
  error?: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, type: string = 'image'): Promise<UploadResult> => {
    setUploading(true);
    
    try {
      // Validate file before upload
      if (!file) {
        throw new Error('No file selected');
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/new/media', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      toast.success('File uploaded successfully!');
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
