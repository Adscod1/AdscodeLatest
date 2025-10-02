"use client";

import { getStores } from "@/app/actions/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { 
  CheckCircle, 
  MapPin, 
  Clock, 

  Users, 
  Car,
  Smartphone,
  UtensilsCrossed
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const StarRating = ({ rating }: { rating: number }) => {
  const SoftStar = ({ filled }: { filled: boolean }) => (
    <svg
      className="w-4 h-4 text-6xl"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 2.5c.3 0 .6.2.7.5l2.1 4.3 4.7.7c.3 0 .6.3.7.6.1.3 0 .6-.2.8l-3.4 3.3.8 4.7c.1.3 0 .6-.2.8-.2.2-.5.3-.8.1L12 15.4l-4.2 2.2c-.3.2-.6.1-.8-.1-.2-.2-.3-.5-.2-.8l.8-4.7L4.2 8.7c-.2-.2-.3-.5-.2-.8.1-.3.4-.6.7-.6l4.7-.7L11.3 3c.1-.3.4-.5.7-.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="flex items-center space-x-0.5 ">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={
            i < Math.floor(rating)
              ? "text-orange-400"
              : i < rating
              ? "text-orange-400 opacity-60"
              : "text-gray-300"
          }
        >
          <SoftStar filled={i < Math.floor(rating)} />
        </div>
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
  return (
    <div className="flex h-[340px] bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-64">
      {/* Image Gallery */}
      <div className="w-[600px] h-full relative flex-shrink-0">
        <div className="flex h-full gap-1">
          {/* Main large image */}
          <div className="relative flex-1">
            <Image
              src={store.logo || "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=800"}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>
          {/* 4 smaller images in a 2x2 grid */}
          <div className="w-20 grid grid-cols-1 gap-1">
            <div className="relative h-full">
              <Image
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=400"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-full">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400"
                alt="Restaurant food"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-full">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400"
                alt="Restaurant ambiance"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-full">
              <Image
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400"
                alt="Restaurant dishes"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        {/* Image indicators */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          1/5
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <Link href={`/business/${store.id}`}>
                <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  {store.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-2 font-6xl">
                <StarRating rating={4}  />
                <span className="text-base font-medium">4.0</span>
                <span className="text-sm text-gray-500">(45 Reviews)</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              Seafood
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              Wines Bars
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              Cocktails
            </span>
          </div>

          {/* Opening hours */}
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-green-600" />
            <span className="text-base text-green-600 font-medium">Open Now</span>
            <span className="text-base text-gray-500">until 10:00 pm</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Ample parking space</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Wheelchair access</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Family friendly</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-gray-600 mb-6 line-clamp-3 leading-relaxed">
            {store.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, laudantium! Quia, cupiditate nisl ipsam delectus possimus aliquam repellendus itaque ullam perferendis qui distinctio cum eveniet placeat incidunt tempore veritatis nemo corrupti inventore."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between ">
          <div className="flex gap-4 relative ml-[600px]  justify-end float-right">
            <Button variant="outline" size="default" className="px-6">
              Directions
            </Button>
            <Button variant="outline" size="default" className="px-6">
              Visit Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
    <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
      See all
    </Button>
  </div>
);

const FilterCheckbox = ({ label }: { label: string }) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={label} />
    <label htmlFor={label} className="text-sm text-gray-700">
      {label}
    </label>
  </div>
);

const CategoryButton = ({ label, active = false }: { label: string; active?: boolean }) => (
  <button
    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
      active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
    }`}
  >
    {label}
  </button>
);

const BusinessesPage = () => {
  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Static Sidebar Filters */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white border-r border-gray-200 h-screen sticky top-0 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
            
            <FilterSection title="Suggested">
              <FilterCheckbox label="Open Now" />
              <FilterCheckbox label="Ample Parking" />
              <FilterCheckbox label="Allows Booking" />
            </FilterSection>

            <FilterSection title="Category">
              <div className="space-y-3">
                <CategoryButton label="Restaurants" active />
                <CategoryButton label="Cuiesnness" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <CategoryButton label="Steakouts" />
                <CategoryButton label="Pizza" />
                <CategoryButton label="Locals" />
              </div>
            </FilterSection>

            <FilterSection title="Features">
              <FilterCheckbox label="Order on Glovo" />
              <FilterCheckbox label="Accepts Mobile Money" />
              <FilterCheckbox label="Outdoor setting" />
            </FilterSection>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <p className="text-lg text-gray-600">
              Found <span className="font-semibold">53 results</span> of{" "}
              <span className="text-blue-600">"Top Restaurants"</span> in Kabalagala, UK Mall
            </p>
          </div>

          {/* Store listings */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex bg-white border rounded-lg animate-pulse overflow-hidden h-64"
                  >
                    <div className="w-96 h-full bg-gray-200" />
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-8 bg-gray-200 w-1/2 rounded" />
                      <div className="h-6 bg-gray-200 w-1/3 rounded" />
                      <div className="h-4 bg-gray-200 w-3/4 rounded" />
                      <div className="h-4 bg-gray-200 w-2/3 rounded" />
                      <div className="h-4 bg-gray-200 w-1/2 rounded" />
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
      </div>
    </div>
  );
};

export default BusinessesPage;