import { Product } from "@/data";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  bio: z.string().optional(),
});
export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

export interface ExtendedProduct extends Product {
  store: {
    id: string;
    name: string;
    category: string | null;
  };
  variations: {
    id: string;
    name: string;
    value: string;
    price: number;
    stock: number;
  }[];
  images: {
    id: string;
    url: string;
  }[];
  comparePrice?: number;
}

export interface ProductCardProps {
  product: ExtendedProduct;
}
