// Type definitions for our Prisma models

export interface InfluencerSocial {
  id: string;
  influencerId: string;
  platform: SocialPlatform;
  handle: string;
  followers?: string | null;
  url?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Influencer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  primaryNiche: string;
  secondaryNiches?: string | null;
  bio?: string | null;
  websiteUrl?: string | null;
  ratePerPost?: string | null;
  brandCollaborations?: string | null;
  status: InfluencerStatus;
  applicationDate: Date;
  approvalDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  socialAccounts: InfluencerSocial[];
  user?: any;
}

export enum SocialPlatform {
  INSTAGRAM = "INSTAGRAM",
  YOUTUBE = "YOUTUBE",
  TIKTOK = "TIKTOK",
  TWITTER = "TWITTER",
  FACEBOOK = "FACEBOOK",
  LINKEDIN = "LINKEDIN",
  TWITCH = "TWITCH",
  PINTEREST = "PINTEREST"
}

export enum InfluencerStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED"
}
