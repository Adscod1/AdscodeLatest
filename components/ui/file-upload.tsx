import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { useFileUpload } from '@/hooks/use-file-upload';
import Image from 'next/image';

interface FileUploadProps {
  type: 'logo' | 'banner' | 'gallery' | 'video';
  onUpload: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onUpload,
  currentUrl,
  accept = "image/*",
  maxSize = 5,
  className = "",
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useFileUpload();
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const result = await uploadFile(file, type);
    if (result.success && result.url) {
      onUpload(result.url);
    } else {
      setPreview(currentUrl || null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getUploadText = () => {
    switch (type) {
      case 'logo': return 'Upload Logo';
      case 'banner': return 'Upload Banner';
      case 'gallery': return 'Add Image';
      case 'video': return 'Add Video';
      default: return 'Upload File';
    }
  };

  const getRecommendedSize = () => {
    switch (type) {
      case 'logo': return '512x512px (max 5MB)';
      case 'banner': return '1920x1080px (max 5MB)';
      case 'gallery': return 'High quality images (max 5MB)';
      case 'video': return 'MP4, WebM, MOV (max 5MB)';
      default: return 'Max 5MB';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      
      {preview ? (
        <div className="relative group w-full h-full">
          {type === 'video' ? (
            <video 
              src={preview} 
              className="w-full h-full object-cover rounded-lg"
              controls
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Upload overlay when uploading */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={handleFileSelect}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 cursor-pointer transition-colors"
        >
          <div className="text-center">
            {children || (
              <>
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {getUploadText()}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500">
                  {getRecommendedSize()}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
