"use server";

import { prisma } from "@/lib/prisma";

export const getStores = async () => {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
    return stores;
  } catch (_error) {
    throw new Error("Failed to fetch stores");
  }
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
        Product: {
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            comparePrice: true,
            category: true,
            vendor: true,
            tags: true,
            createdAt: true,
          },
        },
      },
    });

    if (!store) {
      return null;
    }

    return store;
  } catch (_error) {
    throw new Error("Failed to fetch store");
  }
};
