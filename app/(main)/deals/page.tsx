"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Share2, Heart, Clock, MapPin, Users, Star } from "lucide-react";

// Mock deals data
const dealsData = [
  {
    id: "1",
    storeName: "Jumia Uganda",
    storeAvatar: "JU",
    storeCategory: "Retail & Shopping",
    title: "Jumia Black Friday",
    description: "Get incredible discounts up to 70% off on electronics, fashion, home & living, and more during our biggest sale of the year!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop",
    discount: "70%",
    promoCode: "BLACKFRIDAY70",
    category: "Retail & Shopping",
    location: "Kampala, Uganda",
    followers: "5M",
    usesCount: "40K",
    rating: 4.8,
    reviewCount: 324,
    startDate: "25.11.2025",
    endDate: "30.12.2025",
    daysLeft: 30,
    status: "Active",
    isVerified: true,
  },
  {
    id: "2",
    storeName: "MTN Uganda",
    storeAvatar: "M",
    storeCategory: "Telecommunications",
    title: "MTN Data Bonanza",
    description: "Double your data! Get 100% bonus data on all data bundles. Perfect for streaming, browsing, and staying connected.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
    discount: "50%",
    promoCode: "DATADEAL50",
    category: "Technology",
    location: "Kampala, Uganda",
    followers: "8M",
    usesCount: "120K",
    rating: 4.7,
    reviewCount: 892,
    startDate: "20.11.2025",
    endDate: "25.12.2025",
    daysLeft: 25,
    status: "Active",
    isVerified: true,
  },
  {
    id: "3",
    storeName: "Uber Eats",
    storeAvatar: "UE",
    storeCategory: "Food & Delivery",
    title: "Free Delivery Weekend",
    description: "Order your favorite meals with zero delivery fees all weekend long. Valid on orders above UGX 20,000.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
    discount: "FREE",
    promoCode: "FREEDEL2025",
    category: "Food & Beverage",
    location: "Kampala, Uganda",
    followers: "2.5M",
    usesCount: "85K",
    rating: 4.5,
    reviewCount: 1203,
    startDate: "23.11.2025",
    endDate: "24.11.2025",
    daysLeft: 2,
    status: "Active",
    isVerified: true,
  },
];

const DealsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");

  const categories = ["All", "Retail & Shopping", "Technology", "Food & Beverage", "Fashion & Beauty", "Electronics"];
  const sortOptions = ["Trending", "Newest", "Ending Soon", "Highest Discount"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h1>
          <p className="text-gray-600">Discover exclusive deals and promotional codes from top brands</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealsData.map((deal) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Store Header */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-bold text-gray-700">{deal.storeAvatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-sm">{deal.storeName}</h3>
                      {deal.isVerified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{deal.storeCategory} • Just now</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  deal.daysLeft <= 7 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                }`}>
                  {deal.daysLeft} days left
                </div>
              </div>

              {/* Deal Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  {deal.discount} OFF
                </div>
              </div>

              {/* Deal Content */}
              <div className="p-4 space-y-3">
                {/* Title and Rating */}
                <div>
                  <h2 className="font-bold text-lg text-gray-900 mb-1">{deal.title}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-sm">
                      {"★★★★"}
                      <span className="text-gray-300">★</span>
                    </div>
                    <span className="text-xs text-gray-600">({deal.reviewCount})</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">{deal.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{deal.location.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{deal.followers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{deal.usesCount} used</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/deals/${deal.id}`} className="flex-1">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      Get code
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
