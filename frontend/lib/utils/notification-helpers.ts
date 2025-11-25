import { prisma } from "@/lib/prisma";

export type NotificationType = 
  | "CAMPAIGN_SELECTION"
  | "APPLICATION_UPDATE"
  | "SYSTEM";

/**
 * Create a notification for a user
 * @param userId - The ID of the user to notify
 * @param type - The type of notification
 * @param message - The notification message
 * @param link - Optional link to navigate to when notification is clicked
 * @returns The created notification
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string,
  link?: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        link: link || null,
        read: false,
      },
    });

    return { success: true, notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

/**
 * Get unread notification count for a user
 * @param userId - The ID of the user
 * @returns The count of unread notifications
 */
export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    return { success: false, count: 0 };
  }
}

/**
 * Mark a notification as read
 * @param notificationId - The ID of the notification
 * @param userId - The ID of the user (for authorization)
 * @returns The updated notification
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
) {
  try {
    // Verify the notification belongs to the user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return { success: true, notification: updatedNotification };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read for a user
 * @param userId - The ID of the user
 * @returns The number of notifications updated
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to mark notifications as read" };
  }
}

/**
 * Get notifications for a user
 * @param userId - The ID of the user
 * @param limit - Maximum number of notifications to return (default: 20)
 * @param unreadOnly - If true, only return unread notifications
 * @returns Array of notifications
 */
export async function getUserNotifications(
  userId: string,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return { success: false, notifications: [] };
  }
}
