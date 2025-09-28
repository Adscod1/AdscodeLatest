"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/utils/auth";
import { Prisma, Store } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const createStore = async (store: Partial<Store>) => {
  console.log("Creating store with data:", store);
  
  try {
    let session;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (authError) {
      console.error("Auth error:", authError);
      const errorMessage = authError instanceof Error ? authError.message : String(authError);
      throw new Error("Authentication failed: " + errorMessage);
    }

    if (!session) {
      console.error("No session found");
      throw new Error("Unauthorized - no session");
    }

    const userId = session.user?.id;
    if (!userId) {
      console.error("No user ID in session");
      throw new Error("Unauthorized - no user ID");
    }

    console.log("User ID:", userId);

    // Ensure required fields are present
    if (!store.name) {
      throw new Error("Missing required field: name is required");
    }

    // Create store data without ID (let Prisma generate it)
    const storeData: Omit<Prisma.StoreCreateInput, "id"> = {
      name: store.name,
      tagline: store.tagline ?? null,
      description: store.description ?? null,
      category: store.category ?? null,
      regNumber: store.regNumber ?? null,
      yearEstablished: store.yearEstablished ?? null,
      phone: store.phone ?? null,
      email: store.email ?? null,
      address: store.address ?? null,
      city: store.city ?? null,
      state: store.state ?? null,
      country: store.country ?? null,
      zip: store.zip ?? null,
      website: store.website ?? null,
      logo: store.logo ?? null,
      banner: store.banner ?? null,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    console.log("Creating store in database...");
    const newStore = await prisma.store.create({
      data: storeData,
    });
    
    console.log("Store created successfully:", newStore);
    return newStore;
  } catch (error) {
    console.error("Store creation error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create store: ${error.message}`);
    }
    throw new Error("Failed to create store: An unexpected error occurred");
  }
};

export const appendStoreDetails = async (
  storeId: string,
  storeDetails: Store
) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        ...store,
        ...storeDetails,
      },
    });
    return updatedStore;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to append store details" + error.message);
    }
    throw new Error("Failed to append store details");
  }
};

export const getAllUserStores = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  return await prisma.store.findMany({
    where: {
      userId: userId,
    },
  });
};

export const getStoreById = async (storeId: string) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            Product: true,
          },
        },
      },
    });

    if (!store) {
      return null;
    }

    return store;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch store: ${error.message}`);
    }
    throw new Error("Failed to fetch store: An unexpected error occurred");
  }
};

export interface GetStoresParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const getStores = async ({
  page = 1,
  limit = 10,
  search = "",
  category,
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetStoresParams = {}) => {
  try {
    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where: Prisma.StoreWhereInput = {
      AND: [
        // Search in name, description, and tagline
        search
          ? {
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
                { tagline: { contains: search } },
              ],
            }
          : {},
        // Category filter
        category ? { category } : {},
      ],
    };

    // Build the orderBy clause for sorting
    const orderBy: Prisma.StoreOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count for pagination
    const total = await prisma.store.count({ where });

    // Fetch stores with pagination, filtering, and sorting
    const stores = await prisma.store.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            Product: true,
          },
        },
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      stores,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch stores: ${error.message}`);
    }
    throw new Error("Failed to fetch stores: An unexpected error occurred");
  }
};
