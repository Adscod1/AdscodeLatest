import { Campaign } from "@prisma/client";
import {
  CampaignType,
  DiscountCampaignData,
  ProductCampaignData,
  VideoCampaignData,
  ProfileCampaignData,
  TypeSpecificData,
} from "@/types/campaign";
import {
  discountCampaignDataSchema,
  productCampaignDataSchema,
  videoCampaignDataSchema,
  profileCampaignDataSchema,
  validateTypeSpecificData,
} from "@/lib/validations/campaign";

/**
 * Type guard to check if a campaign is a Coupon campaign
 * @param campaign - Campaign object or campaign type string
 * @returns True if campaign type is COUPON
 */
export function isCouponCampaign(
  campaign: any | string
): boolean {
  const type = typeof campaign === "string" ? campaign : (campaign as any).type;
  return type === "COUPON";
}

/**
 * Type guard to check if a campaign is a Product campaign
 * @param campaign - Campaign object or campaign type string
 * @returns True if campaign type is PRODUCT
 */
export function isProductCampaign(
  campaign: any | string
): boolean {
  const type = typeof campaign === "string" ? campaign : (campaign as any).type;
  return type === "PRODUCT";
}

/**
 * Type guard to check if a campaign is a Video campaign
 * @param campaign - Campaign object or campaign type string
 * @returns True if campaign type is VIDEO
 */
export function isVideoCampaign(
  campaign: any | string
): boolean {
  const type = typeof campaign === "string" ? campaign : (campaign as any).type;
  return type === "VIDEO";
}

/**
 * Type guard to check if a campaign is a Profile campaign
 * @param campaign - Campaign object or campaign type string
 * @returns True if campaign type is PROFILE
 */
export function isProfileCampaign(
  campaign: any | string
): boolean {
  const type = typeof campaign === "string" ? campaign : (campaign as any).type;
  return type === "PROFILE";
}

/**
 * Safely extracts coupon campaign data from a campaign
 * @param campaign - Campaign object with typeSpecificData
 * @returns Coupon campaign data or null if not a coupon campaign
 */
