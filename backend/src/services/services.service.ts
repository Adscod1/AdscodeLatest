import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoreActivityType } from '@prisma/client';
import {
  CreateServiceDto,
  UpdateServiceDto,
  PatchServiceDto,
} from './dto/service.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new service
   */
  async create(userId: string, data: CreateServiceDto) {
    // Validate required fields
    if (!data.title || !data.storeId) {
      throw new BadRequestException('Title and storeId are required');
    }

    // Verify store ownership
    const store = await this.prisma.store.findUnique({
      where: { id: data.storeId },
    });

    if (!store || store.userId !== userId) {
      throw new BadRequestException('Store not found or access denied');
    }

    // Create the service using Product model
    const service = await this.prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        vendor: data.serviceProvider,
        tags: data.tags,
        price: data.price || 0,
        comparePrice: data.comparePrice,
        costPerItem: data.costPerService,
        status: data.status || 'DRAFT',
        storeId: data.storeId,
        // Store service-specific data
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

    // Store service metadata as variations
    const serviceVariations: Array<{
      productId: string;
      name: string;
      value: string;
      price: number;
      stock: number;
    }> = [];

    if (data.serviceType) {
      serviceVariations.push({
        productId: service.id,
        name: 'serviceType',
        value: data.serviceType,
        price: 0,
        stock: 1,
      });
    }

    if (data.experience !== undefined) {
      serviceVariations.push({
        productId: service.id,
        name: 'experience',
        value: data.experience.toString(),
        price: 0,
        stock: 1,
      });
    }

    if (data.whatsIncluded) {
      // Truncate if too long
      const truncatedValue =
        data.whatsIncluded.length > 255
          ? data.whatsIncluded.substring(0, 255)
          : data.whatsIncluded;
      serviceVariations.push({
        productId: service.id,
        name: 'whatsIncluded',
        value: truncatedValue,
        price: 0,
        stock: 1,
      });
    }

    if (data.targetAudience) {
      serviceVariations.push({
        productId: service.id,
        name: 'targetAudience',
        value: data.targetAudience,
        price: 0,
        stock: 1,
      });
    }

    // Mark as service
    serviceVariations.push({
      productId: service.id,
      name: 'isService',
      value: 'true',
      price: 0,
      stock: 1,
    });

    if (serviceVariations.length > 0) {
      await this.prisma.productVariation.createMany({
        data: serviceVariations,
      });
    }

    // Log store activity
    await this.prisma.storeActivity.create({
      data: {
        storeId: data.storeId,
        activity: StoreActivityType.POST,
        productId: service.id,
      },
    });

    return service;
  }

  /**
   * Get all services for a store
   */
  async findByStore(storeId: string) {
    return this.prisma.product.findMany({
      where: {
        storeId,
        variations: {
          some: {
            name: 'isService',
            value: 'true',
          },
        },
      },
      include: {
        variations: true,
        images: true,
        videos: true,
        store: true,
      },
    });
  }

  /**
   * Get a single service by ID
   */
  async findOne(serviceId: string) {
    const service = await this.prisma.product.findUnique({
      where: { id: serviceId },
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

    // Check if this is actually a service
    const isService = service?.variations?.some(
      (v) => v.name === 'isService' && v.value === 'true',
    );

    if (!service || !isService) {
      throw new NotFoundException('Service not found');
    }

    // Transform the data
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price ? Number(service.price) : undefined,
      comparePrice: service.comparePrice
        ? Number(service.comparePrice)
        : undefined,
      costPerItem: service.costPerItem
        ? Number(service.costPerItem)
        : undefined,
      status: service.status,
      images: service.images,
      videos: service.videos,
      variations: service.variations.map((v) => ({
        name: v.name,
        value: v.value,
      })),
      store: service.store,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }

  /**
   * Full update of a service
   */
  async update(userId: string, serviceId: string, data: UpdateServiceDto) {
    // Validate required fields
    if (!data.title || !data.storeId) {
      throw new BadRequestException('Title and storeId are required');
    }

    // Verify the service exists and is a service type
    const existingService = await this.prisma.product.findUnique({
      where: { id: serviceId },
      include: {
        variations: true,
        store: true,
      },
    });

    const isService = existingService?.variations?.some(
      (v) => v.name === 'isService' && v.value === 'true',
    );

    if (!existingService || !isService) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (existingService.store?.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    // Update the service
    const service = await this.prisma.product.update({
      where: { id: serviceId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        vendor: data.serviceProvider,
        tags: data.tags,
        price: data.price || 0,
        comparePrice: data.comparePrice,
        costPerItem: data.costPerService,
        status: data.status || 'DRAFT',
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
    await this.prisma.productVariation.deleteMany({
      where: {
        productId: serviceId,
        name: {
          in: [
            'serviceType',
            'experience',
            'whatsIncluded',
            'targetAudience',
            'isService',
          ],
        },
      },
    });

    // Create new service variations
    const serviceVariations: Array<{
      productId: string;
      name: string;
      value: string;
      price: number;
      stock: number;
    }> = [];

    if (data.serviceType) {
      serviceVariations.push({
        productId: serviceId,
        name: 'serviceType',
        value: data.serviceType,
        price: 0,
        stock: 1,
      });
    }

    if (data.experience !== undefined) {
      serviceVariations.push({
        productId: serviceId,
        name: 'experience',
        value: data.experience.toString(),
        price: 0,
        stock: 1,
      });
    }

    if (data.whatsIncluded) {
      // Truncate if too long
      const truncatedValue =
        data.whatsIncluded.length > 255
          ? data.whatsIncluded.substring(0, 255)
          : data.whatsIncluded;
      serviceVariations.push({
        productId: serviceId,
        name: 'whatsIncluded',
        value: truncatedValue,
        price: 0,
        stock: 1,
      });
    }

    if (data.targetAudience) {
      serviceVariations.push({
        productId: serviceId,
        name: 'targetAudience',
        value: data.targetAudience,
        price: 0,
        stock: 1,
      });
    }

    // Mark as service
    serviceVariations.push({
      productId: serviceId,
      name: 'isService',
      value: 'true',
      price: 0,
      stock: 1,
    });

    if (serviceVariations.length > 0) {
      await this.prisma.productVariation.createMany({
        data: serviceVariations,
      });
    }

    // Log store activity
    await this.prisma.storeActivity.create({
      data: {
        storeId: data.storeId,
        activity: StoreActivityType.UPDATE,
        productId: serviceId,
      },
    });

    return service;
  }

  /**
   * Partial update of a service (PATCH)
   */
  async patch(userId: string, serviceId: string, data: PatchServiceDto) {
    // Verify the service exists and is a service type
    const existingService = await this.prisma.product.findUnique({
      where: { id: serviceId },
      include: {
        variations: true,
        store: true,
      },
    });

    const isService = existingService?.variations?.some(
      (v) => v.name === 'isService' && v.value === 'true',
    );

    if (!existingService || !isService) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (existingService.store?.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    // Update the service
    const updatedService = await this.prisma.product.update({
      where: { id: serviceId },
      data: {
        ...(data.price !== undefined && { price: data.price }),
        ...(data.comparePrice !== undefined && {
          comparePrice: data.comparePrice,
        }),
        ...(data.costPerService !== undefined && {
          costPerItem: data.costPerService,
        }),
        ...(data.status && { status: data.status }),
        updatedAt: new Date(),
      },
      include: {
        images: true,
        videos: true,
        variations: true,
      },
    });

    // Log the activity
    await this.prisma.storeActivity.create({
      data: {
        storeId: existingService.storeId,
        activity: StoreActivityType.UPDATE,
        productId: updatedService.id,
      },
    });

    return updatedService;
  }

  /**
   * Delete a service
   */
  async delete(userId: string, serviceId: string) {
    // Verify the service exists and is a service type
    const existingService = await this.prisma.product.findUnique({
      where: { id: serviceId },
      include: {
        variations: true,
        store: true,
      },
    });

    const isService = existingService?.variations?.some(
      (v) => v.name === 'isService' && v.value === 'true',
    );

    if (!existingService || !isService) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (existingService.store?.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    // Delete related records in transaction
    await this.prisma.$transaction([
      // Delete variations
      this.prisma.productVariation.deleteMany({
        where: { productId: serviceId },
      }),
      // Delete images
      this.prisma.productImage.deleteMany({
        where: { productId: serviceId },
      }),
      // Delete videos
      this.prisma.productVideo.deleteMany({
        where: { productId: serviceId },
      }),
      // Delete the service
      this.prisma.product.delete({
        where: { id: serviceId },
      }),
    ]);

    // Log the activity
    await this.prisma.storeActivity.create({
      data: {
        storeId: existingService.storeId,
        activity: StoreActivityType.DELETE,
        productId: serviceId,
      },
    });

    return { success: true, message: 'Service deleted successfully' };
  }

  /**
   * Upload service media file
   */
  async uploadMedia(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{
    success: boolean;
    message: string;
    url: string;
    filename: string;
    type: string;
    size: number;
    mediaType: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file received');
    }

    // Validate file type
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new BadRequestException(
        'Invalid file type. Only images and videos are allowed.',
      );
    }

    // Validate file size (10MB for videos, 5MB for images)
    const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds ${isVideo ? '10MB' : '5MB'} limit`,
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const mediaType = isVideo ? 'video' : 'image';
    const filename = `${userId}_service_${mediaType}_${timestamp}.${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;

    return {
      success: true,
      message: 'Service media uploaded successfully',
      url: fileUrl,
      filename,
      type: file.mimetype,
      size: file.size,
      mediaType,
    };
  }
}
