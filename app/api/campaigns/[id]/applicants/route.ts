import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/campaigns/[id]/applicants - Get all applicants for a campaign
export async function GET(
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

    const { id: campaignId } = params;

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
        { success: false, error: "You don't have permission to view these applicants" },
        { status: 403 }
      );
    }

    // Fetch all applicants with their details
    const applicants = await prisma.campaignInfluencer.findMany({
      where: {
        campaignId,
      },
      include: {
        influencer: {
          include: {
            socialAccounts: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });    // Transform the data for easier frontend consumption
    const transformedApplicants = applicants.map((applicant) => ({
      id: applicant.id,
      applicationStatus: applicant.applicationStatus,
      appliedAt: applicant.appliedAt,
      selectedAt: applicant.selectedAt,
      influencer: {
        id: applicant.influencer.id,
        userId: applicant.influencer.userId,
        fullName: `${applicant.influencer.firstName} ${applicant.influencer.lastName}`,
        profilePicture: null, // Add this field to Influencer model if needed
        bio: applicant.influencer.bio,
        primaryNiche: applicant.influencer.primaryNiche,
        status: applicant.influencer.status,
        socials: applicant.influencer.socialAccounts.map(social => ({
          platform: social.platform,
          username: social.handle,
          followersCount: parseInt(social.followers || "0"),
          isVerified: false, // Add this field to InfluencerSocial model if needed
        })),
        // Calculate total followers across all platforms
        totalFollowers: applicant.influencer.socialAccounts.reduce(
          (sum: number, social) => sum + parseInt(social.followers || "0"),
          0
        ),
      },
    }));

    return NextResponse.json(
      {
        success: true,
        campaign: {
          id: campaign.id,
          title: campaign.title,
        },
        applicants: transformedApplicants,
        totalApplicants: transformedApplicants.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching campaign applicants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
