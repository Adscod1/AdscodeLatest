import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/actions/profile";
import ProductCategoriesDashboard from "./reviews";

const ProductCategories = async () => {
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

  return <ProductCategoriesDashboard user={profile} />;
};

export default ProductCategories;