import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/actions/profile";
import ProgressDashboard from "./myprogress";

const WriteReviewsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get the user profile
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  return <ProgressDashboard user={profile} />;
};

export default WriteReviewsPage;