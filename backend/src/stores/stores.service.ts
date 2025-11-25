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
  logo?: string;
  banner?: string;
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

    return store;
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
