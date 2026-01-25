import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';
import { InfluencersService } from './influencers.service';
import { RegisterInfluencerDto } from './dto/register-influencer.dto';

@ApiTags('Influencers')
@Controller('influencer')
export class InfluencersController {
  constructor(private readonly influencersService: InfluencersService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all approved and pending influencers' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of influencers with social accounts and engagement metrics',
  })
  async getInfluencers() {
    return this.influencersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get influencer by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Influencer profile with all details',
  })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async getInfluencerById(@Param('id') id: string) {
    return this.influencersService.findById(id);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current influencer profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current influencer profile with all details',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentInfluencer(@UserId() userId: string) {
    const influencer = await this.influencersService.getCurrentInfluencer(userId);
    return {
      success: true,
      influencer,
    };
  }

  @Get('stats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get influencer stats' })
  @ApiResponse({ 
    status: 200, 
    description: 'Influencer statistics including follower count',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInfluencerStats(@UserId() userId: string) {
    const stats = await this.influencersService.getInfluencerStats(userId);
    return {
      success: true,
      stats,
    };
  }

  @Post('register')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as an influencer' })
  @ApiResponse({ 
    status: 201, 
    description: 'Influencer profile created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async register(
    @UserId() userId: string,
    @Body() dto: RegisterInfluencerDto,
  ) {
    return this.influencersService.register(userId, dto);
  }

  @Post('apply/:campaignId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply to a campaign as an influencer' })
  @ApiResponse({ 
    status: 201, 
    description: 'Successfully applied to campaign',
  })
  @ApiResponse({ status: 400, description: 'Invalid request or already applied' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async applyCampaign(
    @UserId() userId: string,
    @Param('campaignId') campaignId: string,
  ) {
    return this.influencersService.applyCampaign(userId, campaignId);
  }

  @Get('applied/:campaignId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if influencer has applied to a campaign' })
  @ApiResponse({ 
    status: 200, 
    description: 'Application status',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async hasAppliedToCampaign(
    @UserId() userId: string,
    @Param('campaignId') campaignId: string,
  ) {
    const hasApplied = await this.influencersService.hasAppliedToCampaign(userId, campaignId);
    return {
      success: true,
      hasApplied,
    };
  }

  @Delete('reset')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete influencer profile and reset status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Influencer profile deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Influencer profile not found' })
  async reset(@UserId() userId: string) {
    return this.influencersService.reset(userId);
  }
}
