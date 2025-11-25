import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { CurrentUser, UserId } from '@/auth/decorators/auth.decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthTestController {
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns the current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCurrentUser(@CurrentUser() user: any) {
    return {
      success: true,
      user,
    };
  }

  @Get('session')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current session information' })
  @ApiResponse({ status: 200, description: 'Returns session info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSession(@CurrentUser() user: any, @UserId() userId: string) {
    return {
      success: true,
      userId,
      user,
      timestamp: new Date().toISOString(),
    };
  }
}
