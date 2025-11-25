import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import api from "@/lib/api-client";
import NotificationsDashboard from "./notification";

const NotificationsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Get the user profile
  const response = await api.profiles.getMe();
  const profile = response.profile;

  if (!profile) {
    redirect("/auth/login");
  }

  return <NotificationsDashboard user={profile} />;
};

export default NotificationsPage;