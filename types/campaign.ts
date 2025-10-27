import { Campaign, CampaignInfluencer, CampaignStatus, CampaignApplicationStatus } from "@prisma/client";

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
