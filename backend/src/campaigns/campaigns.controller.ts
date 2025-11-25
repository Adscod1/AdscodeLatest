import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, CampaignQueryDto, CampaignResponseDto, UpdateCampaignDto, ProductsQueryDto } from './dto/campaign.dto';
import { CampaignStatus, CampaignType } from '@prisma/client';

@ApiTags('campaigns')
@Controller('campaigns')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List all campaigns for the authenticated brand' })
  @ApiQuery({ name: 'status', required: false, enum: CampaignStatus })
  @ApiQuery({ name: 'type', required: false, enum: CampaignType })
  @ApiResponse({ 
    status: 200, 
    description: 'List of campaigns with applicant counts',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        campaigns: { 
          type: 'array',
          items: { $ref: '#/components/schemas/CampaignResponseDto' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async findAll(
    @UserId() userId: string,
    @Query() query: CampaignQueryDto,
  ) {
    return this.campaignsService.findAll(userId, query);
  }

  // Static routes MUST come before dynamic :id routes
  @Get('available')
  @ApiOperation({ summary: 'Get available campaigns for influencers to browse' })
  @ApiResponse({ status: 200, description: 'List of available campaigns' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Influencer profile pending approval' })
  @ApiResponse({ status: 404, description: 'Influencer profile not found' })
  async getAvailable(@UserId() userId: string) {
    return this.campaignsService.getAvailable(userId);
  }

  @Get('my-applications')
  @ApiOperation({ summary: "Get influencer's campaign applications" })
  @ApiResponse({ status: 200, description: 'List of applications' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Influencer profile not found' })
  async getMyApplications(@UserId() userId: string) {
    return this.campaignsService.getMyApplications(userId);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get products for campaign creation' })
  @ApiResponse({ status: 200, description: 'List of products with pagination' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getProducts(
    @UserId() userId: string,
    @Query() query: ProductsQueryDto,
  ) {
    return this.campaignsService.getProducts(userId, query);
  }

  // Dynamic :id routes come after static routes
  @Get(':id')
  @ApiOperation({ summary: 'Get a single campaign by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Campaign details',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        campaign: { $ref: '#/components/schemas/CampaignResponseDto' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not campaign owner' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findOne(
    @UserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.campaignsService.findOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new draft campaign' })
  @ApiResponse({ 
    status: 201, 
    description: 'Campaign created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        campaign: { $ref: '#/components/schemas/CampaignResponseDto' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Store required' })
  async create(
    @UserId() userId: string,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.campaignsService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a draft campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  @ApiResponse({ status: 400, description: 'Only draft campaigns can be edited' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a draft campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  @ApiResponse({ status: 400, description: 'Only draft campaigns can be deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async delete(
    @UserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.campaignsService.delete(userId, id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a draft campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign published successfully' })
  @ApiResponse({ status: 400, description: 'Campaign is already published or incomplete' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async publish(
    @UserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.campaignsService.publish(userId, id);
  }

  @Post(':id/apply')
  @ApiOperation({ summary: 'Apply to a campaign (for influencers)' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Already applied or campaign not accepting applications' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Only approved influencers can apply' })
  @ApiResponse({ status: 404, description: 'Campaign or influencer not found' })
  async apply(
    @UserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.campaignsService.apply(userId, id);
  }

  @Get(':id/applicants')
  @ApiOperation({ summary: 'Get all applicants for a campaign (for brand owners)' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'List of applicants' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async getApplicants(
    @UserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.campaignsService.getApplicants(userId, id);
  }

  @Post(':id/applicants/:influencerId/select')
  @ApiOperation({ summary: 'Select an influencer for a campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiParam({ name: 'influencerId', description: 'Influencer ID' })
  @ApiResponse({ status: 200, description: 'Influencer selected successfully' })
  @ApiResponse({ status: 400, description: 'Influencer already selected' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Campaign, influencer, or application not found' })
  async selectInfluencer(
    @UserId() userId: string,
    @Param('id') id: string,
    @Param('influencerId') influencerId: string,
  ) {
    return this.campaignsService.selectInfluencer(userId, id, influencerId);
  }
}
