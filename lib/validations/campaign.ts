import { z } from "zod";

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
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  targets: z.object({
    awareness: z.array(z.string()).optional(),
    advocacy: z.array(z.string()).optional(),
    conversions: z.array(z.string()).optional(),
    contentType: z.array(z.string()).optional(),
  }).refine(
    (data) => {
      // At least one target category must have selections
      return (
        (data.awareness && data.awareness.length > 0) ||
        (data.advocacy && data.advocacy.length > 0) ||
        (data.conversions && data.conversions.length > 0) ||
        (data.contentType && data.contentType.length > 0)
      );
    },
    { message: "Select at least one campaign target" }
  ),
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
});

// Publish campaign schema (validates that required fields are present)
export const publishCampaignSchema = z.object({
  id: z.string().uuid("Invalid campaign ID"),
});

// Type exports
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type PublishCampaignInput = z.infer<typeof publishCampaignSchema>;
