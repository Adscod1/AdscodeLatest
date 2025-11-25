import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new profile (used after user registration)
   */
  async create(userId: string, name: string, image?: string) {
    try {
      const profile = await this.prisma.profile.create({
        data: {
          id: userId,
          userId: userId,
          name: name,
          image: image,
          role: Role.USER,
          bio: 'Your bio here',
        },
      });

      return profile;
    } catch (error) {
      throw new BadRequestException('Failed to create profile');
    }
  }

  /**
   * Get profile by user ID
   */
  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  /**
   * Get current user's profile
   */
  async getCurrentProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    return profile;
  }

  /**
   * Update profile
   */
  async update(userId: string, data: UpdateProfileDto) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    const profile = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.location && { location: data.location }),
        ...(data.bio && { bio: data.bio }),
        ...(data.image && { image: data.image }),
      },
    });

    return profile;
  }

  /**
   * Update specific profile fields
   */
  async updateFields(
    userId: string,
    data: { name?: string; location?: string; bio?: string },
  ) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    const profile = await this.prisma.profile.update({
      where: { userId },
      data: {
        name: data.name,
        location: data.location,
        bio: data.bio,
      },
    });

    return profile;
  }
}
