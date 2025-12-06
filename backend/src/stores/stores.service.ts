import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface GetStoresParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BusinessHourDto {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface BusinessHoursDto {
  monday?: BusinessHourDto;
  tuesday?: BusinessHourDto;
  wednesday?: BusinessHourDto;
  thursday?: BusinessHourDto;
  friday?: BusinessHourDto;
  saturday?: BusinessHourDto;
  sunday?: BusinessHourDto;
}

export interface CreateStoreDto {
  name: string;
  tagline?: string;
  description?: string;
  category?: string;
  regNumber?: string;
  yearEstablished?: number;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  logo?: string;
  banner?: string;
  galleryImages?: string[];
  galleryVideos?: string[];
  businessHours?: BusinessHoursDto;
  selectedHighlights?: string[];
}

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all stores for a user
   */
  async findUserStores(userId: string) {
    return this.prisma.store.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new store
   */
  async create(userId: string, data: CreateStoreDto) {
    if (!data.name) {
      throw new BadRequestException('Store name is required');
    }

    // Create store with basic data
    const store = await this.prisma.store.create({
      data: {
        name: data.name,
        tagline: data.tagline ?? null,
        description: data.description ?? null,
        category: data.category ?? null,
        regNumber: data.regNumber ?? null,
        yearEstablished: data.yearEstablished ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        country: data.country ?? null,
        zip: data.zip ?? null,
        website: data.website ?? null,
        logo: data.logo ?? null,
        banner: data.banner ?? null,
        user: {
          connect: { id: userId },
        },
      },
    });

    // Create social media links
    const socialMediaLinks = [];
    if (data.facebook) {
      socialMediaLinks.push({
        storeId: store.id,
        social: `facebook:${data.facebook}`,
      });
    }
    if (data.instagram) {
      socialMediaLinks.push({
        storeId: store.id,
        social: `instagram:${data.instagram}`,
      });
    }
    if (data.twitter) {
      socialMediaLinks.push({
        storeId: store.id,
        social: `twitter:${data.twitter}`,
      });
    }

    if (socialMediaLinks.length > 0) {
      await this.prisma.storeSocial.createMany({
        data: socialMediaLinks,
      });
    }

    // Create business hours
    if (data.businessHours) {
      const hoursData = [];
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      for (const day of days) {
        const dayData = data.businessHours[day as keyof BusinessHoursDto];
        if (dayData && dayData.isOpen) {
          hoursData.push({
            storeId: store.id,
            day: day.charAt(0).toUpperCase() + day.slice(1),
            open: dayData.open,
            close: dayData.close,
          });
        }
      }

      if (hoursData.length > 0) {
        await this.prisma.storeHours.createMany({
          data: hoursData,
        });
      }
    }

    // Create gallery images
    if (data.galleryImages && data.galleryImages.length > 0) {
      await this.prisma.storeImage.createMany({
        data: data.galleryImages.map((image) => ({
          storeId: store.id,
          image,
        })),
      });
    }

    // Create gallery videos
    if (data.galleryVideos && data.galleryVideos.length > 0) {
      await this.prisma.storeVideo.createMany({
        data: data.galleryVideos.map((video) => ({
          storeId: store.id,
          video,
        })),
      });
    }

    // Create highlights
    if (data.selectedHighlights && data.selectedHighlights.length > 0) {
      await this.prisma.storeHighlight.createMany({
        data: data.selectedHighlights.map((highlight) => ({
          storeId: store.id,
          highlight,
        })),
      });
    }

    // Return store with all related data
    return this.prisma.store.findUnique({
      where: { id: store.id },
      include: {
        StoreSocial: true,
        StoreHours: true,
        StoreImage: true,
        StoreVideo: true,
        StoreHighlight: true,
      },
    });
  }

  /**
   * Update store details
   */
  async update(userId: string, storeId: string, data: Partial<CreateStoreDto>) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    const updatedStore = await this.prisma.store.update({
      where: { id: storeId },
      data: {
        ...data,
      },
    });

    return updatedStore;
  }

  /**
   * Get a single store by ID
   */
  async findById(storeId: string) {
    const store = await this.prisma.store.findUnique({
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
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  /**
   * Get all stores with pagination, filtering, and sorting
   */
  async findAll(params: GetStoresParams = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

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
    const total = await this.prisma.store.count({ where });

    // Fetch stores with pagination, filtering, and sorting
    const stores = await this.prisma.store.findMany({
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
  }

  /**
   * Delete a store
   */
  async delete(userId: string, storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    await this.prisma.store.delete({
      where: { id: storeId },
    });

    return { success: true, message: 'Store deleted successfully' };
  }
}
