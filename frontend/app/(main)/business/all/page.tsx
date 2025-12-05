"use client";

import api from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { 
  Clock, 
  Users, 
  Car,
  Smartphone,
  UtensilsCrossed,
  SlidersHorizontal,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
    <div className="flex flex-col lg:flex-row bg-white  rounded-lg overflow-hidden  hover:bg-gray-100 transition-shadow">
      {/* Image Gallery */}
      <div className="w-full lg:w-1/2 xl:w-[500px] h-64 lg:h-[340px] relative flex-shrink-0">
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
          <div className="w-24 lg:w-32 grid grid-cols-1 gap-1">
            <div className="relative h-full">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400"
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
      </div>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="min-w-0">
              <Link href={`/business/${store.id}`}>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors truncate">
                  {store.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={4}  />
                <span className="text-sm lg:text-base font-medium">4.0</span>
                <span className="text-xs lg:text-sm text-gray-500">(45 Reviews)</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-3 lg:mb-4">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full">
               Seafood 
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full">
              Wines Bars
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full">
              Cocktails
            </span>
          </div>

          {/* Opening hours */}
          <div className="flex items-center gap-2 mb-3 lg:mb-4">
            <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 flex-shrink-0" />
            <span className="text-sm lg:text-base text-green-600 font-medium">Open Now</span>
            <span className="text-sm lg:text-base text-gray-500">until 10:00 pm</span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-3 lg:mb-4">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500 flex-shrink-0" />
              <span className="text-xs lg:text-sm text-gray-600">Ample parking</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500 flex-shrink-0" />
              <span className="text-xs lg:text-sm text-gray-600">Wheelchair access</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500 flex-shrink-0" />
              <span className="text-xs lg:text-sm text-gray-600">Family friendly</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 line-clamp-2 lg:line-clamp-3 leading-relaxed">
            {store.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, laudantium! Quia, cupiditate nisl ipsam delectus possimus aliquam repellendus itaque ullam perferendis qui distinctio cum eveniet placeat incidunt tempore veritatis nemo corrupti inventore."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-auto sm:justify-end sm:ml-auto">
          <Button variant="outline" size="default" className="w-full sm:w-auto px-4 lg:px-6">
           Get Directions
          </Button>
          <Button variant="outline" size="default" className="w-full sm:w-auto px-4 lg:px-6">
            Visit Website
          </Button>
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

const BusinessesPageContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await api.stores.getAllStores();
      return response.stores;
    },
  });

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!stores) return [];
    
    if (!searchQuery.trim()) {
      return stores;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return stores.filter((store) => {
      const matchesName = store.name.toLowerCase().includes(query);
      const matchesDescription = store.description?.toLowerCase().includes(query);
      const matchesTagline = store.tagline?.toLowerCase().includes(query);
      const matchesCategory = store.category?.toLowerCase().includes(query);
      
      return matchesName || matchesDescription || matchesTagline || matchesCategory;
    });
  }, [stores, searchQuery]);

  const resultCount = filteredStores.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Static Sidebar Filters */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-80 flex-shrink-0 
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="bg-white border-r border-gray-200 h-full lg:h-screen lg:sticky lg:top-0 p-4 lg:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Filters</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <FilterSection title="Suggested">
              <FilterCheckbox label="Open Now" />
              <FilterCheckbox label="Ample Parking" />
              <FilterCheckbox label="Allows Booking" />
            </FilterSection>

            <FilterSection title="Tags">
              <div className="space-y-3 space-x-2">
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
        <div className="flex-1 p-4 lg:p-6 min-w-0">
          {/* Header with Filter Button */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-base lg:text-lg text-gray-600">
                Found <span className="font-semibold">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
                {searchQuery && (
                  <>
                    {' '}for <span className="text-blue-600">"{searchQuery}"</span>
                  </>
                )}
              </p>
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>

          {/* Store listings */}
          <div className="space-y-4 lg:space-y-6">
            {isLoading ? (
              <div className="space-y-4 lg:space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col lg:flex-row bg-white border rounded-lg animate-pulse overflow-hidden"
                  >
                    <div className="w-full lg:w-2/5 xl:w-[380px] h-64 lg:h-[340px] bg-gray-200" />
                    <div className="flex-1 p-4 lg:p-6 space-y-4">
                      <div className="h-6 lg:h-8 bg-gray-200 w-1/2 rounded" />
                      <div className="h-4 lg:h-6 bg-gray-200 w-1/3 rounded" />
                      <div className="h-4 bg-gray-200 w-3/4 rounded" />
                      <div className="h-4 bg-gray-200 w-2/3 rounded" />
                      <div className="h-4 bg-gray-200 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <div key={store.id}>
                  <BusinessCard store={store} />
                  <hr className="border-gray-300 mt-6 lg:mt-6" />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-lg lg:text-xl text-gray-500 mb-2">No results found</p>
                {searchQuery && (
                  <p className="text-sm lg:text-base text-gray-400">
                    Try adjusting your search or filters to find what you're looking for
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BusinessesPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      <BusinessesPageContent />
    </Suspense>
  );
};

export const dynamic = 'force-dynamic';
export default BusinessesPage;