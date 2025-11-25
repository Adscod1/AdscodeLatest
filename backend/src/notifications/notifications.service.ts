import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, NotificationQueryDto } from './dto/notification.dto';

export type NotificationType = 'CAMPAIGN_SELECTION' | 'APPLICATION_UPDATE' | 'SYSTEM';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a notification for a user
   */
  async create(data: CreateNotificationDto) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          message: data.message,
          link: data.link || null,
          read: false,
        },
      });

      return notification;
    } catch (error) {
      throw new BadRequestException('Failed to create notification');
    }
  }

  /**
   * Get notifications for a user
   */
  async findByUser(userId: string, query: NotificationQueryDto) {
    const { limit = 20, unreadOnly = false } = query;

    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return notifications;
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return count;
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    // Verify the notification belongs to the user
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return updatedNotification;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return { count: result.count };
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string, userId: string) {
    // Verify the notification belongs to the user
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true, message: 'Notification deleted' };
  }
}