export function getCouponCampaignData(
  campaign: any
): CouponCampaignData | null {
  if (!isCouponCampaign(campaign)) return null;
  if (!campaign.typeSpecificData) return null;

  try {
    const result = couponCampaignDataSchema.safeParse(campaign.typeSpecificData);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Safely extracts product campaign data from a campaign
 * @param campaign - Campaign object with typeSpecificData
 * @returns Product campaign data or null if not a product campaign
 */
export function getProductCampaignData(
  campaign: any
): ProductCampaignData | null {
  if (!isProductCampaign(campaign)) return null;
  if (!campaign.typeSpecificData) return null;

  try {
    const result = productCampaignDataSchema.safeParse(campaign.typeSpecificData);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Safely extracts video campaign data from a campaign
 * @param campaign - Campaign object with typeSpecificData
 * @returns Video campaign data or null if not a video campaign
 */
export function getVideoCampaignData(
  campaign: any
): VideoCampaignData | null {
  if (!isVideoCampaign(campaign)) return null;
  if (!campaign.typeSpecificData) return null;

  try {
    const result = videoCampaignDataSchema.safeParse(campaign.typeSpecificData);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Safely extracts profile campaign data from a campaign
 * @param campaign - Campaign object with typeSpecificData
 * @returns Profile campaign data or null if not a profile campaign
 */
export function getProfileCampaignData(
  campaign: any
): ProfileCampaignData | null {
  if (!isProfileCampaign(campaign)) return null;
  if (!campaign.typeSpecificData) return null;

  try {
    const result = profileCampaignDataSchema.safeParse(campaign.typeSpecificData);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Gets the appropriate validation schema for a campaign type
 * @param type - Campaign type
 * @returns Zod schema for the campaign type
 */
export function getSchemaForCampaignType(type: CampaignType) {
  switch (type) {
    case "COUPON":
      return couponCampaignDataSchema;
    case "PRODUCT":
      return productCampaignDataSchema;
    case "VIDEO":
      return videoCampaignDataSchema;
    case "PROFILE":
      return profileCampaignDataSchema;
    default:
      throw new Error(`Unknown campaign type: ${type}`);
  }
}

/**
 * Validates type-specific data for a campaign type
 * @param type - Campaign type
 * @param data - Type-specific data to validate
 * @returns Validation result with success status and data/errors
 */
export function validateCampaignTypeData(
  type: CampaignType,
  data: TypeSpecificData
) {
  return validateTypeSpecificData(type, data);
}

/**
 * Serializes type-specific data for storage (converts to JSON-compatible format)
 * @param data - Type-specific data
 * @returns JSON-serializable object
 */
export function serializeTypeSpecificData(data: TypeSpecificData): any {
  // Deep clone to avoid mutating original
  return JSON.parse(JSON.stringify(data));
}

/**
 * Deserializes type-specific data from storage (parses JSON)
 * @param type - Campaign type
 * @param data - Stored JSON data
 * @returns Parsed type-specific data or null if invalid
 */
export function deserializeTypeSpecificData(
  type: CampaignType,
  data: any
): TypeSpecificData | null {
  if (!data) return null;

  try {
    // If it's a string, parse it
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    
    // Validate against schema
    const result = validateTypeSpecificData(type, parsed);
    return result.success ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Gets a human-readable label for a campaign type
 * @param type - Campaign type
 * @returns Human-readable label
 */
export function getCampaignTypeLabel(type: CampaignType | string): string {
  switch (type) {
    case "COUPON":
      return "Coupon Campaign";
    case "PRODUCT":
      return "Product Campaign";
    case "VIDEO":
      return "Video Campaign";
    case "PROFILE":
      return "Profile Campaign";
    default:
      return "Unknown Campaign Type";
  }
}

/**
 * Gets an icon name for a campaign type (for UI rendering)
 * @param type - Campaign type
 * @returns Icon name or identifier
 */
export function getCampaignTypeIcon(type: CampaignType | string): string {
  switch (type) {
    case "COUPON":
      return "ticket";
    case "PRODUCT":
      return "package";
    case "VIDEO":
      return "video";
    case "PROFILE":
      return "user";
    default:
      return "help-circle";
  }
}

/**
 * Gets a description for a campaign type
 * @param type - Campaign type
 * @returns Description of the campaign type
 */
export function getCampaignTypeDescription(type: CampaignType | string): string {
  switch (type) {
    case "COUPON":
      return "Promote discount codes and special offers to drive sales";
    case "PRODUCT":
      return "Showcase specific products to increase awareness and conversions";
    case "VIDEO":
      return "Create engaging video content campaigns with specific guidelines";
    case "PROFILE":
      return "Boost brand profiles and increase follower engagement";
    default:
      return "Campaign type description not available";
  }
}

/**
 * Checks if type-specific data is required for a campaign type
 * @param type - Campaign type
 * @returns True if type-specific data is required
 */
export function isTypeSpecificDataRequired(type: CampaignType | string): boolean {
  // All campaign types require type-specific data
  return ["COUPON", "PRODUCT", "VIDEO", "PROFILE"].includes(type);
}

/**
 * Extracts type-specific data from a campaign safely with type checking
 * @param campaign - Campaign object
 * @returns Type-specific data or null
 */
export function extractTypeSpecificData(
  campaign: any
): TypeSpecificData | null {
  const type = (campaign as any).type as CampaignType;

  switch (type) {
    case "COUPON":
      return getCouponCampaignData(campaign);
    case "PRODUCT":
      return getProductCampaignData(campaign);
    case "VIDEO":
      return getVideoCampaignData(campaign);
    case "PROFILE":
      return getProfileCampaignData(campaign);
    default:
      return null;
  }
}

/**
 * Validates if a campaign has all required type-specific data
 * @param campaign - Campaign object
 * @returns True if campaign has valid type-specific data
 */
export function hasValidTypeSpecificData(
  campaign: any
): boolean {
  if (!(campaign as any).typeSpecificData) return false;
  
  const type = (campaign as any).type as CampaignType;
  const result = validateTypeSpecificData(type, (campaign as any).typeSpecificData);
  
  return result.success;
}
