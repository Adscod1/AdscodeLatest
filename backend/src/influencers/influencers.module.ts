import { Module } from '@nestjs/common';
import { InfluencersController } from './influencers.controller';
import { InfluencerStatusController } from './influencer-status.controller';
import { InfluencersService } from './influencers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InfluencersController, InfluencerStatusController],
  providers: [InfluencersService],
  exports: [InfluencersService],
})
export class InfluencersModule {}
