import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import api from "@/lib/api-client";
import MessagesDashboard from "./messages";

const MessagesPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  try {
    // Get the user profile
    const response = await api.profiles.getMe();
    const profile = response.profile;

    if (!profile) {
      redirect("/auth/login");
    }

    return <MessagesDashboard user={profile} />;
  } catch (error) {
    console.error("Error fetching profile:", error);
    redirect("/auth/login");
  }
};

export default MessagesPage;
