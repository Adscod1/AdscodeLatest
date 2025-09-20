"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/utils/auth";
import { StoreActivityType } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type CreateProductInput = {
  title: string;
  description?: string;
  category?: string;
  vendor?: string;
  tags?: string;
  price: number;
  comparePrice?: number;
  costPerItem?: number;
  variations?: {
    name: string;
    value: string;
    price: number;
    stock: number;
  }[];
  images?: { url: string }[];
  videos?: { url: string }[];
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  sizeUnit?: string;
  countryOfOrigin?: string;
  harmonizedSystemCode?: string;
  status?: string;
  storeId: string;
};

export const createProduct = async (data: CreateProductInput) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/auth/login");
    }

    // Validate required fields
    if (!data.title || !data.price || !data.storeId) {
      throw new Error("Missing required fields");
    }

    // Create the product with its relations
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        vendor: data.vendor,
        tags: data.tags,
        price: data.price,
        comparePrice: data.comparePrice,
        costPerItem: data.costPerItem,
        weight: data.weight,
        weightUnit: data.weightUnit,
        length: data.length,
        width: data.width,
        height: data.height,
        sizeUnit: data.sizeUnit,
        countryOfOrigin: data.countryOfOrigin,
        harmonizedSystemCode: data.harmonizedSystemCode,
        status: data.status || "DRAFT",
        storeId: data.storeId,
        // Create variations if provided
        variations:
          data.variations && data.variations.length > 0
            ? {
                create: data.variations.map((v) => ({
                  name: v.name,
                  value: v.value,
                  price: Number(v.price),
                  stock: Number(v.stock),
                })),
              }
            : undefined,
        // Create images if provided
        images:
          data.images && data.images.length > 0
            ? {
                create: data.images.map((img) => ({
                  url: img.url,
                })),
              }
            : undefined,
        // Create videos if provided
        videos:
          data.videos && data.videos.length > 0
            ? {
                create: data.videos.map((vid) => ({
                  url: vid.url,
                })),
              }
            : undefined,
      },
      // Include all relations in the response
      include: {
        variations: true,
        images: true,
        videos: true,
      },
    });

    await prisma.storeActivity.create({
      data: {
        storeId: data.storeId,
        activity: StoreActivityType.POST,
        productId: product.id,
      },
    });

    return product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
    throw new Error("Failed to create product");
  }
};

export const getProductsByStore = async (storeId: string) => {
  return await prisma.product.findMany({
    where: { storeId },
    include: {
      variations: true,
      images: true,
      videos: true,
    },
  });
};

export const getProductById = async (productId: string) => {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variations: true,
      images: true,
      videos: true,
    },
  });
};

export const getProducts = async (storeId: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        variations: true,
        images: true,
        videos: true,
        store: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        store: true,
      },
    });

    // Delete the product and all its relations (handled by Prisma cascade)
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await prisma.storeActivity.create({
      data: {
        storeId: product?.storeId || "",
        activity: StoreActivityType.DELETE,
        productId: productId,
      },
    });

    return { success: true };
  } catch (error) {
    // console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product", { cause: error });
  }
};

export const updateProduct = async (
  productId: string,
  data: CreateProductInput
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Validate required fields
    if (!data.title || !data.price || !data.storeId) {
      throw new Error("Missing required fields");
    }

    // Update the product
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        vendor: data.vendor,
        tags: data.tags,
        price: data.price,
        comparePrice: data.comparePrice,
        costPerItem: data.costPerItem,
        weight: data.weight,
        weightUnit: data.weightUnit,
        length: data.length,
        width: data.width,
        height: data.height,
        sizeUnit: data.sizeUnit,
        countryOfOrigin: data.countryOfOrigin,
        harmonizedSystemCode: data.harmonizedSystemCode,
        status: data.status || "DRAFT",
        // Update variations if provided
        variations:
          data.variations && data.variations.length > 0
            ? {
                deleteMany: {}, // Delete all existing variations
                create: data.variations.map((v) => ({
                  name: v.name,
                  value: v.value,
                  price: Number(v.price),
                  stock: Number(v.stock),
                })),
              }
            : undefined,
        // Update images if provided
        images:
          data.images && data.images.length > 0
            ? {
                deleteMany: {}, // Delete all existing images
                create: data.images.map((img) => ({
                  url: img.url,
                })),
              }
            : undefined,
        // Update videos if provided
        videos:
          data.videos && data.videos.length > 0
            ? {
                deleteMany: {}, // Delete all existing videos
                create: data.videos.map((vid) => ({
                  url: vid.url,
                })),
              }
            : undefined,
      },
      include: {
        variations: true,
        images: true,
        videos: true,
      },
    });

    await prisma.storeActivity.create({
      data: {
        storeId: data.storeId,
        activity: StoreActivityType.UPDATE,
        productId: productId,
      },
    });

    return product;
  } catch (error) {
    console.error("Failed to update product:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
    throw new Error("Failed to update product");
  }
};

export const getStoreActivity = async (storeId: string) => {
  return await prisma.storeActivity.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPopularProducts = async (storeId: string) => {
  // Get popular products by views
  return await prisma.product.findMany({
    where: {
      storeId,
      views: {
        gt: 0,
      },
    },
    orderBy: {
      views: "desc",
    },
    include: {
      variations: true,
      images: true,
    },
  });
};
