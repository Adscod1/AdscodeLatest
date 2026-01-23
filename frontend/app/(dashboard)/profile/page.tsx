import ProfileContent from "./profile-content";
import { getBackendSession } from "@/utils/auth";
import { redirect } from "next/navigation";
import api from "@/lib/api-client";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const ProfilePage = async () => {
  const session = await getBackendSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user has a username (required for all users)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  });

  if (!user?.username) {
    redirect("/auth/complete-profile");
  }

  const response = await api.profiles.getMe();
  let profile = response.profile;

  // If profile doesn't exist (e.g., OAuth user), create one automatically
  if (!profile) {
    try {
      profile = await prisma.profile.create({
        data: {
          id: session.user.id,
          userId: session.user.id,
          name: session.user.name || "User",
          image: session.user.image,
          role: Role.USER,
        },
      });
    } catch {
      // Failed to create profile, redirect to login
      redirect("/auth/login");
    }
  }

  return <ProfileContent user={profile} />;
};

export default ProfilePage;
