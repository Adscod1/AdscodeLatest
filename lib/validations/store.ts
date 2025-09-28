import { z } from "zod";

const businessHourSchema = z
  .object({
    isOpen: z.boolean(),
    open: z.string(),
    close: z.string(),
  })
  .optional();

const businessHoursSchema = z
  .object({
    monday: businessHourSchema,
    tuesday: businessHourSchema,
    wednesday: businessHourSchema,
    thursday: businessHourSchema,
    friday: businessHourSchema,
    saturday: businessHourSchema,
    sunday: businessHourSchema,
  })
  .optional();

const storeFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Store name must be at least 2 characters"),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  regNumber: z.string().optional().nullable(),
  yearEstablished: z.date().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  logo: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  businessHours: businessHoursSchema,
  hasSpecialHours: z.boolean().optional(),
});

export type StoreFormData = z.infer<typeof storeFormSchema>;
export type BusinessHours = z.infer<typeof businessHoursSchema>;
export { storeFormSchema };
