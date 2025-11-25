import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/actions/profile";
import { getCurrentInfluencer } from "@/actions/influencer";
import CreatorNetworkForm from "./register";

const registerform = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get the user profile and check if already an influencer
  const profile = await getCurrentProfile();
  const influencer = await getCurrentInfluencer();

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