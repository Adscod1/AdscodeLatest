"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/utils/auth";
import { Prisma, StoreReview } from "@prisma/client";
import { headers } from "next/headers";

export const createStoreReview = async (review: Partial<StoreReview>) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const reviewData: Omit<Prisma.StoreReviewCreateInput, "id"> = {
      rating: review.rating ?? 0,
      comment: review.comment,
      user: {
        connect: {
          id: userId,
        },
      },
      store: {
        connect: {
          id: review.storeId,
        },
      },
    };

    const newReview = await prisma.storeReview.create({
      data: reviewData,
    });

    return newReview;
  } catch (error) {
    console.error("Error creating store review:", error);
    throw new Error("Failed to create store review");
  }
};

export const getStoreReviews = async (storeId: string) => {
  try {
    const reviews = await prisma.storeReview.findMany({
      where: {
        storeId,
      },
    });

    return reviews;
  } catch (error) {
    console.error("Error getting store reviews:", error);
    throw new Error("Failed to get store reviews");
  }
};
