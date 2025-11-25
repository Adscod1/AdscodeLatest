import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a store review
   */
  async create(userId: string, data: CreateReviewDto) {
    // Verify store exists
    const store = await this.prisma.store.findUnique({
      where: { id: data.storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if user already reviewed this store
    const existingReview = await this.prisma.storeReview.findFirst({
      where: {
        storeId: data.storeId,
        userId: userId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this store');
    }

    const review = await this.prisma.storeReview.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        images: data.images,
        videos: data.videos,
        user: {
          connect: { id: userId },
        },
        store: {
          connect: { id: data.storeId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return review;
  }

  /**
   * Get all reviews for a store
   */
  async findByStore(storeId: string) {
    // Verify store exists
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const reviews = await this.prisma.storeReview.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  }

  /**
   * Get average rating for a store
   */
  async getStoreRating(storeId: string) {
    const result = await this.prisma.storeReview.aggregate({
      where: { storeId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating,
    };
  }

  /**
   * Update a review
   */
  async update(
    userId: string,
    reviewId: string,
    data: Partial<CreateReviewDto>,
  ) {
    const review = await this.prisma.storeReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    const updatedReview = await this.prisma.storeReview.update({
      where: { id: reviewId },
      data: {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment }),
        ...(data.images !== undefined && { images: data.images }),
        ...(data.videos !== undefined && { videos: data.videos }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return updatedReview;
  }

  /**
   * Delete a review
   */
  async delete(userId: string, reviewId: string) {
    const review = await this.prisma.storeReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    await this.prisma.storeReview.delete({
      where: { id: reviewId },
    });

    return { success: true, message: 'Review deleted successfully' };
  }
}
