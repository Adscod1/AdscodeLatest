import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { updateCampaignSchema, validateTypeSpecificData } from "@/lib/validations/campaign";
import { headers } from "next/headers";

// GET /api/campaigns/[id] - Get campaign details
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

    const { id } = params;

    // Fetch campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id },
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
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Check if user owns this campaign
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (campaign.brandId !== store?.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, campaign },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

// PATCH /api/campaigns/[id] - Update a draft campaign
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

    // Only allow editing draft campaigns
    if (existingCampaign.status !== "DRAFT") {
      return NextResponse.json(
        { success: false, error: "Only draft campaigns can be edited" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = updateCampaignSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Prevent type changes on published campaigns (extra safety check)
    if (data.type && existingCampaign.status !== "DRAFT") {
      return NextResponse.json(
        { success: false, error: "Cannot change campaign type after publishing" },
        { status: 400 }
      );
    }

    // Validate type-specific data if provided
    if (data.typeSpecificData) {
      const campaignType = data.type || (existingCampaign.type as string);
      const typeValidation = validateTypeSpecificData(
        campaignType as "PRODUCT" | "COUPON" | "VIDEO" | "PROFILE",
        data.typeSpecificData
      );
      
      if (!typeValidation.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Type-specific validation failed", 
            details: typeValidation.error.errors 
          },
          { status: 400 }
        );
      }
    }

    // If updating to PRODUCT type with productId, verify product exists and belongs to brand
    if (data.typeSpecificData) {
      const campaignType = data.type || (existingCampaign.type as string);
      if (campaignType === "PRODUCT") {
        const productData = data.typeSpecificData as any;
        if (productData.productId) {
          const product = await prisma.product.findFirst({
            where: {
              id: productData.productId,
              storeId: store!.id,
            },
          });

          if (!product) {
            return NextResponse.json(
              { success: false, error: "Product not found or doesn't belong to your store" },
              { status: 404 }
            );
          }
        }
      }
    }

    // Merge typeSpecificData with existing data for partial updates
    let finalTypeSpecificData = data.typeSpecificData;
    if (data.typeSpecificData && existingCampaign.typeSpecificData) {
      finalTypeSpecificData = {
        ...(existingCampaign.typeSpecificData as object),
        ...data.typeSpecificData,
      };
    }

    // Update campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.budget && { budget: data.budget }),
        ...(data.currency && { currency: data.currency }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.influencerLocation && { influencerLocation: data.influencerLocation as any }),
        ...(data.platforms && { platforms: data.platforms as any }),
        ...(data.targets && { targets: data.targets as any }),
        ...(data.type && { type: data.type }),
        ...(finalTypeSpecificData && { typeSpecificData: finalTypeSpecificData }),
      } as any,
    });

    return NextResponse.json(
      { 
        success: true, 
        campaign,
        message: "Campaign updated successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
