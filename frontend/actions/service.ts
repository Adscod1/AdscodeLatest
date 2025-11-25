"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/utils/auth";
import { StoreActivityType } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type CreateServiceInput = {
  title: string;
  description?: string;
  category?: string;
  tags?: string;
  serviceProvider?: string;
  location?: string;
  duration?: string;
  serviceType?: string;
  experience?: number;
  whatsIncluded?: string;
  targetAudience?: string;
  termsAndConditions?: string;
  price?: number;
  comparePrice?: number;
  costPerService?: number;
  images?: { url: string }[];
  videos?: { url: string }[];
  status?: string;
  storeId: string;
};

export const createService = async (data: CreateServiceInput) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/auth/login");
    }

    // Validate required fields
    if (!data.title || !data.storeId) {
      throw new Error("Missing required fields");
    }

    // First, let's try to create the service without the Service model
    // We'll use the Product model as a base and add a type field to distinguish services
    const service = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        vendor: data.serviceProvider,
        tags: data.tags,
        price: data.price || 0,
        comparePrice: data.comparePrice,
        costPerItem: data.costPerService,
        status: data.status || "DRAFT",
        storeId: data.storeId,
        // Store service-specific data in JSON format in description for now
        ...(data.location && { countryOfOrigin: data.location }),
        ...(data.duration && { harmonizedSystemCode: data.duration }),
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
      include: {
        images: true,
        videos: true,
      },
    });

    // Store service metadata as separate variations to avoid column length limits
    const serviceVariations = [];
    
    if (data.serviceType) {
      serviceVariations.push({
        productId: service.id,
        name: "serviceType",
        value: data.serviceType,
        price: 0,
        stock: 1
      });
    }
    
    if (data.experience !== undefined) {
      serviceVariations.push({
        productId: service.id,
        name: "experience",
        value: data.experience.toString(),
        price: 0,
        stock: 1
      });
    }
    
    if (data.whatsIncluded) {
      // Truncate if too long
      const truncatedValue = data.whatsIncluded.length > 255 ? 
        data.whatsIncluded.substring(0, 255) : data.whatsIncluded;
      serviceVariations.push({
        productId: service.id,
        name: "whatsIncluded",
        value: truncatedValue,
        price: 0,
        stock: 1
      });
    }
    
    if (data.targetAudience) {
      serviceVariations.push({
        productId: service.id,
        name: "targetAudience",
        value: data.targetAudience,
        price: 0,
        stock: 1
      });
    }
    
    // Mark as service with a simple flag
    serviceVariations.push({
      productId: service.id,
      name: "isService",
      value: "true",
      price: 0,
      stock: 1
    });
    
    if (serviceVariations.length > 0) {
      await prisma.productVariation.createMany({
        data: serviceVariations
      });
    }

    await prisma.storeActivity.create({
      data: {
        storeId: data.storeId,
        activity: StoreActivityType.POST,
        productId: service.id,
      },
    });

    return service;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }
    throw new Error("Failed to create service");
  }
};

export const getServicesByStore = async (storeId: string) => {
  return await prisma.product.findMany({
    where: { 
      storeId,
      variations: {
        some: {
          name: "isService",
          value: "true"
        }
      }
    },
    include: {
      variations: true,
      images: true,
      videos: true,
      store: true,
    },
  });
};

export const getServiceById = async (serviceId: string) => {
  return await prisma.product.findUnique({
    where: { id: serviceId },
    include: {
      variations: true,
      images: true,
      videos: true,
    },
  });
};

export const updateService = async (
  serviceId: string,
  data: CreateServiceInput
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Validate required fields
    if (!data.title || !data.storeId) {
      throw new Error("Missing required fields");
    }

    // Update the service
    const service = await prisma.product.update({
      where: {
        id: serviceId,
      },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        vendor: data.serviceProvider,
        tags: data.tags,
        price: data.price || 0,
        comparePrice: data.comparePrice,
        costPerItem: data.costPerService,
        status: data.status || "DRAFT",
        ...(data.location && { countryOfOrigin: data.location }),
        ...(data.duration && { harmonizedSystemCode: data.duration }),
        // Update images if provided
        images:
          data.images && data.images.length > 0
            ? {
                deleteMany: {},
                create: data.images.map((img) => ({
                  url: img.url,
                })),
              }
            : undefined,
        // Update videos if provided
        videos:
          data.videos && data.videos.length > 0
            ? {
                deleteMany: {},
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

    // Delete existing service variations and create new ones
    await prisma.productVariation.deleteMany({
      where: {
        productId: serviceId,
        name: { in: ["serviceType", "experience", "whatsIncluded", "targetAudience", "isService"] }
      }
    });
    
    // Create new service variations
    const serviceVariations = [];
    
    if (data.serviceType) {
      serviceVariations.push({
        productId: serviceId,
        name: "serviceType",
        value: data.serviceType,
        price: 0,
        stock: 1
      });
    }
    
    if (data.experience !== undefined) {
      serviceVariations.push({
        productId: serviceId,
        name: "experience",
        value: data.experience.toString(),
        price: 0,
        stock: 1
      });
    }
    
    if (data.whatsIncluded) {
      // Truncate if too long
      const truncatedValue = data.whatsIncluded.length > 255 ? 
        data.whatsIncluded.substring(0, 255) : data.whatsIncluded;
      serviceVariations.push({
        productId: serviceId,
        name: "whatsIncluded",
        value: truncatedValue,
        price: 0,
        stock: 1
      });
    }
    
    if (data.targetAudience) {
      serviceVariations.push({
        productId: serviceId,
        name: "targetAudience",
        value: data.targetAudience,
        price: 0,
        stock: 1
      });
    }
    
    // Mark as service
    serviceVariations.push({
      productId: serviceId,
      name: "isService",
      value: "true",
      price: 0,
      stock: 1
    });
    
    if (serviceVariations.length > 0) {
      await prisma.productVariation.createMany({
        data: serviceVariations
      });
    }

    await prisma.storeActivity.create({
      data: {
        storeId: data.storeId,
        activity: StoreActivityType.UPDATE,
        productId: serviceId,
      },
    });

    return service;
  } catch (error) {
    console.error("Failed to update service:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }
    throw new Error("Failed to update service");
  }
};

export const deleteService = async (serviceId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const service = await prisma.product.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        store: true,
      },
    });

    // Delete the service and all its relations
    await prisma.product.delete({
      where: {
        id: serviceId,
      },
    });

    await prisma.storeActivity.create({
      data: {
        storeId: service?.storeId || "",
        activity: StoreActivityType.DELETE,
        productId: serviceId,
      },
    });

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete service", { cause: error });
  }
};
