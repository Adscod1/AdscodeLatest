import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch comments for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    const comments = await (prisma as any).comment.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      comments,
      count: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    console.log('=== POST /api/comments/[productId] ===');
    console.log('Product ID:', params.productId);
    
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    console.log('Session:', session ? 'Found' : 'Not found');
    console.log('User ID:', session?.user?.id);

    if (!session) {
      console.log('Authentication failed - no session');
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const { productId } = params;
    const body = await request.json();
    const { content } = body;

    console.log('Content:', content);

    if (!content || content.trim().length === 0) {
      console.log('Validation failed - empty content');
      return NextResponse.json(
        { success: false, error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Verify product exists
    console.log('Checking if product exists...');
    const product = await (prisma as any).product.findUnique({
      where: { id: productId },
    });

    console.log('Product found:', product ? 'Yes' : 'No');

    if (!product) {
      console.log('Product not found');
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Create comment
    console.log('Creating comment...');
    const comment = await (prisma as any).comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        productId: productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log('Comment created successfully:', comment.id);

    return NextResponse.json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: "Failed to create comment", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
