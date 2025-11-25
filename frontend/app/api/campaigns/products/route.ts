import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/campaigns/products - Get products for campaign creation
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's store (brand)
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: "Store not found" },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "ACTIVE";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      storeId: store.id,
      status: status,
    };

    // Add search filter if provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch products with images
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          comparePrice: true,
          category: true,
          tags: true,
          status: true,
          views: true,
          images: {
            select: {
              id: true,
              url: true,
            },
            take: 1, // Only get the first image for listing
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Format products for campaign use
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      category: product.category,
      tags: product.tags,
      status: product.status,
      views: product.views,
      image: product.images[0]?.url || null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json(
      {
        success: true,
        products: formattedProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPreviousPage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products for campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
