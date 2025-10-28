import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/campaigns/available - Get published campaigns for influencers
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
      select: { id: true, status: true },
    });

    if (!influencer) {
      return NextResponse.json(
        { success: false, error: "Influencer profile not found" },
        { status: 404 }
      );
    }

    // Only approved influencers can view campaigns
    if (influencer.status !== "APPROVED") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Your influencer profile is pending approval",
          status: influencer.status 
        },
        { status: 403 }
      );
    }

    // Get campaigns that the influencer has already applied to
    const appliedCampaignIds = await prisma.campaignInfluencer.findMany({
      where: { influencerId: influencer.id },
      select: { campaignId: true },
    });

    const appliedIds = appliedCampaignIds.map((ci) => ci.campaignId);

    // Fetch published campaigns excluding ones already applied to
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: "PUBLISHED",
        id: {
          notIn: appliedIds,
        },
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { success: true, campaigns },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching available campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
