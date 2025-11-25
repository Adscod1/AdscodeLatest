import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { InfluencersModule } from './influencers/influencers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
  ],
})
export class AppModule {}
