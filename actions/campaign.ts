"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createCampaignSchema,
  updateCampaignSchema,
  validateTypeSpecificData,
} from "@/lib/validations/campaign";
import { CampaignType, TypeSpecificData } from "@/types/campaign";
import { revalidatePath } from "next/cache";

export type CreateCampaignActionInput = {
  title: string;
  description?: string;
  budget: number;
  currency: string;
  duration?: number;
  influencerLocation?: {
    country: string;
    city: string;
  };
  platforms?: string[]; // optional: UI no longer enforces platform selection
  targets: {
    awareness?: string[];
    advocacy?: string[];
    conversions?: string[];
    contentType?: string[];
  };
  type?: CampaignType;
  typeSpecificData?: TypeSpecificData;
};

export type UpdateCampaignActionInput = Partial<CreateCampaignActionInput> & {
  id: string;
};

/**
 * Creates a new draft campaign
 * @param data - Campaign creation data
 * @returns Created campaign or error
 */
export const createCampaign = async (data: CreateCampaignActionInput) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/auth/login");
    }

    // Get user's store (brand)
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return {
        success: false,
        error: "You must have a store to create campaigns",
      };
    }

    // Validate input data
    const validationResult = createCampaignSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      };
    }

    const validatedData = validationResult.data;

    // Validate type-specific data if provided
    if (validatedData.typeSpecificData && validatedData.type) {
      const typeValidation = validateTypeSpecificData(
        validatedData.type,
        validatedData.typeSpecificData
      );

      if (!typeValidation.success) {
        return {
          success: false,
          error: "Type-specific validation failed",
          details: typeValidation.error.errors,
        };
      }
    }

    // If productId is provided, verify product exists and belongs to brand
    if (validatedData.type === "PRODUCT" && validatedData.typeSpecificData) {
      const productData = validatedData.typeSpecificData as any;
      if (productData.productId) {
        const product = await prisma.product.findFirst({
          where: {
            id: productData.productId,
            storeId: store.id,
          },
        });

        if (!product) {
          return {
            success: false,
            error: "Product not found or doesn't belong to your store",
          };
        }
      }
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        brandId: store.id,
        title: validatedData.title,
        description: validatedData.description,
        budget: validatedData.budget,
        currency: validatedData.currency,
        duration: validatedData.duration,
        influencerLocation: validatedData.influencerLocation as any,
        platforms: validatedData.platforms ? validatedData.platforms as any : [],
        targets: validatedData.targets as any,
        type: validatedData.type,
        typeSpecificData: validatedData.typeSpecificData,
        status: "DRAFT",
      } as any,
    });

    // Revalidate campaigns page
    revalidatePath("/campaigns");

    return {
      success: true,
      campaign,
      message: "Campaign created successfully",
    };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create campaign",
    };
  }
};

/**
 * Gets all campaigns for the authenticated brand
 * @param options - Query options (status filter, pagination)
 * @returns List of campaigns or error
 */
export const getCampaigns = async (options?: {
  status?: string;
  type?: CampaignType;
  page?: number;
  limit?: number;
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/auth/login");
    }

    // Get user's store (brand)
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return {
        success: false,
        error: "Store not found",
      };
    }

    // Build query
    const where: any = { brandId: store.id };
    if (options?.status) {
      where.status = options.status;
    }
    if (options?.type) {
      where.type = options.type;
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
      ...(options?.page && options?.limit
        ? {
            skip: (options.page - 1) * options.limit,
            take: options.limit,
          }
        : {}),
    });

    return {
      success: true,
      campaigns,
    };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch campaigns",
    };
  }
};

/**
 * Gets a single campaign by ID
 * @param id - Campaign ID
 * @returns Campaign details or error
 */
export const getCampaignById = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/auth/login");
    }

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
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    // Check if user owns this campaign
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (campaign.brandId !== store?.id) {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    return {
      success: true,
      campaign,
    };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch campaign",
    };
  }
};

/**
 * Updates a draft campaign
 * @param data - Campaign update data with ID
 * @returns Updated campaign or error
 */
