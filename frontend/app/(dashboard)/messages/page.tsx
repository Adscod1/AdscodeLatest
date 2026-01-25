import { redirect } from "next/navigation";
import { getBackendSession } from "@/utils/auth";
import api from "@/lib/api-client";
import MessagesDashboard from "./messages";

const MessagesPage = async () => {
  const session = await getBackendSession();

  if (!session?.user) {
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
