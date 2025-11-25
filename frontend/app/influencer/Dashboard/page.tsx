import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import api from "@/lib/api-client";
import Dashboard from "./Dashboard";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get the user profile and influencer data
  const profileResponse = await api.profiles.getMe();
  const profile = profileResponse.profile;
  
  let influencer = null;
  try {
    const influencerResponse = await api.influencers.getMe();
    if (influencerResponse.influencer) {
      // Transform Influencer to InfluencerData
      const inf = influencerResponse.influencer;
      influencer = {
        id: inf.id,
        firstName: inf.firstName,
        lastName: inf.lastName,
        primaryNiche: inf.primaryNiche || '',
        secondaryNiches: [],
        bio: inf.bio || null,
        status: inf.status,
        socialAccounts: inf.socialAccounts || [],
        user: {
          id: inf.userId,
          email: '',
          name: `${inf.firstName} ${inf.lastName}`,
          image: inf.profilePicture || null,
        },
      };
    }
  } catch {
    // Not an influencer
  }

  if (!profile) {
    redirect("/auth/login");
  }

  // If user is not an influencer, redirect to registration
  if (!influencer) {
    redirect("/influencer/register");
  }

  return <Dashboard influencer={influencer} profile={profile} />;
};

export default DashboardPage;