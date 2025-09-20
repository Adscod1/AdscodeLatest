"use client";

import { getStores } from "@/app/actions/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, ChevronDown, ChevronUp, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < Math.floor(rating)
              ? "text-yellow-400"
              : i < rating
              ? "text-yellow-400 opacity-60"
              : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

interface Store {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  logo: string | null;
  createdAt: Date;
}

const BusinessCard = ({ store }: { store: Store }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongDescription =
    store.description && store.description.length > 100;

  return (
    <div className="flex p-4 border rounded-lg bg-white">
      <div className="w-40 h-36 bg-gray-200 overflow-hidden mr-4 shrink-0">
        <Image
          src={
            store.logo ||
            "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=800"
          }
          alt={store.name}
          width={160}
          height={144}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <Link href={`/business/${store.id}`}>
          <div className="flex items-center mb-1">
            <h3 className="text-lg font-bold mr-2 hover:text-blue-600 transition-colors">
              {store.name}
            </h3>
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </div>
        </Link>

        <p className="text-gray-600 text-sm mb-1">
          {store.category || "Business"}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={5} />
          <span className="text-sm text-gray-500">New</span>
        </div>

        <p className="text-sm text-gray-600 mb-1">{store.tagline}</p>

        <div className="relative">
          <p
            className={`text-sm text-gray-600 mb-1 ${
              !isExpanded && hasLongDescription ? "line-clamp-2" : ""
            }`}
          >
            {store.description}
          </p>
          {hasLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1 mt-1"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-600">
            Member since{" "}
            <span className="text-blue-500">
              {new Date(store.createdAt).toLocaleDateString()}
            </span>
          </p>

          <Link href={`/(main)/business/${store.id}`}>
            <Button className="bg-blue-500 hover:bg-blue-600">
              View Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const BusinessesPage = () => {
  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl flex flex-row justify-between py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="flex-1 w-full">
            {/* Search section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4">Explore Stores</h1>

              <div className="flex border rounded-lg overflow-hidden bg-white">
                <div className="flex-1 border-r">
                  <Input
                    type="text"
                    placeholder="Search stores..."
                    className="border-none h-full focus-visible:ring-0"
                  />
                </div>
                <div className="flex-1 border-r">
                  <Input
                    type="text"
                    placeholder="Location"
                    className="border-none h-full focus-visible:ring-0"
                  />
                </div>
                <Button className="rounded-none bg-blue-500 hover:bg-blue-600 px-8">
                  Search
                </Button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="mb-6">
              <Tabs defaultValue="all">
                <TabsList className="bg-gray-100 p-1">
                  <TabsTrigger
                    value="all"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="verified"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Verified
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    New
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Store listings */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex p-4 border rounded-lg animate-pulse bg-white"
                    >
                      <div className="w-40 h-36 bg-gray-200 mr-4" />
                      <div className="flex-1 space-y-4">
                        <div className="h-4 bg-gray-200 w-1/4 rounded" />
                        <div className="h-4 bg-gray-200 w-1/3 rounded" />
                        <div className="h-4 bg-gray-200 w-3/4 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                stores?.map((store) => (
                  <BusinessCard key={store.id} store={store} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-1/4  shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-400">Featured</h2>
              <Info className="text-gray-400 h-5 w-5" />
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Create Your Store</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Start selling your products today by creating your own
                    store.
                  </p>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessesPage;
