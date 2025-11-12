import { Campaign, CampaignInfluencer, CampaignStatus, CampaignApplicationStatus } from "@prisma/client";

// Campaign Type enum
export type CampaignType = "PRODUCT" | "DISCOUNT" | "VIDEO" | "PROFILE";

// Type-specific data interfaces

// Discount campaign data
export interface DiscountCampaignData {
  discountId?: string;
  discountCode?: string;
  discountDescription?: string;
  applicationType: "INFLUENCERS" | "CUSTOMERS" | "BOTH";
  applicationInstructions: string;
  usageLimit?: number;
  expiryDate?: string;
}

// Product campaign data
export interface ProductCampaignData {
  productId?: string;
  productLink?: string;
  shopUrl: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  productDescription?: string;
}

// Video campaign data
export interface VideoCampaignData {
  videoUrl: string;
  videoFileName: string;
  videoSize: number;
  videoDuration?: number;
  videoFormat: "mp4" | "mov" | "avi" | "webm";
  videoCaption: string;
  campaignBrief: string;
  contentGuidelines?: string;
  hashtagRequirements?: string[];
}

// Profile campaign data
export interface ProfileCampaignData {
  profileUrl: string;
  profilePlatform: string;
  profileHandle: string;
  profileType: "PERSONAL" | "BUSINESS" | "BRAND";
  campaignGoals: string;
  targetMetrics: {
    followersTarget?: number;
    engagementTarget?: number;
    reachTarget?: number;
  };
  successCriteria: string;
  brandGuidelines?: string;
}

// Union type for all type-specific data
export type TypeSpecificData = 
  | DiscountCampaignData 
  | ProductCampaignData 
  | VideoCampaignData 
  | ProfileCampaignData;

// Campaign with relations
export interface CampaignWithRelations extends Campaign {
  brand?: {
    id: string;
    name: string;
    logo?: string;
  };
  applicants?: CampaignInfluencer[];
  _count?: {
    applicants: number;
  };
}

// Campaign Influencer with relations
export interface CampaignInfluencerWithRelations extends CampaignInfluencer {
  campaign?: Campaign;
  influencer?: {
    id: string;
    firstName: string;
    lastName: string;
    primaryNiche: string;
    userId: string;
    user?: {
      image?: string;
    };
    socialAccounts?: {
      platform: string;
      followers?: string;
      handle: string;
    }[];
  };
}

// Form data types
export interface CampaignFormData {
  title: string;
  description?: string;
  budget: number;
  currency: string;
  duration?: number;
  influencerLocation?: {
    country: string;
    city: string;
  };
  platforms: string[];
  targets: {
    awareness?: string[];
    advocacy?: string[];
    conversions?: string[];
    contentType?: string[];
  };
  type: CampaignType;
  typeSpecificData?: TypeSpecificData;
}

// API Response types
export interface CreateCampaignResponse {
  success: boolean;
  campaign?: Campaign;
  error?: string;
}

export interface GetCampaignsResponse {
  success: boolean;
  campaigns?: CampaignWithRelations[];
  error?: string;
}

export interface PublishCampaignResponse {
  success: boolean;
  campaign?: Campaign;
  error?: string;
}

// Campaign status type guard
export function isCampaignDraft(status: CampaignStatus): boolean {
  return status === "DRAFT";
}

export function isCampaignPublished(status: CampaignStatus): boolean {
  return status === "PUBLISHED" || status === "ACTIVE";
}

// Helper types
export type CampaignListItem = Pick<Campaign, "id" | "title" | "status" | "budget" | "currency" | "createdAt"> & {
  applicantCount: number;
};
