import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, CampaignQueryDto, UpdateCampaignDto, ProductsQueryDto } from './dto/campaign.dto';
import { CampaignStatus, CampaignType } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user's store (brand) by userId
   */
  private async getUserStore(userId: string) {
    const store = await this.prisma.store.findFirst({
      where: { userId },
    });
    return store;
  }

  /**
   * List all campaigns for the authenticated brand
   */
  async findAll(userId: string, query: CampaignQueryDto) {
    // Get user's store
    const store = await this.getUserStore(userId);
    if (!store) {
      throw new NotFoundException('Store not found. You must have a store to view campaigns.');
    }

    // Build where clause
    const where: any = { brandId: store.id };
    if (query.status) {
      where.status = query.status;
    }
    if (query.type) {
      where.type = query.type;
    }

    // Fetch campaigns with applicant count and brand info
    const campaigns = await this.prisma.campaign.findMany({
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
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      campaigns,
    };
  }

  /**
   * Create a new draft campaign
   */
  async create(userId: string, dto: CreateCampaignDto) {
    // Get user's store
    const store = await this.getUserStore(userId);
    if (!store) {
      throw new ForbiddenException('You must have a store to create campaigns');
    }

    // If productId is provided, verify product exists and belongs to brand
    if (dto.type === CampaignType.PRODUCT && dto.typeSpecificData) {
      const productData = dto.typeSpecificData as any;
      if (productData.productId) {
        const product = await this.prisma.product.findFirst({
          where: {
            id: productData.productId,
            storeId: store.id,
          },
        });

        if (!product) {
          throw new NotFoundException("Product not found or doesn't belong to your store");
        }
      }
    }

    // Create campaign
    const campaign = await this.prisma.campaign.create({
      data: {
        brandId: store.id,
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        currency: dto.currency || 'UGX',
        duration: dto.duration,
        influencerLocation: dto.influencerLocation as any,
        platforms: dto.platforms as any,
        targets: dto.targets as any,
        type: dto.type || CampaignType.PRODUCT,
        typeSpecificData: dto.typeSpecificData,
        status: CampaignStatus.DRAFT,
      },
    });

    return {
      success: true,
      campaign,
      message: 'Campaign created successfully',
    };
  }

  /**
   * Get a single campaign by ID
   */
  async findOne(userId: string, campaignId: string) {
    // Fetch campaign with brand info and applicant count
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
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
      throw new NotFoundException('Campaign not found');
    }

    // Check if user owns this campaign
    const store = await this.getUserStore(userId);
    if (campaign.brandId !== store?.id) {
      throw new ForbiddenException('You do not have access to this campaign');
    }

    return {
      success: true,
      campaign,
    };
  }

  /**
   * Update a draft campaign
   */
  async update(userId: string, campaignId: string, dto: UpdateCampaignDto) {
    // Check if campaign exists
    const existingCampaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check ownership
    const store = await this.getUserStore(userId);
    if (existingCampaign.brandId !== store?.id) {
      throw new ForbiddenException('You do not have access to this campaign');
    }

    // Only allow editing draft campaigns
    if (existingCampaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Only draft campaigns can be edited');
    }

    // If productId is provided, verify product exists and belongs to brand
    if (dto.typeSpecificData) {
      const campaignType = dto.type || existingCampaign.type;
      if (campaignType === CampaignType.PRODUCT) {
        const productData = dto.typeSpecificData as any;
        if (productData.productId) {
          const product = await this.prisma.product.findFirst({
            where: {
              id: productData.productId,
              storeId: store!.id,
            },
          });

          if (!product) {
            throw new NotFoundException("Product not found or doesn't belong to your store");
          }
        }
      }
    }

    // Merge typeSpecificData with existing data for partial updates
    let finalTypeSpecificData = dto.typeSpecificData;
    if (dto.typeSpecificData && existingCampaign.typeSpecificData) {
      finalTypeSpecificData = {
        ...(existingCampaign.typeSpecificData as object),
        ...dto.typeSpecificData,
      };
    }

    // Update campaign
    const campaign = await this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.budget && { budget: dto.budget }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.influencerLocation && { influencerLocation: dto.influencerLocation as any }),
        ...(dto.platforms && { platforms: dto.platforms as any }),
        ...(dto.targets && { targets: dto.targets as any }),
        ...(dto.type && { type: dto.type }),
        ...(finalTypeSpecificData && { typeSpecificData: finalTypeSpecificData }),
      },
    });

    return {
      success: true,
      campaign,
      message: 'Campaign updated successfully',
    };
  }

  /**
   * Publish a draft campaign
   */
  async publish(userId: string, campaignId: string) {
    // Check if campaign exists
    const existingCampaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check ownership
    const store = await this.getUserStore(userId);
    if (existingCampaign.brandId !== store?.id) {
      throw new ForbiddenException('You do not have access to this campaign');
    }

    // Only allow publishing draft campaigns
    if (existingCampaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Campaign is already published or cannot be published');
    }

    // Validate campaign has all required data
    if (!existingCampaign.title || !existingCampaign.budget) {
      throw new BadRequestException('Campaign is missing required fields');
    }

    // Publish campaign
    const campaign = await this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.PUBLISHED,
      },
    });

    return {
      success: true,
      campaign,
      message: 'Campaign published successfully! Influencers can now discover and apply.',
    };
  }

  /**
   * Apply to a campaign (for influencers)
   */
  async apply(userId: string, campaignId: string) {
    // Get influencer record for the authenticated user
    const influencer = await this.prisma.influencer.findFirst({
      where: { userId },
      select: { id: true, status: true },
    });

    if (!influencer) {
      throw new NotFoundException('Influencer profile not found');
    }

    // Check if influencer is approved
    if (influencer.status !== 'APPROVED') {
      throw new ForbiddenException('Only approved influencers can apply to campaigns');
    }

    // Check if campaign exists and is published
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, status: true, title: true },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== CampaignStatus.PUBLISHED) {
      throw new BadRequestException('This campaign is not accepting applications');
    }

    // Check for duplicate application
    const existingApplication = await this.prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId: influencer.id,
        },
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this campaign');
    }

    // Create application
    const application = await this.prisma.campaignInfluencer.create({
      data: {
        campaignId,
        influencerId: influencer.id,
        applicationStatus: 'APPLIED',
        appliedAt: new Date(),
      },
    });

    return {
      success: true,
      application,
      message: 'Application submitted successfully',
    };
  }

  /**
   * Get all applicants for a campaign (for brand owners)
   */
  async getApplicants(userId: string, campaignId: string) {
    // Get campaign and verify ownership
    const campaign = await this.prisma.campaign.findUnique({
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
      throw new NotFoundException('Campaign not found');
    }

    // Verify that the user owns this campaign's brand
    if (campaign.brand.userId !== userId) {
      throw new ForbiddenException("You don't have permission to view these applicants");
    }

    // Fetch all applicants with their details
    const applicants = await this.prisma.campaignInfluencer.findMany({
      where: { campaignId },
      include: {
        influencer: {
          include: {
            socialAccounts: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    // Transform the data for easier frontend consumption
    const transformedApplicants = applicants.map((applicant) => ({
      id: applicant.id,
      applicationStatus: applicant.applicationStatus,
      appliedAt: applicant.appliedAt,
      selectedAt: applicant.selectedAt,
      influencer: {
        id: applicant.influencer.id,
        userId: applicant.influencer.userId,
        fullName: `${applicant.influencer.firstName} ${applicant.influencer.lastName}`,
        profilePicture: null,
        bio: applicant.influencer.bio,
        primaryNiche: applicant.influencer.primaryNiche,
        status: applicant.influencer.status,
        socials: applicant.influencer.socialAccounts.map((social) => ({
          platform: social.platform,
          username: social.handle,
          followersCount: parseInt(social.followers || '0'),
          isVerified: false,
        })),
        totalFollowers: applicant.influencer.socialAccounts.reduce(
          (sum: number, social) => sum + parseInt(social.followers || '0'),
          0
        ),
      },
    }));

    return {
      success: true,
      campaign: {
        id: campaign.id,
        title: campaign.title,
      },
      applicants: transformedApplicants,
      totalApplicants: transformedApplicants.length,
    };
  }

  /**
   * Select an influencer for a campaign
   */
  async selectInfluencer(userId: string, campaignId: string, influencerId: string) {
    // Get campaign and verify ownership
    const campaign = await this.prisma.campaign.findUnique({
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
      throw new NotFoundException('Campaign not found');
    }

    // Verify that the user owns this campaign's brand
    if (campaign.brand.userId !== userId) {
      throw new ForbiddenException("You don't have permission to select influencers for this campaign");
    }

    // Get the influencer to get their userId for notification
    const influencer = await this.prisma.influencer.findUnique({
      where: { id: influencerId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }

    // Check if application exists
    const application = await this.prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId,
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check if already selected
    if (application.applicationStatus === 'SELECTED') {
      throw new BadRequestException('This influencer is already selected');
    }

    // Update the application status to SELECTED and set selectedAt timestamp
    const updatedApplication = await this.prisma.campaignInfluencer.update({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId,
        },
      },
      data: {
        applicationStatus: 'SELECTED',
        selectedAt: new Date(),
      },
    });

    // Create a notification for the influencer
    await this.prisma.notification.create({
      data: {
        userId: influencer.userId,
        type: 'CAMPAIGN_SELECTION',
        message: `You've been selected for "${campaign.title}"!`,
        link: '/influencer/campaigns',
        read: false,
      },
    });

    return {
      success: true,
      application: updatedApplication,
      message: 'Influencer selected successfully',
    };
  }

  /**
   * Get available campaigns for influencers to browse
   */
  async getAvailable(userId: string) {
    // Get influencer record for the authenticated user
    const influencer = await this.prisma.influencer.findFirst({
      where: { userId },
      select: { id: true, status: true },
    });

    if (!influencer) {
      throw new NotFoundException('Influencer profile not found');
    }

    // Only approved influencers can view campaigns
    if (influencer.status !== 'APPROVED') {
      throw new ForbiddenException('Your influencer profile is pending approval');
    }

    // Get campaigns that the influencer has already applied to
    const appliedCampaignIds = await this.prisma.campaignInfluencer.findMany({
      where: { influencerId: influencer.id },
      select: { campaignId: true },
    });

    const appliedIds = appliedCampaignIds.map((ci) => ci.campaignId);

    // Fetch published campaigns excluding ones already applied to
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        status: CampaignStatus.PUBLISHED,
        id: {
          notIn: appliedIds.length > 0 ? appliedIds : undefined,
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
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      campaigns,
    };
  }

  /**
   * Get influencer's campaign applications
   */
  async getMyApplications(userId: string) {
    // Get influencer record for the authenticated user
    const influencer = await this.prisma.influencer.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!influencer) {
      throw new NotFoundException('Influencer profile not found');
    }

    // Fetch all applications with campaign details
    const applications = await this.prisma.campaignInfluencer.findMany({
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
        appliedAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    const campaigns = applications.map((app) => ({
      ...app.campaign,
      applicationStatus: app.applicationStatus,
      appliedAt: app.appliedAt,
      selectedAt: app.selectedAt,
    }));

    return {
      success: true,
      campaigns,
    };
  }

  /**
   * Get products for campaign creation
   */
  async getProducts(userId: string, query: ProductsQueryDto) {
    // Get user's store (brand)
    const store = await this.getUserStore(userId);
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Calculate pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      storeId: store.id,
      status: query.status || 'ACTIVE',
    };

    // Add search filter if provided
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { category: { contains: query.search } },
        { tags: { contains: query.search } },
      ];
    }

    // Fetch products with images
    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          comparePrice: true,
          category: true,
          tags: true,
          status: true,
          views: true,
          images: {
            select: {
              id: true,
              url: true,
            },
            take: 1,
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Format products for campaign use
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      category: product.category,
      tags: product.tags,
      status: product.status,
      views: product.views,
      image: product.images[0]?.url || null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      success: true,
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * Delete a draft campaign
   */
  async delete(userId: string, campaignId: string) {
    // Check if campaign exists
    const existingCampaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check ownership
    const store = await this.getUserStore(userId);
    if (existingCampaign.brandId !== store?.id) {
      throw new ForbiddenException('You do not have access to this campaign');
    }

    // Only allow deleting draft campaigns
    if (existingCampaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Only draft campaigns can be deleted');
    }

    // Delete campaign
    await this.prisma.campaign.delete({
      where: { id: campaignId },
    });

    return {
      success: true,
      message: 'Campaign deleted successfully',
    };
  }
}
