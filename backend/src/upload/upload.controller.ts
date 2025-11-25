import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadMediaDto, UploadResponseDto, ReviewUploadResponseDto, ServiceUploadResponseDto, ProductUploadResponseDto } from './dto/upload.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';

@ApiTags('Upload')
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('new/media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload general media (logo, banner, gallery, video)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image or video file (max 5MB for images, 50MB for videos)',
        },
        type: {
          type: 'string',
          enum: ['logo', 'banner', 'gallery', 'video', 'image'],
          default: 'image',
          description: 'Type of upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Media uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadMedia(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadMediaDto,
  ) {
    return this.uploadService.uploadMedia(userId, file, body.type || 'image');
  }

  @Post('upload/media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload review media (images/videos for reviews)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image or video file (max 5MB for images, 50MB for videos)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Review media uploaded successfully',
    type: ReviewUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadReviewMedia(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadReviewMedia(userId, file);
  }

  @Post('service/media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload service media (images/videos for services)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image or video file (max 10MB for images, 50MB for videos)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Service media uploaded successfully',
    type: ServiceUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadServiceMedia(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadServiceMedia(userId, file);
  }

  @Post('product/media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload product media (images/videos for products)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image or video file (max 10MB for images, 50MB for videos)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product media uploaded successfully',
    type: ProductUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadProductMedia(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadProductMedia(userId, file);
  }
}
