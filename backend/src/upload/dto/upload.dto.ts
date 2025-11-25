import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UploadMediaDto {
  @ApiPropertyOptional({
    description: 'Type of upload',
    enum: ['logo', 'banner', 'gallery', 'video', 'image', 'review'],
    default: 'image',
  })
  @IsString()
  @IsOptional()
  @IsIn(['logo', 'banner', 'gallery', 'video', 'image', 'review'])
  type?: string = 'image';
}

export class UploadResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ description: 'Public URL of the uploaded file' })
  url: string;

  @ApiProperty({ description: 'Filename on server' })
  filename: string;

  @ApiProperty({ description: 'File MIME type' })
  type: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;
}

export class ReviewUploadResponseDto extends UploadResponseDto {
  @ApiPropertyOptional({ description: 'Media type (image or video)' })
  mediaType?: string;
}

export class ServiceUploadResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ description: 'Public URL of the uploaded file' })
  url: string;

  @ApiProperty({ description: 'Filename on server' })
  filename: string;

  @ApiProperty({ description: 'File MIME type' })
  type: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiPropertyOptional({ description: 'Media type (image or video)' })
  mediaType?: string;
}

export class ProductUploadResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ description: 'Public URL of the uploaded file' })
  url: string;

  @ApiProperty({ description: 'Filename on server' })
  filename: string;

  @ApiProperty({ description: 'File MIME type' })
  type: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiPropertyOptional({ description: 'Media type (image or video)' })
  mediaType?: string;
}
