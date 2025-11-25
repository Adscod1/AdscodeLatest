import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { getUserNotifications, markAllNotificationsAsRead } from "@/lib/utils/notification-helpers";

// GET /api/notifications - Get user's notifications
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const result = await getUserNotifications(session.user.id, limit, unreadOnly);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch notifications" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        notifications: result.notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Mark all notifications as read
export async function POST(req: NextRequest) {
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

    const result = await markAllNotificationsAsRead(session.user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to mark notifications as read" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "All notifications marked as read",
        count: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
