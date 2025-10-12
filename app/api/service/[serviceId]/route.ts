import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    const service = await prisma.product.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        images: true,
        videos: true,
        variations: true,
        store: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });

    // Check if this is actually a service by looking for the isService variation
    const isService = service?.variations?.some(v => v.name === "isService" && v.value === "true");
    if (!service || !isService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Transform the data to match our Service interface
    const transformedService = {
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price ? Number(service.price) : undefined,
      comparePrice: service.comparePrice ? Number(service.comparePrice) : undefined,
      costPerItem: service.costPerItem ? Number(service.costPerItem) : undefined,
      status: service.status,
      images: service.images,
      videos: service.videos,
      variations: service.variations.map(v => ({
        name: v.name,
        value: v.value,
      })),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return NextResponse.json({
      success: true,
      service: transformedService,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;
    const body = await request.json();

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Verify the service exists and is a service type
    const existingService = await prisma.product.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        variations: true,
      },
    });

    const isService = existingService?.variations?.some(v => v.name === "isService" && v.value === "true");
    if (!existingService || !isService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Update the service
    const updatedService = await prisma.product.update({
      where: {
        id: serviceId,
      },
      data: {
        ...(body.price !== undefined && { price: body.price }),
        ...(body.comparePrice !== undefined && { comparePrice: body.comparePrice }),
        ...(body.costPerService !== undefined && { costPerItem: body.costPerService }),
        ...(body.status && { status: body.status }),
        updatedAt: new Date(),
      },
      include: {
        images: true,
        videos: true,
        variations: true,
      },
    });

    // Log the activity
    await prisma.storeActivity.create({
      data: {
        storeId: existingService.storeId,
        activity: "UPDATE",
        productId: updatedService.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Verify the service exists and is a service type
    const existingService = await prisma.product.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        variations: true,
      },
    });

    const isService = existingService?.variations?.some(v => v.name === "isService" && v.value === "true");
    if (!existingService || !isService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete related records first
    await prisma.$transaction([
      // Delete variations
      prisma.productVariation.deleteMany({
        where: { productId: serviceId },
      }),
      // Delete images
      prisma.productImage.deleteMany({
        where: { productId: serviceId },
      }),
      // Delete videos
      prisma.productVideo.deleteMany({
        where: { productId: serviceId },
      }),
      // Delete the service
      prisma.product.delete({
        where: { id: serviceId },
      }),
    ]);

    // Log the activity
    await prisma.storeActivity.create({
      data: {
        storeId: existingService.storeId,
        activity: "DELETE",
        productId: serviceId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}