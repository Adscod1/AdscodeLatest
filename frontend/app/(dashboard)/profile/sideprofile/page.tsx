import { headers } from "next/headers";
import SocialProfile from "./Profile";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import api from "@/lib/api-client";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const response = await api.profiles.getMe();
  const profile = response.profile;

  if (!profile) {
    redirect("/auth/login");
  }

  return <SocialProfile user={profile} />;
};

export default ProfilePage;
