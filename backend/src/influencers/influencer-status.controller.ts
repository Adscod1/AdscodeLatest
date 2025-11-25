import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';
import { InfluencersService } from './influencers.service';

@ApiTags('influencers')
@Controller('check-influencer-status')
export class InfluencerStatusController {
  constructor(private readonly influencersService: InfluencersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if current user has influencer status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Influencer status check result',
    schema: {
      type: 'object',
      properties: {
        isInfluencer: { type: 'boolean' },
        status: { type: 'string', nullable: true },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkStatus(@UserId() userId: string) {
    return this.influencersService.checkStatus(userId);
  }
}
