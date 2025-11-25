"use client";

import api from "@/lib/api-client";
import { StoreActivity } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRightIcon } from "lucide-react";
import { useParams } from "next/navigation";

const ActivityCard = () => {
  const { storeId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store-activity", storeId],
    queryFn: async () => {
      const response = await api.products.getStoreActivity(storeId as string);
      return response.activities as StoreActivity[];
    },
  });

  const renderEmoji = (activity: StoreActivity) => {
    switch (activity.activity) {
      case "POST":
        return "📦";
      case "PRODUCT":
        return "🛒";
      case "ORDER":
        return "🛒";
      case "REVIEW":
        return "🛒";
      case "COMMENT":
        return "💬";
      case "DELETE":
        return "🗑️";
      case "UPDATE":
        return "🔄";
      default:
        return "📦";
    }
  };

  const renderActivityHeader = (activity: StoreActivity) => {
    switch (activity.activity) {
      case "POST":
        return "Created a new product";
      case "PRODUCT":
        return "Updated a product";
      case "ORDER":
        return "Got a new product order";
      case "REVIEW":
        return "Someone left a review";
      case "COMMENT":
        return "Someone left a comment";
      case "DELETE":
        return "Deleted a product";
      case "UPDATE":
        return "Updated a product";
      default:
        return "Product added";
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading activity</div>;

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-blue-500 text-sm hover:underline">
          See all
        </button>
      </div>

      <div className="space-y-4">
        {data?.slice(0, 6).map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
              {renderEmoji(activity)}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">
                {renderActivityHeader(activity)}
              </h3>
              <p className="text-gray-500 text-xs">
                {formatDistanceToNow(activity.createdAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-500 text-xs">
                <ArrowUpRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;
