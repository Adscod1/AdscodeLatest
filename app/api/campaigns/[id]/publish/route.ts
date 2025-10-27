import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { publishCampaignSchema } from "@/lib/validations/campaign";
import { headers } from "next/headers";

// POST /api/campaigns/[id]/publish - Publish a draft campaign
export async function POST(
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

    const { id } = params;

    // Check if campaign exists and is owned by user
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (existingCampaign.brandId !== store?.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Only allow publishing draft campaigns
    if (existingCampaign.status !== "DRAFT") {
      return NextResponse.json(
        { success: false, error: "Campaign is already published or cannot be published" },
        { status: 400 }
      );
    }

    // Validate campaign data is complete for publishing
    const validationResult = publishCampaignSchema.safeParse(existingCampaign);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Campaign is incomplete. Please fill in all required fields before publishing.", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Publish campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        campaign,
        message: "Campaign published successfully! Influencers can now discover and apply." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error publishing campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish campaign" },
      { status: 500 }
    );
  }
}
