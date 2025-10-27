import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// POST /api/campaigns/[id]/applicants/[influencerId]/select - Select an influencer for the campaign
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; influencerId: string } }
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

    const { id: campaignId, influencerId } = params;

    // Get campaign and verify ownership
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
        brandId: true,
        brand: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Verify that the user owns this campaign's brand
    if (campaign.brand.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to select influencers for this campaign" },
        { status: 403 }
      );
    }

    // Get the influencer to get their userId for notification
    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!influencer) {
      return NextResponse.json(
        { success: false, error: "Influencer not found" },
        { status: 404 }
      );
    }

    // Check if application exists
    const application = await prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId,
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if already selected
    if (application.applicationStatus === "SELECTED") {
      return NextResponse.json(
        { success: false, error: "This influencer is already selected" },
        { status: 400 }
      );
    }

    // Update the application status to SELECTED and set selectedAt timestamp
    const updatedApplication = await prisma.campaignInfluencer.update({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId,
        },
      },
      data: {
        applicationStatus: "SELECTED",
        selectedAt: new Date(),
      },
    });

    // Create a notification for the influencer
    await prisma.notification.create({
      data: {
        userId: influencer.userId,
        type: "CAMPAIGN_SELECTION",
        message: `You've been selected for "${campaign.title}"!`,
        link: "/influencer/campaigns",
        read: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        application: updatedApplication,
        message: "Influencer selected successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error selecting influencer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to select influencer" },
      { status: 500 }
    );
  }
}
