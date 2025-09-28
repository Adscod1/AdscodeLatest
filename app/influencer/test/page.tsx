import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { getCurrentInfluencer } from "@/actions/influencer";
import { getCurrentProfile } from "@/actions/profile";

export default async function TestPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return <div>Not logged in</div>;
  }

  const profile = await getCurrentProfile();
  const influencer = await getCurrentInfluencer();

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Debug Information</h1>
      
      <h2 className="text-lg font-semibold mt-4">User Session:</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        {JSON.stringify({ id: session.user.id, email: session.user.email }, null, 2)}
      </pre>
      
      <h2 className="text-lg font-semibold mt-4">Profile:</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        {JSON.stringify(profile, null, 2)}
      </pre>
      
      <h2 className="text-lg font-semibold mt-4">Influencer:</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        {influencer ? JSON.stringify(influencer, null, 2) : "No influencer record found"}
      </pre>
    </div>
  );
}
