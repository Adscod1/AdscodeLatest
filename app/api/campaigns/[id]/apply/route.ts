import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// POST /api/campaigns/[id]/apply - Apply to a campaign
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

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

    // Check if influencer is approved
    if (influencer.status !== "APPROVED") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Only approved influencers can apply to campaigns",
          status: influencer.status 
        },
        { status: 403 }
      );
    }

    // Check if campaign exists and is published
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, status: true, title: true },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (campaign.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "This campaign is not accepting applications" },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const existingApplication = await prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId: influencer.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: "You have already applied to this campaign" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.campaignInfluencer.create({
      data: {
        campaignId,
        influencerId: influencer.id,
        applicationStatus: "APPLIED",
        appliedAt: new Date(),
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        application,
        message: "Application submitted successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error applying to campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
