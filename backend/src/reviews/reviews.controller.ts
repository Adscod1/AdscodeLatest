import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, ReviewResponseDto } from './dto/review.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a store review' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or already reviewed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async create(@UserId() userId: string, @Body() data: CreateReviewDto) {
    console.log('Received review data:', JSON.stringify(data, null, 2));
    console.log('User ID:', userId);
    const review = await this.reviewsService.create(userId, data);
    return {
      success: true,
      review,
    };
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get all reviews for a store' })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async findByStore(@Param('storeId') storeId: string) {
    const reviews = await this.reviewsService.findByStore(storeId);
    return {
      success: true,
      reviews,
    };
  }

  @Get('store/:storeId/rating')
  @ApiOperation({ summary: 'Get average rating for a store' })
  @ApiResponse({
    status: 200,
    description: 'Rating retrieved successfully',
  })
  async getStoreRating(@Param('storeId') storeId: string) {
    const rating = await this.reviewsService.getStoreRating(storeId);
    return {
      success: true,
      ...rating,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() data: Partial<CreateReviewDto>,
  ) {
    const review = await this.reviewsService.update(userId, id, data);
    return {
      success: true,
      review,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async delete(@UserId() userId: string, @Param('id') id: string) {
    return this.reviewsService.delete(userId, id);
  }
}
