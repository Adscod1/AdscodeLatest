import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthTestController } from './auth-test.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController, AuthTestController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
