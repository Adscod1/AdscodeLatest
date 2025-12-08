import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCommentDto } from './dto/product.dto';
import { StoreActivityType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verify user owns the store
   */
  private async verifyStoreOwnership(userId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!store) {
      throw new ForbiddenException('You do not have access to this store');
    }

    return store;
  }

  /**
   * Create a new product
   */
  async create(userId: string, dto: CreateProductDto) {
    // Verify user owns the store
    await this.verifyStoreOwnership(userId, dto.storeId);

    // Create the product with relations
    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        vendor: dto.vendor,
        tags: dto.tags,
        price: dto.price,
        comparePrice: dto.comparePrice,
        costPerItem: dto.costPerItem,
        weight: dto.weight,
        weightUnit: dto.weightUnit,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        sizeUnit: dto.sizeUnit,
        countryOfOrigin: dto.countryOfOrigin,
        harmonizedSystemCode: dto.harmonizedSystemCode,
        status: dto.status || 'DRAFT',
        storeId: dto.storeId,
        benefitsIntroText: dto.benefitsIntroText,
        benefitsSectionImage: dto.benefitsSectionImage,
        howToUseVideo: dto.howToUseVideo,
        howToUseDescription: dto.howToUseDescription,
        variations: dto.variations?.length
          ? {
              create: dto.variations.map((v) => ({
                name: v.name,
                value: v.value,
                price: Number(v.price),
                stock: Number(v.stock),
              })),
            }
          : undefined,
        images: dto.images?.length
          ? {
              create: dto.images.map((img) => ({
                url: img.url,
              })),
            }
          : undefined,
        videos: dto.videos?.length
          ? {
              create: dto.videos.map((vid) => ({
                url: vid.url,
              })),
            }
          : undefined,
        benefitItems: dto.benefitItems?.length
          ? {
              create: dto.benefitItems.map((item) => ({
                title: item.title,
                description: item.description,
              })),
            }
          : undefined,
        ingredientItems: dto.ingredientItems?.length
          ? {
              create: dto.ingredientItems.map((item) => ({
                name: item.name,
                image: item.image,
                description: item.description,
              })),
            }
          : undefined,
        faqItems: dto.faqItems?.length
          ? {
              create: dto.faqItems.map((item) => ({
                question: item.question,
                answer: item.answer,
              })),
            }
          : undefined,
      },
      include: {
        variations: true,
        images: true,
        videos: true,
        benefitItems: true,
        ingredientItems: true,
        faqItems: true,
      },
    });

    // Log store activity
    await this.prisma.storeActivity.create({
      data: {
        storeId: dto.storeId,
        activity: StoreActivityType.POST,
        productId: product.id,
      },
    });

    return {
      success: true,
      product,
      message: 'Product created successfully',
    };
  }

  /**
   * Get all products for a store
   */
  async findByStore(storeId: string) {
    const products = await this.prisma.product.findMany({
      where: { storeId },
      include: {
        variations: true,
        images: true,
        videos: true,
        benefitItems: true,
        ingredientItems: true,
        faqItems: true,
        store: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      products,
    };
  }

  /**
   * Get a single product by ID
   */
  async findOne(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variations: true,
        images: true,
        videos: true,
        benefitItems: true,
        ingredientItems: true,
        faqItems: true,
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment views
    await this.prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } },
    });

    return {
      success: true,
      product,
    };
  }

  /**
   * Update a product
   */
  async update(userId: string, productId: string, dto: UpdateProductDto) {
    // Get existing product
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Verify user owns the store
    await this.verifyStoreOwnership(userId, existingProduct.storeId);

    // Update the product
    const product = await this.prisma.product.update({
      where: { id: productId },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        vendor: dto.vendor,
        tags: dto.tags,
        price: dto.price,
        comparePrice: dto.comparePrice,
        costPerItem: dto.costPerItem,
        weight: dto.weight,
        weightUnit: dto.weightUnit,
        length: dto.length,
        width: dto.width,
        height: dto.height,
        sizeUnit: dto.sizeUnit,
        countryOfOrigin: dto.countryOfOrigin,
        harmonizedSystemCode: dto.harmonizedSystemCode,
        status: dto.status || 'DRAFT',
        benefitsIntroText: dto.benefitsIntroText,
        benefitsSectionImage: dto.benefitsSectionImage,
        howToUseVideo: dto.howToUseVideo,
        howToUseDescription: dto.howToUseDescription,
        variations: dto.variations?.length
          ? {
              deleteMany: {},
              create: dto.variations.map((v) => ({
                name: v.name,
                value: v.value,
                price: Number(v.price),
                stock: Number(v.stock),
              })),
            }
          : undefined,
        images: dto.images?.length
          ? {
              deleteMany: {},
              create: dto.images.map((img) => ({
                url: img.url,
              })),
            }
          : undefined,
        videos: dto.videos?.length
          ? {
              deleteMany: {},
              create: dto.videos.map((vid) => ({
                url: vid.url,
              })),
            }
          : undefined,
        benefitItems: dto.benefitItems?.length
          ? {
              deleteMany: {},
              create: dto.benefitItems.map((item) => ({
                title: item.title,
                description: item.description,
              })),
            }
          : undefined,
        ingredientItems: dto.ingredientItems?.length
          ? {
              deleteMany: {},
              create: dto.ingredientItems.map((item) => ({
                name: item.name,
                image: item.image,
                description: item.description,
              })),
            }
          : undefined,
        faqItems: dto.faqItems?.length
          ? {
              deleteMany: {},
              create: dto.faqItems.map((item) => ({
                question: item.question,
                answer: item.answer,
              })),
            }
          : undefined,
      },
      include: {
        variations: true,
        images: true,
        videos: true,
        benefitItems: true,
        ingredientItems: true,
        faqItems: true,
      },
    });

    // Log store activity
    await this.prisma.storeActivity.create({
      data: {
        storeId: existingProduct.storeId,
        activity: StoreActivityType.UPDATE,
        productId: productId,
      },
    });

    return {
      success: true,
      product,
      message: 'Product updated successfully',
    };
  }

  /**
   * Delete a product
   */
  async delete(userId: string, productId: string) {
    // Get existing product
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Verify user owns the store
    await this.verifyStoreOwnership(userId, existingProduct.storeId);

    // Delete the product
    await this.prisma.product.delete({
      where: { id: productId },
    });

    // Log store activity
    await this.prisma.storeActivity.create({
      data: {
        storeId: existingProduct.storeId,
        activity: StoreActivityType.DELETE,
        productId: productId,
      },
    });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }

  /**
   * Get popular products for a store
   */
  async getPopular(storeId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        storeId,
        views: { gt: 0 },
      },
      orderBy: {
        views: 'desc',
      },
      include: {
        variations: true,
        images: true,
      },
      take: 10,
    });

    return {
      success: true,
      products,
    };
  }

  /**
   * Handle media upload for products
   */
  async uploadMedia(
    userId: string,
    file: Express.Multer.File,
    type: string = 'product',
  ) {
    // Validate file type
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new BadRequestException('Invalid file type. Only images and videos are allowed.');
    }

    // Validate file size (10MB for videos, 5MB for images)
    const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds ${isVideo ? '10MB' : '5MB'} limit`);
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const mediaType = isVideo ? 'video' : 'image';
    const filename = `${userId}_product_${mediaType}_${timestamp}.${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), '..', 'frontend', 'public', 'uploads');

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
      message: 'Product media uploaded successfully',
      url: fileUrl,
      filename,
      type: file.mimetype,
      size: file.size,
      mediaType,
    };
  }

  // ==================== Comments ====================

  /**
   * Get comments for a product
   */
  async getComments(productId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { productId },
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
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      comments,
      count: comments.length,
    };
  }

  /**
   * Create a comment on a product
   */
  async createComment(userId: string, productId: string, dto: CreateCommentDto) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Create comment
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content.trim(),
        userId,
        productId,
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

    return {
      success: true,
      comment,
    };
  }

  /**
   * Get store activity log
   */
  async getStoreActivity(storeId: string) {
    const activities = await this.prisma.storeActivity.findMany({
      where: { storeId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      activities,
    };
  }
}
