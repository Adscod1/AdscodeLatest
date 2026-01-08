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

    // Update Profile table
    const profile = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.location && { location: data.location }),
        ...(data.bio && { bio: data.bio }),
        ...(data.image && { image: data.image }),
      },
    });

    // Update User table for phoneNumber, username, and dateOfBirth
    if (data.phoneNumber !== undefined || data.username !== undefined || data.dateOfBirth !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
          ...(data.username !== undefined && { username: data.username }),
          ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
        },
      });
    }

    return profile;
  }

  /**
   * Update specific profile fields
   */
  async updateFields(
    userId: string,
    data: UpdateProfileDto,
  ) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    // Update Profile table
    const profile = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });

    // Update User table for phoneNumber, username, and dateOfBirth
    if (data.phoneNumber !== undefined || data.username !== undefined || data.dateOfBirth !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
          ...(data.username !== undefined && { username: data.username }),
          ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
        },
      });
    }

    return profile;
  }
}
