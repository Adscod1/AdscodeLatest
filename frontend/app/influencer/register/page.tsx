import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import api from "@/lib/api-client";
import CreatorNetworkForm from "./register";

const registerform = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get the user profile and check if already an influencer
  const profileResponse = await api.profiles.getMe();
  const profile = profileResponse.profile;
  
  let influencer = null;
  try {
    const influencerResponse = await api.influencers.getMe();
    influencer = influencerResponse.influencer;
  } catch {
    // Not an influencer yet, that's expected
  }

  if (!profile) {
    redirect("/auth/login");
  }

  // If user is already an influencer, redirect to dashboard
  if (influencer) {
    redirect("/influencer/Dashboard");
  }

  return <CreatorNetworkForm />;
};


export default registerform;