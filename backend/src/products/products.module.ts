import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsController, CommentsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSchedulerService } from './product-scheduler.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
    }),
  ],
  controllers: [ProductsController, CommentsController],
  providers: [ProductsService, ProductSchedulerService],
  exports: [ProductsService],
})
export class ProductsModule {}
