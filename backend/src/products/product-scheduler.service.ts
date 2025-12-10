import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductSchedulerService {
  private readonly logger = new Logger(ProductSchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Run every minute to check for products that need to be published or unpublished
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledProducts() {
    const now = new Date();
    
    try {
      // Find products that should be published
      // @ts-ignore - Prisma types will be updated after restart
      const productsToPublish = await this.prisma.product.findMany({
        where: {
          scheduledPublishDate: {
            lte: now, // Less than or equal to current time
            not: null,
          },
          status: 'DRAFT', // Only publish draft products
        },
      });

      // Publish products
      if (productsToPublish.length > 0) {
        const publishedIds = productsToPublish.map(p => p.id);
        // @ts-ignore - Prisma types will be updated after restart
        await this.prisma.product.updateMany({
          where: {
            id: { in: publishedIds },
          },
          data: {
            status: 'ACTIVE',
            scheduledPublishDate: null, // Clear scheduled date after publishing
          },
        });
        
        this.logger.log(`Published ${productsToPublish.length} scheduled products`);
      }

      // Find products that should be unpublished
      // @ts-ignore - Prisma types will be updated after restart
      const productsToUnpublish = await this.prisma.product.findMany({
        where: {
          scheduledUnpublishDate: {
            lte: now,
            not: null,
          },
          status: 'ACTIVE', // Only unpublish active products
        },
      });

      // Unpublish products
      if (productsToUnpublish.length > 0) {
        const unpublishedIds = productsToUnpublish.map(p => p.id);
        // @ts-ignore - Prisma types will be updated after restart
        await this.prisma.product.updateMany({
          where: {
            id: { in: unpublishedIds },
          },
          data: {
            status: 'ARCHIVED',
            scheduledUnpublishDate: null, // Clear scheduled date after unpublishing
          },
        });
        
        this.logger.log(`Unpublished ${productsToUnpublish.length} scheduled products`);
      }
    } catch (error) {
      this.logger.error('Error handling scheduled products:', error);
    }
  }

  /**
   * Manually trigger the scheduler (useful for testing)
   */
  async triggerScheduler() {
    this.logger.log('Manually triggering product scheduler...');
    await this.handleScheduledProducts();
  }
}
