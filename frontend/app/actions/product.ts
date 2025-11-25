"use server";

import { prisma } from "@/lib/prisma";

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
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (_error) {
    throw new Error("Failed to fetch products");
  }
};
