"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Share2, Heart, Calendar, Users, Building2, Star } from "lucide-react";

// Mock campaigns data
const campaignsData = [
  {
    id: "1",
    title: "Back-wood Camp Sale",
    category: "Furniture",
    brand: "Outdoor Living Co.",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=500&fit=crop",
    publications: 486,
    type: "Open Campaign",
    startDate: "12.6.2025",
    endDate: "30.8.2025",
    status: "Active",
    rating: 4.5,
    reviews: "+12 more",
    description: "Promote outdoor furniture and camping gear for summer season",
  },
  {
    id: "2",
    title: "Xmas Super Sale",
    category: "Shopping",
    brand: "Holiday Retail",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=500&fit=crop",
    publications: 488,
    type: "Open Campaign",
    startDate: "19.9.2025",
    endDate: "30.6.2025",
    status: "Waiting",
    rating: 4.2,
    reviews: "+43 more",
    description: "Seasonal holiday campaign for Christmas shopping deals",
  },
  {
    id: "3",
    title: "On-Go Bottle Campaign",
    category: "Furniture",
    brand: "EcoWare",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=500&fit=crop",
    publications: 488,
    type: "Open Campaign",
    startDate: "12.2.2025",
    endDate: "30.8.2025",
    status: "Completed",
    rating: 4.8,
    reviews: "+47 more",
    description: "Sustainable water bottles and eco-friendly products promotion",
  },
  {
    id: "4",
    title: "Summer Essentials",
    category: "Fashion",
    brand: "StyleHub",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=500&fit=crop",
    publications: 325,
    type: "Open Campaign",
    startDate: "16.7.2025",
    endDate: "19.9.2025",
    status: "Active",
    rating: 4.9,
    reviews: "+89 more",
    description: "Summer fashion collection featuring lightweight clothing and accessories",
  },
  {
    id: "5",
    title: "Tech Gadgets Launch",
    category: "Technology",
    brand: "TechPro",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=500&fit=crop",
    publications: 612,
    type: "Exclusive Campaign",
    startDate: "1.8.2025",
    endDate: "31.8.2025",
    status: "Pending",
    rating: 4.6,
    reviews: "+23 more",
    description: "Latest tech products and gadgets launch campaign",
  },
  {
    id: "6",
    title: "Wellness & Fitness",
    category: "Health",
    brand: "FitLife",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop",
    publications: 445,
    type: "Open Campaign",
    startDate: "10.6.2025",
    endDate: "10.10.2025",
    status: "Active",
    rating: 4.7,
    reviews: "+156 more",
    description: "Health and wellness products for active lifestyle",
  },
  {
    id: "7",
    title: "Fall Fashion Collection",
    category: "Fashion",
    brand: "Trendy Closet",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=500&fit=crop",
    publications: 523,
    type: "Open Campaign",
    startDate: "16.7.2025",
    endDate: "30.6.2025",
    status: "Deleted",
    rating: 4.0,
    reviews: "+34 more",
    description: "Autumn fashion trends and wardrobe essentials",
  },
  {
    id: "8",
    title: "Home Decor Spring",
    category: "Furniture",
    brand: "HomeStyle",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop",
    publications: 389,
    type: "Open Campaign",
    startDate: "1.8.2025",
    endDate: "30.9.2025",
    status: "New",
    rating: 4.3,
    reviews: "+8 more",
    description: "Spring home decoration and interior design collection",
  },
  {
    id: "9",
    title: "Beauty Essentials Kit",
    category: "Beauty",
    brand: "GlowUp",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=500&fit=crop",
    publications: 701,
    type: "Exclusive Campaign",
    startDate: "20.7.2025",
    endDate: "20.8.2025",
    status: "Active",
    rating: 4.9,
    reviews: "+203 more",
    description: "Complete beauty and skincare essentials for daily routine",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-700",
  Waiting: "bg-pink-100 text-pink-700",
  Completed: "bg-purple-100 text-purple-700",
  Pending: "bg-orange-100 text-orange-700",
  New: "bg-blue-100 text-blue-700",
  Deleted: "bg-red-100 text-red-700",
};

const CampaignsPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Active", "New", "Pending", "Waiting", "Completed", "Deleted"];

  const filteredCampaigns = activeTab === "All" 
    ? campaignsData 
    : campaignsData.filter(campaign => campaign.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Campaigns</h1>
          <p className="text-gray-600">Discover and manage all active campaigns for your brand collaborations</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Campaign Count */}
        <p className="text-sm text-gray-600 mb-6">Showing {filteredCampaigns.length} campaigns</p>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Campaign Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Campaign Content */}
              <div className="p-4 space-y-3">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/campaigns/${campaign.id}`}>
                      <h2 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                        {campaign.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-600">{campaign.category}</p>
                  </div>
                  <Link 
                    href={`/campaigns/${campaign.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap"
                  >
                    See details →
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{campaign.publications} Publications</span>
                  </div>
                </div>

                {/* Campaign Type */}
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{campaign.type}</span>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{campaign.startDate} - {campaign.endDate}</span>
                </div>

                {/* Status Badge and Rating */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                    {campaign.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-sm">
                      {"★★★★"}
                      <span className="text-gray-300">★</span>
                    </div>
                    <span className="text-xs text-gray-600">{campaign.reviews}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No campaigns found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
