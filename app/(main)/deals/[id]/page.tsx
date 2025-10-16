"use client";

import React from "react";
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
  Star,
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
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop",
    discount: "Up to 70% OFF",
    promoCode: "BLACKFRIDAY70",
    category: "Retail & Shopping",
    location: "Kampala, Uganda",
    followers: "5M Followers",
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
};

const DealDetailPage = () => {
  const params = useParams();
  const router = useRouter();
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
    // You can add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push('/deals')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Offers</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Image Card */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                  {deal.discount}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <span className="font-bold text-gray-700">{deal.storeAvatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{deal.storeName}</h3>
                        {deal.isVerified && (
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-white/90 text-sm">{deal.tagline}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deal Info Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h1>
                  <p className="text-gray-600 mb-1">{deal.category}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {"★★★★"}
                      <span className="text-gray-300">★</span>
                    </div>
                    <span className="text-sm text-gray-600">({deal.reviewCount})</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  deal.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {deal.status}
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{deal.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{deal.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{deal.followers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{deal.totalUses}</span>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="font-semibold">{deal.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="font-semibold">{deal.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time Left</p>
                  <p className="font-semibold text-pink-600">{deal.daysLeft} days</p>
                </div>
              </div>
            </Card>

            {/* Promo Code Card */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Get Your Promo Code</h2>
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Discount Code</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-3xl font-bold tracking-wider">{deal.promoCode}</p>
                  </div>
                  <Button
                    onClick={copyPromoCode}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-green-600 font-medium mb-2">{deal.discount}</p>
                <p className="text-sm text-gray-600">{deal.fullDescription}</p>
              </div>
              <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2">
                Redeem Now
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About the Brand */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">About the Brand</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-bold text-xl text-gray-700">{deal.storeAvatar}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <h4 className="font-semibold">{deal.storeName}</h4>
                    {deal.isVerified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{deal.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">{deal.brandInfo}</p>
              <Button variant="outline" className="w-full">
                View Brand Profile
              </Button>
            </Card>

            {/* Offer Statistics */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Offer Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Uses</span>
                  <span className="font-semibold">{deal.totalUses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-semibold">{deal.followers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    deal.status === "Active" ? "text-green-600" : "text-gray-600"
                  }`}>{deal.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="font-semibold text-pink-600">{deal.daysLeft}</span>
                </div>
              </div>
            </Card>

            {/* Share Card */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Share this deal</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="flex-1">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="flex-1">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;
