import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { markNotificationAsRead } from "@/lib/utils/notification-helpers";

// PATCH /api/notifications/[id]/read - Mark a notification as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: notificationId } = params;

    const result = await markNotificationAsRead(notificationId, session.user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to mark notification as read" },
        { status: result.error === "Notification not found" ? 404 : 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        notification: result.notification,
        message: "Notification marked as read",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
