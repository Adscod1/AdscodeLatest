import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { InfluencersModule } from './influencers/influencers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StoresModule } from './stores/stores.module';
import { UploadModule } from './upload/upload.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Scheduler for cron jobs
    ScheduleModule.forRoot(),
    // Database
    PrismaModule,
    // Feature modules
    HealthModule,
    AuthModule,
    StoresModule,
    CampaignsModule,
    ProductsModule,
    ServicesModule,
    InfluencersModule,
    NotificationsModule,
    UploadModule,
    ProfilesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
