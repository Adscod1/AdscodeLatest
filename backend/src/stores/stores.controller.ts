import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';
import { StoresService, CreateStoreDto, GetStoresParams } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@UserId() userId: string, @Body() data: CreateStoreDto) {
    const store = await this.storesService.create(userId, data);
    return {
      success: true,
      store,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all stores for the authenticated user' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of stores owned by the user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserStores(@UserId() userId: string) {
    const stores = await this.storesService.findUserStores(userId);
    return {
      success: true,
      stores,
    };
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all stores with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'createdAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Stores retrieved successfully' })
  async getAllStores(@Query() query: GetStoresParams) {
    return this.storesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a store by ID' })
  @ApiResponse({ status: 200, description: 'Store retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStore(@Param('id') id: string) {
    const store = await this.storesService.findById(id);
    return {
      success: true,
      store,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({ status: 200, description: 'Store updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or access denied' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() data: Partial<CreateStoreDto>,
  ) {
    const store = await this.storesService.update(userId, id, data);
    return {
      success: true,
      store,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a store' })
  @ApiResponse({ status: 200, description: 'Store deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async delete(@UserId() userId: string, @Param('id') id: string) {
    return this.storesService.delete(userId, id);
  }
}
