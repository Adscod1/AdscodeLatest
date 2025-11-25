import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/campaigns/my-applications - Get influencer's campaign applications
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

    // Get influencer record for the authenticated user
    const influencer = await prisma.influencer.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!influencer) {
      return NextResponse.json(
        { success: false, error: "Influencer profile not found" },
        { status: 404 }
      );
    }

    // Fetch all applications with campaign details
    const applications = await prisma.campaignInfluencer.findMany({
      where: { influencerId: influencer.id },
      include: {
        campaign: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
            _count: {
              select: { applicants: true },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    // Transform the data to match the expected format
    const campaigns = applications.map((app) => ({
      ...app.campaign,
      applicationStatus: app.applicationStatus,
      appliedAt: app.appliedAt,
      selectedAt: app.selectedAt,
    }));

    return NextResponse.json(
      { success: true, campaigns },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
