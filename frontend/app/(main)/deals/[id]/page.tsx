"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Copy, 
  MapPin, 
  Users, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  ExternalLink 
} from "lucide-react";

// Mock deal data
const dealDetails = {
  "1": {
    id: "1",
    storeName: "Jumia Uganda",
    storeAvatar: "JU",
    storeCategory: "Retail & Shopping",
    tagline: "Shopping Made Easy!",
    title: "Jumia Black Friday",
    description: "Get incredible discounts up to 70% off on electronics, fashion, home & living, and more during our biggest sale of the year!",
    fullDescription: "Use this code at checkout to get up to 70% off on selected items. Valid for all categories including electronics, fashion, and home essentials.",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop",
    discount: "Up to 70% OFF",
    promoCode: "BLACKFRIDAY70",
    category: "Retail & Shopping",
    location: "Kampala, Uganda",
    followers: "5M Followers",
    followersCount: "240K Followers",
    totalUses: "40K Times used",
    rating: 4.8,
    reviewCount: 190,
    startDate: "25.11.2025",
    endDate: "30.12.2025",
    daysLeft: 30,
    status: "Active",
    isVerified: true,
    brandInfo: "East Africa's leading online shopping destination offering the widest selection of products.",
  },
  "2": {
    id: "2",
    storeName: "MTN Uganda",
    storeAvatar: "M",
    storeCategory: "Telecommunications",
    tagline: "Everywhere You Go",
    title: "MTN Data Bonanza",
    description: "Double your data! Get 100% bonus data on all data bundles. Perfect for streaming, browsing, and staying connected.",
    fullDescription: "Use this code to get 50% off on all data bundles. Valid for new and existing customers.",
    images: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
    discount: "50% OFF",
    promoCode: "DATADEAL50",
    category: "Technology",
    location: "Kampala, Uganda",
    followers: "8M Followers",
    followersCount: "500K Followers",
    totalUses: "120K Times used",
    rating: 4.7,
    reviewCount: 892,
    startDate: "20.11.2025",
    endDate: "25.12.2025",
    daysLeft: 25,
    status: "Active",
    isVerified: true,
    brandInfo: "Uganda's leading telecommunications company providing mobile services.",
  },
  "3": {
    id: "3",
    storeName: "Uber Eats",
    storeAvatar: "UE",
    storeCategory: "Food & Delivery",
    tagline: "Get Anything Delivered",
    title: "Free Delivery Weekend",
    description: "Order your favorite meals with zero delivery fees all weekend long. Valid on orders above UGX 20,000.",
    fullDescription: "Use this code at checkout to get free delivery on all orders above UGX 20,000.",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
    ],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
    discount: "FREE DELIVERY",
    promoCode: "FREEDEL2025",
    category: "Food & Beverage",
    location: "Kampala, Uganda",
    followers: "2.5M Followers",
    followersCount: "150K Followers",
    totalUses: "85K Times used",
    rating: 4.5,
    reviewCount: 1203,
    startDate: "23.11.2025",
    endDate: "24.11.2025",
    daysLeft: 2,
    status: "Active",
    isVerified: true,
    brandInfo: "Your favorite food delivery service bringing meals from the best restaurants.",
  },
};

const DealDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const deal = dealDetails[params.id as keyof typeof dealDetails];

  if (!deal) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Deal not found</h1>
        <Button onClick={() => router.push('/deals')} className="mt-4">
          Back to Deals
        </Button>
      </div>
    );
  }

  const copyPromoCode = () => {
    navigator.clipboard.writeText(deal.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % deal.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + deal.images.length) % deal.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push('/deals')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Offers</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/9] bg-gray-900">
                <Image
                  src={deal.images[currentImageIndex]}
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                {/* Navigation Arrows */}
                {deal.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
                {/* Image Dots */}
                {deal.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {deal.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Deal Title Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{deal.title}</h1>
                  <p className="text-gray-500 text-sm">{deal.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  deal.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {deal.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">{deal.description}</p>
            </Card>

            {/* Deal Info Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{deal.title}</h2>
                  <p className="text-gray-500 text-sm">{deal.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  deal.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {deal.status}
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{deal.description}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{deal.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{deal.followers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{deal.followersCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{deal.totalUses}</span>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">{deal.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900">{deal.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time Left</p>
                  <p className="font-semibold text-blue-600">{deal.daysLeft} days</p>
                </div>
              </div>
            </Card>

            {/* Promo Code Card */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Get Your Promo Code</h2>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-4">
                <p className="text-xs text-gray-500 mb-2">Discount Code</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold tracking-wider text-gray-900">{deal.promoCode}</p>
                  <Button
                    onClick={copyPromoCode}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-green-600 font-medium mb-2">{deal.discount}</p>
              <p className="text-sm text-gray-600 mb-6">{deal.fullDescription}</p>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium flex items-center justify-center gap-2">
                Redeem Now
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* About the Brand */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">About the Brand</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                  <span className="font-bold text-amber-700">{deal.storeAvatar}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="font-semibold text-gray-900">{deal.storeName}</h4>
                    {deal.isVerified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{deal.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{deal.brandInfo}</p>
              <Button variant="outline" className="w-full">
                View Brand Profile
              </Button>
            </Card>

            {/* Offer Statistics */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Offer Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Uses</span>
                  <span className="font-semibold text-gray-900">{deal.totalUses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Followers</span>
                  <span className="font-semibold text-gray-900">{deal.followers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    deal.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {deal.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Days Remaining</span>
                  <span className="font-semibold text-blue-600">{deal.daysLeft}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;
