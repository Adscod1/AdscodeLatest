import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { createCampaignSchema } from "@/lib/validations/campaign";
import { headers } from "next/headers";

// POST /api/campaigns - Create a new draft campaign
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

    // Get user's store (brand)
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: "You must have a store to create campaigns" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = createCampaignSchema.safeParse(body);

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

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        brandId: store.id,
        title: data.title,
        description: data.description,
        budget: data.budget,
        currency: data.currency,
        duration: data.duration,
        influencerLocation: data.influencerLocation as any,
        platforms: data.platforms as any,
        targets: data.targets as any,
        status: "DRAFT",
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        campaign,
        message: "Campaign created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

// GET /api/campaigns - List all campaigns for the authenticated brand
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

    // Get user's store (brand)
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: "Store not found" },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Build query
    const where: any = { brandId: store.id };
    if (status) {
      where.status = status;
    }

    // Fetch campaigns with applicant count
    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        _count: {
          select: { applicants: true },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
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
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
