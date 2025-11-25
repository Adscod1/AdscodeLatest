import {
  Controller,
  Get,
  Post,
  Put,
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
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCommentDto } from './dto/product.dto';

@ApiTags('products')
@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not store owner' })
  async create(@UserId() userId: string, @Body() dto: CreateProductDto) {
    return this.productsService.create(userId, dto);
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get all products for a store' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findByStore(@Param('storeId') storeId: string) {
    return this.productsService.findByStore(storeId);
  }

  @Get('store/:storeId/popular')
  @ApiOperation({ summary: 'Get popular products for a store' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'List of popular products' })
  async getPopular(@Param('storeId') storeId: string) {
    return this.productsService.getPopular(storeId);
  }

  @Get('store/:storeId/activity')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store activity log' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'Store activity log' })
  async getStoreActivity(@Param('storeId') storeId: string) {
    return this.productsService.getStoreActivity(storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(@UserId() userId: string, @Param('id') id: string) {
    return this.productsService.delete(userId, id);
  }

  @Post('media')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload product media (image or video)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          default: 'product',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Media uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadMedia(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string = 'product',
  ) {
    return this.productsService.uploadMedia(userId, file, type);
  }
}

// Comments Controller - separate route
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':productId')
  @ApiOperation({ summary: 'Get comments for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  async getComments(@Param('productId') productId: string) {
    return this.productsService.getComments(productId);
  }

  @Post(':productId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createComment(
    @UserId() userId: string,
    @Param('productId') productId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.productsService.createComment(userId, productId, dto);
  }
}
