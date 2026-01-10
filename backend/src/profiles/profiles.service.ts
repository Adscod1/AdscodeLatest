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
   * Get current user data including username
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update profile (creates if doesn't exist - for OAuth users)
   */
  async update(userId: string, data: UpdateProfileDto) {
    // First, get the user to use their name and image if profile doesn't exist
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if profile exists
    let existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // Create profile if it doesn't exist (for OAuth users)
    if (!existingProfile) {
      existingProfile = await this.prisma.profile.create({
        data: {
          id: userId,
          userId: userId,
          name: data.name || user.name || 'User',
          image: data.image || user.image,
          role: Role.USER,
          location: data.location,
          bio: data.bio,
        },
      });
    } else {
      // Update existing profile
      existingProfile = await this.prisma.profile.update({
        where: { userId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.location !== undefined && { location: data.location }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.image !== undefined && { image: data.image }),
        },
      });
    }

    // Update User table for phoneNumber, username, and dateOfBirth
    if (data.phoneNumber !== undefined || data.username !== undefined || data.dateOfBirth !== undefined) {
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
            ...(data.username !== undefined && { username: data.username }),
            ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
          },
        });
      } catch (error) {
        // Handle duplicate username error
        if (error.code === 'P2002') {
          throw new BadRequestException('Username already taken');
        }
        throw error;
      }
    }

    return existingProfile;
  }

  /**
   * Update specific profile fields (creates if doesn't exist - for OAuth users)
   */
  async updateFields(
    userId: string,
    data: UpdateProfileDto,
  ) {
    // First, get the user to use their name and image if profile doesn't exist
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if profile exists
    let existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // Create profile if it doesn't exist (for OAuth users)
    if (!existingProfile) {
      existingProfile = await this.prisma.profile.create({
        data: {
          id: userId,
          userId: userId,
          name: data.name || user.name || 'User',
          image: data.image || user.image,
          role: Role.USER,
          location: data.location,
          bio: data.bio,
        },
      });
    } else {
      // Update existing profile
      existingProfile = await this.prisma.profile.update({
        where: { userId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.location !== undefined && { location: data.location }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.image !== undefined && { image: data.image }),
        },
      });
    }

    // Update User table for phoneNumber, username, and dateOfBirth
    if (data.phoneNumber !== undefined || data.username !== undefined || data.dateOfBirth !== undefined) {
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
            ...(data.username !== undefined && { username: data.username }),
            ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
          },
        });
      } catch (error) {
        // Handle duplicate username error
        if (error.code === 'P2002') {
          throw new BadRequestException('Username already taken');
        }
        throw error;
      }
    }

    return existingProfile;
  }
}
