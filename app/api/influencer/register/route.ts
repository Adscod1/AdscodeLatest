import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { SocialPlatform } from '@/types/influencer';

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      country,
      city,
      primaryNiche,
      secondaryNiches,
      bio,
      websiteUrl,
      ratePerPost,
      brandCollaborations,
      socialAccounts
    } = body;

    // Server-side validation
    if (!firstName || !lastName || !primaryNiche) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, and primaryNiche are required' },
        { status: 400 }
      );
    }

    if (!socialAccounts || !Array.isArray(socialAccounts) || socialAccounts.length === 0) {
      return NextResponse.json(
        { error: 'At least one social media account is required' },
        { status: 400 }
      );
    }

    // Validate that each social account has the required fields
    for (const account of socialAccounts) {
      if (!account.platform || !account.handle || !account.followers) {
        return NextResponse.json(
          { error: 'Each social account must have a platform, handle, and followers count' },
          { status: 400 }
        );
      }
    }

    // Check if user already has an influencer profile
    const existingInfluencer = await prisma.influencer.findUnique({
      where: { userId: session.user.id }
    });

    if (existingInfluencer) {
      return NextResponse.json(
        { error: 'Influencer profile already exists' },
        { status: 400 }
      );
    }

    // Create influencer profile with social accounts
    const influencer = await prisma.influencer.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        phone,
        country,
        city,
        primaryNiche,
        secondaryNiches: JSON.stringify(secondaryNiches || []),
        bio,
        websiteUrl,
        ratePerPost,
        brandCollaborations,
        socialAccounts: {
          create: socialAccounts?.map((account: { platform: SocialPlatform; handle: string; followers?: string; url?: string }) => ({
            platform: account.platform,
            handle: account.handle,
            followers: account.followers,
            url: account.url
          })) || []
        }
      },
      include: {
        socialAccounts: true
      }
    });

    // Update user's profile role to INFLUENCER
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { role: 'INFLUENCER' },
      create: {
        userId: session.user.id,
        name: `${firstName} ${lastName}`,
        role: 'INFLUENCER',
        bio,
        website: websiteUrl
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Influencer application submitted successfully',
      influencer: {
        id: influencer.id,
        status: influencer.status,
        applicationDate: influencer.applicationDate
      }
    });

  } catch (error) {
    console.error('Influencer registration error:', error);
    return NextResponse.json(
      { error: 'Failed to submit influencer application' },
      { status: 500 }
    );
  }
}
