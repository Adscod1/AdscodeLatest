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
