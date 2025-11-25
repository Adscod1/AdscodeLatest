import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';
import { StoresService } from './stores.service';

@ApiTags('stores')
@Controller('stores')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stores for the authenticated user' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of stores owned by the user',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          logo: { type: 'string', nullable: true },
          banner: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserStores(@UserId() userId: string) {
    return this.storesService.findUserStores(userId);
  }
}
