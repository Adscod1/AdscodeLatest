import { useState } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

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

  const uploadFile = async (
    file: File, 
    type: string = 'image',
    endpoint: string = '/upload/media'
  ): Promise<UploadResult> => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Use backend URL for upload
      const uploadUrl = endpoint.startsWith('/api/') 
        ? `${API_BASE_URL}${endpoint.replace('/api/', '/')}`
        : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include',
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