export const updateCampaign = async (data: UpdateCampaignActionInput) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/auth/login");
    }

    const { id, ...updateData } = data;

    // Check if campaign exists and is owned by user
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    // Check ownership
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (existingCampaign.brandId !== store?.id) {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    // Only allow editing draft campaigns
    if (existingCampaign.status !== "DRAFT") {
      return {
        success: false,
        error: "Only draft campaigns can be edited",
      };
    }

    // Validate update data
    const validationResult = updateCampaignSchema.safeParse(updateData);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      };
    }

    const validatedData = validationResult.data;

    // Validate type-specific data if provided
    if (validatedData.typeSpecificData) {
      const campaignType = (validatedData.type || (existingCampaign as any).type) as CampaignType;
      const typeValidation = validateTypeSpecificData(
        campaignType,
        validatedData.typeSpecificData
      );

      if (!typeValidation.success) {
        return {
          success: false,
          error: "Type-specific validation failed",
          details: typeValidation.error.errors,
        };
      }
    }

    // If updating to PRODUCT type with productId, verify product
    if (validatedData.typeSpecificData) {
      const campaignType = (validatedData.type || (existingCampaign as any).type) as CampaignType;
      if (campaignType === "PRODUCT") {
        const productData = validatedData.typeSpecificData as any;
        if (productData.productId) {
          const product = await prisma.product.findFirst({
            where: {
              id: productData.productId,
              storeId: store!.id,
            },
          });

          if (!product) {
            return {
              success: false,
              error: "Product not found or doesn't belong to your store",
            };
          }
        }
      }
    }

    // Merge typeSpecificData with existing data for partial updates
    let finalTypeSpecificData = validatedData.typeSpecificData;
    if (validatedData.typeSpecificData && (existingCampaign as any).typeSpecificData) {
      finalTypeSpecificData = {
        ...((existingCampaign as any).typeSpecificData as object),
        ...validatedData.typeSpecificData,
      };
    }

    // Update campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.budget && { budget: validatedData.budget }),
        ...(validatedData.currency && { currency: validatedData.currency }),
        ...(validatedData.duration !== undefined && {
          duration: validatedData.duration,
        }),
        ...(validatedData.influencerLocation && {
          influencerLocation: validatedData.influencerLocation as any,
        }),
        ...(validatedData.platforms && {
          platforms: validatedData.platforms as any,
        }),
        ...(validatedData.targets && { targets: validatedData.targets as any }),
        ...(validatedData.type && { type: validatedData.type }),
        ...(finalTypeSpecificData && { typeSpecificData: finalTypeSpecificData }),
      } as any,
    });

    // Revalidate campaigns page
    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${id}`);

    return {
      success: true,
      campaign,
      message: "Campaign updated successfully",
    };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update campaign",
    };
  }
};

/**
 * Deletes a draft campaign
 * @param id - Campaign ID
 * @returns Success status or error
 */
export const deleteCampaign = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/auth/login");
    }

    // Check if campaign exists and is owned by user
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    // Check ownership
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (existingCampaign.brandId !== store?.id) {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    // Only allow deleting draft campaigns
    if (existingCampaign.status !== "DRAFT") {
      return {
        success: false,
        error: "Only draft campaigns can be deleted",
      };
    }

    // Delete campaign
    await prisma.campaign.delete({
      where: { id },
    });

    // Revalidate campaigns page
    revalidatePath("/campaigns");

    return {
      success: true,
      message: "Campaign deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete campaign",
    };
  }
};

/**
 * Publishes a draft campaign
 * @param id - Campaign ID
 * @returns Published campaign or error
 */
export const publishCampaign = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/auth/login");
    }

    // Check if campaign exists and is owned by user
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    // Check ownership
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (existingCampaign.brandId !== store?.id) {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    // Only allow publishing draft campaigns
    if (existingCampaign.status !== "DRAFT") {
      return {
        success: false,
        error: "Only draft campaigns can be published",
      };
    }

    // Validate campaign has all required data
    if (!existingCampaign.title || !existingCampaign.budget) {
      return {
        success: false,
        error: "Campaign is missing required fields",
      };
    }

    // Publish campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      },
    });

    // Revalidate campaigns pages
    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${id}`);
    revalidatePath("/influencer/campaigns"); // For influencers to see new campaigns

    return {
      success: true,
      campaign,
      message: "Campaign published successfully",
    };
  } catch (error) {
    console.error("Error publishing campaign:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish campaign",
    };
  }
};
