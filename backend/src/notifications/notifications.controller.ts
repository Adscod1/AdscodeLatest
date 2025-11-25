import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationQueryDto, NotificationResponseDto } from './dto/notification.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserId } from '../auth/decorators/auth.decorators';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: [NotificationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@UserId() userId: string, @Query() query: NotificationQueryDto) {
    const notifications = await this.notificationsService.findByUser(userId, query);
    return {
      success: true,
      notifications,
    };
  }

  @Get('unread-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUnreadCount(@UserId() userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return {
      success: true,
      count,
    };
  }

  @Post('mark-all-read')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAllAsRead(@UserId() userId: string) {
    const result = await this.notificationsService.markAllAsRead(userId);
    return {
      success: true,
      message: 'All notifications marked as read',
      count: result.count,
    };
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@UserId() userId: string, @Param('id') id: string) {
    const notification = await this.notificationsService.markAsRead(id, userId);
    return {
      success: true,
      notification,
      message: 'Notification marked as read',
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async delete(@UserId() userId: string, @Param('id') id: string) {
    return this.notificationsService.delete(id, userId);
  }
}
