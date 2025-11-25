import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  /**
   * Upload media file (general purpose - for stores, profiles, etc.)
   * Corresponds to /api/new/media
   */
  async uploadMedia(
    userId: string,
    file: Express.Multer.File,
    type: string = 'image',
  ): Promise<{
    success: boolean;
    message: string;
    url: string;
    filename: string;
    type: string;
    size: number;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type based on upload type
    const isVideo = type === 'video' || file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (type === 'video' && !file.mimetype.startsWith('video/')) {
      throw new BadRequestException('Invalid video file type');
    }

    if (type !== 'video' && !isImage) {
      throw new BadRequestException('Invalid image file type');
    }

    // Validate file size (5MB limit for images/general, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds ${isVideo ? '50MB' : '5MB'} limit`,
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${userId}_${type}_${timestamp}.${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;

    return {
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      filename,
      type: file.mimetype,
      size: file.size,
    };
  }

  /**
   * Upload review media file (images and videos for reviews)
   * Corresponds to /api/upload/media
   */
  async uploadReviewMedia(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{
    success: boolean;
    url: string;
    mediaType?: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new BadRequestException(
        'Invalid file type. Only images and videos are allowed',
      );
    }

    // Validate file size (5MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File too large. Max size is ${isVideo ? '50MB' : '5MB'}`,
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.originalname.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Ensure uploads/reviews directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // Return public URL
    const publicUrl = `/uploads/reviews/${filename}`;

    return {
      success: true,
      url: publicUrl,
      mediaType: isVideo ? 'video' : 'image',
    };
  }

  /**
   * Upload service media file (images and videos for services)
   * Corresponds to /api/service/media
   */
  async uploadServiceMedia(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{
    success: boolean;
    url: string;
    filename: string;
    type: string;
    size: number;
    mediaType?: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new BadRequestException(
        'Invalid file type. Only images and videos are allowed',
      );
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File too large. Max size is ${isVideo ? '50MB' : '10MB'}`,
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.originalname.split('.').pop();
    const filename = `service_${timestamp}-${randomString}.${extension}`;

    // Ensure uploads/services directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'services');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // Return public URL
    const publicUrl = `/uploads/services/${filename}`;

    return {
      success: true,
      url: publicUrl,
      filename,
      type: file.mimetype,
      size: file.size,
      mediaType: isVideo ? 'video' : 'image',
    };
  }

  /**
   * Upload product media file (images and videos for products)
   * Corresponds to /api/product/media
   */
  async uploadProductMedia(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{
    success: boolean;
    url: string;
    filename: string;
    type: string;
    size: number;
    mediaType?: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new BadRequestException(
        'Invalid file type. Only images and videos are allowed',
      );
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File too large. Max size is ${isVideo ? '50MB' : '10MB'}`,
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.originalname.split('.').pop();
    const filename = `product_${timestamp}-${randomString}.${extension}`;

    // Ensure uploads/products directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // Return public URL
    const publicUrl = `/uploads/products/${filename}`;

    return {
      success: true,
      url: publicUrl,
      filename,
      type: file.mimetype,
      size: file.size,
      mediaType: isVideo ? 'video' : 'image',
    };
  }
}
