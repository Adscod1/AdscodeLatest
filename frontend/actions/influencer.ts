import { prisma } from '@/lib/prisma';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { Influencer, InfluencerSocial, InfluencerStatus } from '@/types/influencer';

export async function getCurrentInfluencer() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    // Prisma client has been properly typed with our model
    const influencer = await prisma.influencer.findUnique({
      where: { userId: session.user.id },
      include: {
        socialAccounts: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!influencer) {
      return null;
    }

    // Parse secondary niches from JSON string
    const parsedInfluencer = {
      ...influencer,
      secondaryNiches: influencer.secondaryNiches 
        ? JSON.parse(influencer.secondaryNiches)
        : []
    };

    return parsedInfluencer;
  } catch (error) {
    console.error('Error fetching influencer:', error);
    return null;
  }
}

export async function getInfluencerStats(userId: string) {
  try {
    // Using proper typing with our Prisma client
    const influencer = await prisma.influencer.findUnique({
      where: { userId },
      include: {
        socialAccounts: true
      }
    });

    if (!influencer) {
      return null;
    }

    // Calculate total followers across platforms
    const totalFollowers = influencer.socialAccounts.reduce((total: number, account) => {
      if (!account.followers) return total;
      
      // Parse follower count (assuming format like "10K - 50K")
      const followerRange = account.followers;
      const numbers = followerRange.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const multiplier = followerRange.includes('K') ? 1000 : 
                          followerRange.includes('M') ? 1000000 : 1;
        return total + (parseInt(numbers[0]) * multiplier);
      }
      return total;
    }, 0);

    return {
      totalFollowers,
      socialPlatforms: influencer.socialAccounts.length,
      status: influencer.status,
      joinDate: influencer.createdAt,
      primaryNiche: influencer.primaryNiche
    };
  } catch (error) {
    console.error('Error fetching influencer stats:', error);
    return null;
  }
}

/**
 * Apply for a campaign as an influencer
 */
export async function applyCampaign(campaignId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: 'You must be logged in to apply for campaigns',
      };
    }

    // Get influencer profile
    const influencer = await prisma.influencer.findUnique({
      where: { userId: session.user.id },
    });

    if (!influencer) {
      return {
        success: false,
        error: 'You must complete your influencer profile to apply for campaigns',
      };
    }

    // Check if influencer is approved
    if (influencer.status !== 'APPROVED') {
      return {
        success: false,
        error: 'Your influencer profile must be approved before applying to campaigns',
      };
    }

    // Check if campaign exists and is published
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return {
        success: false,
        error: 'Campaign not found',
      };
    }

    if (campaign.status !== 'PUBLISHED') {
      return {
        success: false,
        error: 'This campaign is not accepting applications',
      };
    }

    // Check if already applied
    const existingApplication = await prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId: influencer.id,
        },
      },
    });

    if (existingApplication) {
      return {
        success: false,
        error: 'You have already applied to this campaign',
      };
    }

    // Create application
    const application = await prisma.campaignInfluencer.create({
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
  } catch (error) {
    console.error('Error applying to campaign:', error);
    return {
      success: false,
      error: 'Failed to apply to campaign',
    };
  }
}

/**
 * Check if influencer has applied to a campaign
 */
export async function hasAppliedToCampaign(campaignId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return false;
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: session.user.id },
    });

    if (!influencer) {
      return false;
    }

    const application = await prisma.campaignInfluencer.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId,
          influencerId: influencer.id,
        },
      },
    });

    return !!application;
  } catch (error) {
    console.error('Error checking application status:', error);
    return false;
  }
}
