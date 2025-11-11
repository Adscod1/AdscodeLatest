import { z } from "zod";

// Type-specific validation schemas

// Discount campaign data schema
export const discountCampaignDataSchema = z.object({
  discountId: z.string().uuid().optional(),
  discountCode: z.string().min(3).max(50).optional(),
  discountDescription: z.string().optional(),
  applicationType: z.enum(["INFLUENCERS", "CUSTOMERS", "BOTH"], {
    required_error: "Application type is required",
  }),
  applicationInstructions: z.string().min(20, "Application instructions must be at least 20 characters"),
  usageLimit: z.number().int().positive().optional(),
  expiryDate: z.string().datetime().optional(),
}).refine(
  (data) => data.discountId || data.discountCode,
  {
    message: "Either discountId or discountCode must be provided",
    path: ["discountCode"],
  }
);

// Product campaign data schema
export const productCampaignDataSchema = z.object({
  productId: z.string().uuid().optional(),
  productLink: z.string().optional().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    { message: "Invalid product link URL" }
  ),
  shopUrl: z.string().optional().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    { message: "Invalid shop URL" }
  ),
  productTitle: z.string().optional(),
  productPrice: z.number().positive().optional(),
  productImage: z.string().url().optional(),
  productDescription: z.string().optional(),
});

// Video campaign data schema
export const videoCampaignDataSchema = z.object({
  videoUrl: z.string().url("Video URL is required and must be valid"),
  videoFileName: z.string().min(1, "Video file name is required"),
  videoSize: z.number().positive().max(500 * 1024 * 1024, "Video size must not exceed 500MB"),
  videoDuration: z.number().int().positive().optional(),
  videoFormat: z.enum(["mp4", "mov", "avi", "webm"], {
    required_error: "Video format is required",
  }),
  videoCaption: z.string().min(10, "Video caption must be at least 10 characters"),
  campaignBrief: z.string().min(50, "Campaign brief must be at least 50 characters"),
  contentGuidelines: z.string().optional(),
  hashtagRequirements: z.array(z.string()).optional(),
});

// Profile campaign data schema
export const profileCampaignDataSchema = z.object({
  profileUrl: z.string().url("Profile URL is required and must be valid"),
  profilePlatform: z.string().min(1, "Profile platform is required"),
  profileHandle: z.string().regex(/^@?[\w.]+$/, "Invalid profile handle format"),
  profileType: z.enum(["PERSONAL", "BUSINESS", "BRAND"], {
    required_error: "Profile type is required",
  }),
  campaignGoals: z.string().min(50, "Campaign goals must be at least 50 characters"),
  targetMetrics: z.object({
    followersTarget: z.number().int().positive().optional(),
    engagementTarget: z.number().positive().optional(),
    reachTarget: z.number().int().positive().optional(),
  }).refine(
    (data) => data.followersTarget || data.engagementTarget || data.reachTarget,
    { 
      message: "At least one target metric must be provided",
      path: ["followersTarget"],
    }
  ),
  successCriteria: z.string().min(30, "Success criteria must be at least 30 characters"),
  brandGuidelines: z.string().optional(),
});

// Helper function to get the appropriate schema based on campaign type
export function getTypeSpecificSchema(type: "PRODUCT" | "DISCOUNT" | "VIDEO" | "PROFILE") {
  switch (type) {
    case "DISCOUNT":
      return discountCampaignDataSchema;
    case "PRODUCT":
      return productCampaignDataSchema;
    case "VIDEO":
      return videoCampaignDataSchema;
    case "PROFILE":
      return profileCampaignDataSchema;
    default:
      return z.object({});
  }
}

// Helper function to validate type-specific data
export function validateTypeSpecificData(
  type: "PRODUCT" | "DISCOUNT" | "VIDEO" | "PROFILE",
  data: any
) {
  const schema = getTypeSpecificSchema(type);
  return schema.safeParse(data);
}

// Campaign creation schema
export const createCampaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title is too long"),
  description: z.string().optional(),
  budget: z.number().positive("Budget must be greater than 0"),
  currency: z.string().default("UGX"),
  duration: z.number().int().positive().optional(),
  influencerLocation: z.object({
    country: z.string(),
    city: z.string(),
  }).optional(),
  // Platforms optional (UI inputs removed)
  platforms: z.array(z.string()).optional(),
  targets: z.object({
    awareness: z.array(z.string()).optional(),
    advocacy: z.array(z.string()).optional(),
    conversions: z.array(z.string()).optional(),
    contentType: z.array(z.string()).optional(),
  }).optional(), // Made optional since UI may not collect all target data
  type: z.enum(["PRODUCT", "DISCOUNT", "VIDEO", "PROFILE"], {
    required_error: "Campaign type is required",
  }).default("PRODUCT"), // Default to PRODUCT for backward compatibility
  typeSpecificData: z.union([
    discountCampaignDataSchema,
    productCampaignDataSchema,
    videoCampaignDataSchema,
    profileCampaignDataSchema,
  ]).optional(),
});

// Campaign update schema (all fields optional except what's required)
export const updateCampaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title is too long").optional(),
  description: z.string().optional(),
  budget: z.number().positive("Budget must be greater than 0").optional(),
  currency: z.string().optional(),
  duration: z.number().int().positive().optional(),
  influencerLocation: z.object({
    country: z.string(),
    city: z.string(),
  }).optional(),
  platforms: z.array(z.string()).optional(),
  targets: z.object({
    awareness: z.array(z.string()).optional(),
    advocacy: z.array(z.string()).optional(),
    conversions: z.array(z.string()).optional(),
    contentType: z.array(z.string()).optional(),
  }).optional(),
  type: z.enum(["PRODUCT", "DISCOUNT", "VIDEO", "PROFILE"], {
    invalid_type_error: "Invalid campaign type",
  }).optional(),
  typeSpecificData: z.union([
    discountCampaignDataSchema,
    productCampaignDataSchema,
    videoCampaignDataSchema,
    profileCampaignDataSchema,
  ]).optional(),
});

// Publish campaign schema (validates that required fields are present)
export const publishCampaignSchema = z.object({
  id: z.string().uuid("Invalid campaign ID"),
});

// Type exports
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type PublishCampaignInput = z.infer<typeof publishCampaignSchema>;

// Type-specific data type exports
export type DiscountCampaignDataInput = z.infer<typeof discountCampaignDataSchema>;
export type ProductCampaignDataInput = z.infer<typeof productCampaignDataSchema>;
export type VideoCampaignDataInput = z.infer<typeof videoCampaignDataSchema>;
export type ProfileCampaignDataInput = z.infer<typeof profileCampaignDataSchema>;
