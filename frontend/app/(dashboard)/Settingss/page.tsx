import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/actions/profile";
import SettingsPage from "./Settings";

const Settings = async () => {
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

  return <SettingsPage user={profile} />;
};

export default Settings;