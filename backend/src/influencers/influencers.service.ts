import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInfluencerDto } from './dto/register-influencer.dto';
import { SocialPlatform } from '@prisma/client';

@Injectable()
export class InfluencersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get list of all approved and pending influencers with their social accounts
   */
  async findAll() {
    const influencers = await this.prisma.influencer.findMany({
      where: {
        status: {
          in: ['APPROVED', 'PENDING'],
        },
      },
      include: {
        socialAccounts: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend expectations
    return influencers.map((influencer) => {
      // Calculate total followers across all platforms
      const totalFollowers = influencer.socialAccounts.reduce(
        (sum, account) => sum + (parseInt(account.followers || '0', 10)),
        0
      );

      // Mock engagement rate (in real app, calculate from actual metrics)
      const engagementRate = Math.random() * 10; // 0-10%

      // Build social links object
      const socialLinks: Record<string, string> = {};
      influencer.socialAccounts.forEach((account) => {
        if (account.url) {
          socialLinks[account.platform.toLowerCase()] = account.url;
        }
      });

      // Combine city and country for location
      const locationParts = [influencer.city, influencer.country].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(', ') : null;

      return {
        id: influencer.id,
        firstName: influencer.firstName,
        lastName: influencer.lastName,
        bio: influencer.bio,
        primaryNiche: influencer.primaryNiche,
        location,
        status: influencer.status,
        totalFollowers,
        engagementRate: Number(engagementRate.toFixed(2)),
        profilePicture: influencer.user?.image || null,
        socialLinks,
        socialAccounts: influencer.socialAccounts.map((account) => ({
          platform: account.platform,
          handle: account.handle,
          followerCount: parseInt(account.followers || '0', 10),
          profileUrl: account.url,
        })),
        createdAt: influencer.createdAt,
        updatedAt: influencer.updatedAt,
      };
    });
  }

  /**
   * Get a single influencer by ID
   */
  async findById(id: string) {
    const influencer = await this.prisma.influencer.findUnique({
      where: { id },
      include: {
        socialAccounts: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!influencer) {
      throw new NotFoundException('Influencer not found');
    }

    // Calculate total followers across all platforms
    const totalFollowers = influencer.socialAccounts.reduce(
      (sum, account) => sum + (parseInt(account.followers || '0', 10)),
      0
    );

    // Mock engagement rate (in real app, calculate from actual metrics)
    const engagementRate = Math.random() * 10; // 0-10%

    // Build social links object
    const socialLinks: Record<string, string> = {};
    influencer.socialAccounts.forEach((account) => {
      if (account.url) {
        socialLinks[account.platform.toLowerCase()] = account.url;
      }
    });

    // Combine city and country for location
    const locationParts = [influencer.city, influencer.country].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(', ') : null;

    return {
      id: influencer.id,
      userId: influencer.userId,
      firstName: influencer.firstName,
      lastName: influencer.lastName,
      bio: influencer.bio,
      primaryNiche: influencer.primaryNiche,
      location,
      status: influencer.status,
      totalFollowers,
      engagementRate: Number(engagementRate.toFixed(2)),
      profilePicture: influencer.user?.image || null,
      email: influencer.user?.email || null,
      socialLinks,
      socialAccounts: influencer.socialAccounts.map((account) => ({
        platform: account.platform,
        handle: account.handle,
        followerCount: parseInt(account.followers || '0', 10),
        profileUrl: account.url,
      })),
      createdAt: influencer.createdAt,
      updatedAt: influencer.updatedAt,
    };
  }

  /**
   * Register a new influencer profile
   */
  async register(userId: string, dto: RegisterInfluencerDto) {
    // Create influencer with social accounts in a transaction
    const influencer = await this.prisma.$transaction(async (tx) => {
      // Create the influencer profile with status APPROVED
      const newInfluencer = await tx.influencer.create({
        data: {
          userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          bio: dto.bio || null,
          primaryNiche: dto.primaryNiche,
          city: dto.location || null,
          status: 'APPROVED',
          socialAccounts: {
            create: dto.socialAccounts.map((account) => ({
              platform: account.platform,
              handle: account.handle,
              followers: account.followerCount.toString(),
              url: account.profileUrl || null,
            })),
          },
        },
        include: {
          socialAccounts: true,
        },
      });

      // Update the user's profile role to INFLUENCER
      await tx.profile.upsert({
        where: { userId },
        update: {
          role: 'INFLUENCER',
        },
        create: {
          userId,
          role: 'INFLUENCER',
        },
      });

      return newInfluencer;
    });

    return {
      success: true,
      message: 'Influencer profile created successfully',
      influencer,
    };
  }

  /**
   * Delete influencer profile and reset user role
   */
  async reset(userId: string) {
    await this.prisma.$transaction(async (tx) => {
      // Delete the influencer profile (will cascade to social accounts)
      const deleteResult = await tx.influencer.deleteMany({
        where: { userId },
      });

      if (deleteResult.count === 0) {
        throw new NotFoundException('Influencer profile not found');
      }

      // Reset the user's profile role to USER
      await tx.profile.update({
        where: { userId },
        data: {
          role: 'USER',
        },
      });
    });

    return {
      success: true,
      message: 'Influencer profile deleted successfully',
    };
  }

  /**
   * Check if user has influencer status
   */
  async checkStatus(userId: string) {
    const influencer = await this.prisma.influencer.findUnique({
      where: { userId },
      select: { id: true, status: true },
    });

    return {
      isInfluencer: influencer !== null,
      status: influencer?.status || null,
    };
  }

  /**
   * Get current influencer profile with all details
   */
  async getCurrentInfluencer(userId: string) {
    const influencer = await this.prisma.influencer.findUnique({
      where: { userId },
      include: {
        socialAccounts: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!influencer) {
      return null;
    }

    // Parse secondary niches from JSON string
    return {
      ...influencer,
      secondaryNiches: influencer.secondaryNiches
        ? JSON.parse(influencer.secondaryNiches)
        : [],
    };
  }

  /**
   * Get influencer stats
   */
  async getInfluencerStats(userId: string) {
    const influencer = await this.prisma.influencer.findUnique({
      where: { userId },
      include: {
        socialAccounts: true,
      },
    });

    if (!influencer) {
      return null;
    }

    // Calculate total followers across platforms
    const totalFollowers = influencer.socialAccounts.reduce(
      (total: number, account) => {
        if (!account.followers) return total;

        // Parse follower count (assuming format like "10K - 50K")
        const followerRange = account.followers;
        const numbers = followerRange.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const multiplier = followerRange.includes('K')
            ? 1000
            : followerRange.includes('M')
              ? 1000000
              : 1;
          return total + parseInt(numbers[0]) * multiplier;
        }
        return total;
      },
      0,
    );

    return {
      totalFollowers,
      socialPlatforms: influencer.socialAccounts.length,
      status: influencer.status,
      joinDate: influencer.createdAt,
      primaryNiche: influencer.primaryNiche,
    };
  }

  /**
   * Apply for a campaign as an influencer
   */
  async applyCampaign(userId: string, campaignId: string) {
    // Get influencer profile
    const influencer = await this.prisma.influencer.findUnique({
      where: { userId },
    });

    if (!influencer) {
      throw new BadRequestException(
        'You must complete your influencer profile to apply for campaigns',
      );
    }

    // Check if influencer is approved
    if (influencer.status !== 'APPROVED') {
      throw new BadRequestException(
        'Your influencer profile must be approved before applying to campaigns',
      );
    }

    // Check if campaign exists and is published
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== 'PUBLISHED') {
      throw new BadRequestException('This campaign is not accepting applications');
    }

    // Check if already applied
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
      },
    });

    return {
      success: true,
      application,
      message: 'Successfully applied to campaign',
    };
  }

  /**
   * Check if influencer has applied to a campaign
   */
  async hasAppliedToCampaign(userId: string, campaignId: string) {
    const influencer = await this.prisma.influencer.findUnique({
      where: { userId },
    });

    if (!influencer) {
      return false;
    }

    const application = await this.prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId: influencer.id,
        },
      },
    });

    return !!application;
  }
}
