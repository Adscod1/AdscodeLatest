import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
    this.bucketName = this.configService.get('AWS_S3_BUCKET') || 'adscode-media';
  }

  /**
   * Upload file to S3
   */
  async uploadToS3(
    file: Express.Multer.File,
    folder: string = 'uploads',
    userId: string,
    type: string = 'image',
  ): Promise<{
    success: boolean;
    url: string;
    filename: string;
    type: string;
    size: number;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const isVideo = type === 'video' || file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new BadRequestException('Invalid file type');
    }

    // Validate file size (5MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds ${isVideo ? '50MB' : '5MB'} limit`,
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${userId}_${type}_${timestamp}.${fileExtension}`;
    const key = `${folder}/${filename}`;

    try {
      // Upload to S3
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          // Make file publicly accessible
          ACL: 'public-read',
          // Optional: Set cache headers for better performance
          CacheControl: 'max-age=31536000',
        }),
      );

      // Generate public URL
      const cloudFrontUrl = this.configService.get('AWS_CLOUDFRONT_URL');
      const fileUrl = cloudFrontUrl
        ? `${cloudFrontUrl}/${key}`
        : `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;

      return {
        success: true,
        url: fileUrl,
        filename,
        type: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFromS3(fileKey: string): Promise<boolean> {
    try {
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
        }),
      );
      return true;
    } catch (error) {
      console.error('S3 delete error:', error);
      return false;
    }
  }
}
