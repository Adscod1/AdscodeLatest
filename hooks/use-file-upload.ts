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

  const uploadFile = async (
    file: File, 
    type: string = 'image',
    endpoint: string = '/api/new/media'
  ): Promise<UploadResult> => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(endpoint, {
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
