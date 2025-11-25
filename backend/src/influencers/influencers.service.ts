import { Injectable, NotFoundException } from '@nestjs/common';
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
}
