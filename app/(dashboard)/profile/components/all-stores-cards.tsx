import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LoadingState } from "@/app/components/skeletons/stores-skeleton-loader";
import { ErrorState } from "@/app/components/errors/error-state";
import { Store } from "@prisma/client";

const AllStoresCards = () => {
  const {
    data: stores,
    isLoading,
    isError,
  } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await fetch("/api/stores");
      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }
      return response.json();
    },
  });

  if (isLoading) return <LoadingState />;

  if (isError) return <ErrorState message="Failed to load stores" />;

  if (!stores?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center py-4">
          <h3 className="font-medium text-gray-900 mb-1">No stores yet</h3>
          <p className="text-sm text-gray-500 mb-3">
            Create your first store to get started
          </p>
          <Link
            href="/new"
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            Create Store →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">My Stores</h3>
        <Link href="/new" className="text-blue-500 text-xs">
          Create Store
        </Link>
      </div>
      <div className="space-y-4">
        {stores?.map((store) => (
          <Link
            href={`/${store.id}`}
            key={store.id}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={32}
                  height={32}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {store.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center gap-1">
                  {store.name}
                </div>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {store.tagline ||
                  store.description?.substring(0, 100) ||
                  "No description"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllStoresCards;
