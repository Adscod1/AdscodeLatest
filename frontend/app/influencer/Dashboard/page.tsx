import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/actions/profile";
import { getCurrentInfluencer } from "@/actions/influencer";
import Dashboard from "./Dashboard";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get the user profile and influencer data
  const profile = await getCurrentProfile();
  const influencer = await getCurrentInfluencer();

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