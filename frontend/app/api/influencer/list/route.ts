import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch approved influencers with their social accounts
    // Include all statuses except REJECTED and SUSPENDED for now
    const influencers = await prisma.influencer.findMany({
      where: {
        status: {
          in: ['APPROVED', 'PENDING']  // Include both APPROVED and PENDING
        }
      },
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the frontend expectations
    const formattedInfluencers = influencers.map((influencer) => {
      // Get the primary social account (Instagram preferred)
      const instagramAccount = influencer.socialAccounts.find(
        acc => acc.platform === 'INSTAGRAM'
      );
      const youtubeAccount = influencer.socialAccounts.find(
        acc => acc.platform === 'YOUTUBE'
      );
      const tiktokAccount = influencer.socialAccounts.find(
        acc => acc.platform === 'TIKTOK'
      );

      // Calculate engagement rate (mock calculation - in real scenario you'd have this data)
      const engagementRate = (Math.random() * 3 + 2).toFixed(1); // 2-5% range

      return {
        id: influencer.id,
        name: influencer.user?.name || `${influencer.firstName} ${influencer.lastName}`,
        handle: instagramAccount?.handle || `@${influencer.firstName.toLowerCase()}`,
        followers: instagramAccount?.followers || 'N/A',
        engagement: `${engagementRate}%`,
        category: influencer.primaryNiche,
        rating: (Math.random() * 0.5 + 4.5).toFixed(1),
        rate: influencer.ratePerPost || 'Contact for rate',
        location: influencer.city ? `${influencer.city}, ${influencer.country}` : 'N/A',
        icon: '⭐',
        email: influencer.user?.email,
        bio: influencer.bio,
        platforms: {
          instagram: instagramAccount?.url || '',
          youtube: youtubeAccount?.url || '',
          tiktok: tiktokAccount?.url || ''
        },
        userId: influencer.userId,
        image: influencer.user?.image
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedInfluencers,
      total: formattedInfluencers.length
    });
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch influencers'
      },
      { status: 500 }
    );
  }
}
