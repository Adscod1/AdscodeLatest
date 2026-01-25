import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
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
import { ServicesService } from './services.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
  PatchServiceDto,
  ServiceQueryDto,
  ServiceResponseDto,
} from './dto/service.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@UserId() userId: string, @Body() data: CreateServiceDto) {
    console.log('=== SERVICE CREATE REQUEST ===');
    console.log('User ID:', userId);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    try {
      const service = await this.servicesService.create(userId, data);
      console.log('=== SERVICE CREATED SUCCESSFULLY ===');
      return {
        success: true,
        message: 'Service created successfully',
        service,
      };
    } catch (error) {
      console.error('=== SERVICE CREATE ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all services for a store' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Store ID is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByStore(@Query() query: ServiceQueryDto) {
    const services = await this.servicesService.findByStore(query.storeId);
    return {
      success: true,
      services,
    };
  }

  // Media upload endpoint - must be before :id routes
  @Post('media/upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload service media (image or video)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image or video file (max 5MB for images, 10MB for videos)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Media uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadMedia(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.servicesService.uploadMedia(userId, file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    return {
      success: true,
      service,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Full update of a service' })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() data: UpdateServiceDto,
  ) {
    const service = await this.servicesService.update(userId, id, data);
    return {
      success: true,
      message: 'Service updated successfully',
      service,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Partial update of a service' })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async patch(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() data: PatchServiceDto,
  ) {
    const service = await this.servicesService.patch(userId, id, data);
    return {
      success: true,
      message: 'Service updated successfully',
      service,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async delete(@UserId() userId: string, @Param('id') id: string) {
    return this.servicesService.delete(userId, id);
  }
}
