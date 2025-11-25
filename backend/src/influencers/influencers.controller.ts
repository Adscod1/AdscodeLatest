import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';
import { InfluencersService } from './influencers.service';
import { RegisterInfluencerDto } from './dto/register-influencer.dto';

@ApiTags('influencers')
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
