import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if the user has influencer status
    // This is a placeholder - you can implement your actual logic here
    // For now, we'll return false and you can customize this logic
    const isInfluencer = false;

    return NextResponse.json({
      isInfluencer,
      userId: session.user.id,
    });
  } catch (error) {
    console.error("Error checking influencer status:", error);
    return NextResponse.json(
      { error: "Failed to check influencer status" },
      { status: 500 }
    );
  }
}
