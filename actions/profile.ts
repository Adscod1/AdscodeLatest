"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { RegisterFormValues, ProfileUpdateValues } from "@/types";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export const createProfile = async (data: RegisterFormValues) => {
  try {
    console.log("Creating profile with data:", { email: data.email, name: data.name });
    
    // Use the server-side auth API for registration
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      headers: await headers(),
    });

    console.log("Auth signup result:", result);

    // Check if result exists and has user
    if (!result || !result.user) {
      throw new Error("Failed to create user account");
    }

    const user = result.user;
    console.log("Created user:", user);

    // Create the profile record
    const profile = await prisma.profile.create({
      data: {
        id: user.id,
        userId: user.id,
        name: user.name || data.name,
        image: user.image,
        role: Role.USER,
        bio: "Your bio here",
      },
    });
    console.log("Created profile:", profile);

    return { success: true, user };
  } catch (error) {
    console.error("Profile creation error:", error);
    
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const getCurrentProfile = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return profile;
  } catch (error) {
    console.error("Get profile error:", error);
    throw new Error("Failed to get user profile");
  }
};

export const updateProfile = async (data: RegisterFormValues) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    const profile = await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data,
    });

    return profile;
  } catch (error) {
    console.error("Update profile error:", error);
    throw new Error("Failed to update profile");
  }
};

export const updateProfileFields = async (data: ProfileUpdateValues) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not authenticated");
    }

    const profile = await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        name: data.name,
        location: data.location,
        bio: data.bio,
      },
    });

    return profile;
  } catch (error) {
    console.error("Update profile fields error:", error);
    throw new Error("Failed to update profile");
  }
};
