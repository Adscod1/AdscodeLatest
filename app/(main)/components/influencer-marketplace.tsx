import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, UserPlus, SlidersHorizontal, CheckCircle2, Eye, MessageCircle, Mail } from "lucide-react";
import Image from "next/image";

interface Influencer {
  id: string;
  name: string;
  username: string;
  category: string;
  description: string;
  avatar: string;
  coverImage: string;
  rating: number;
  followers: string;
  engagementRate: string;
  responseRate: string;
  status: "Top Influencer" | "Trending" | "Active";
  statusColor: string;
  verified: boolean;
}

const mockInfluencers: Influencer[] = [
  {
    id: "1",
    name: "Sophia Chen",
    username: "@sophiachen",
    category: "Fashion",
    description: "Fashion Stylist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
    rating: 4.9,
    followers: "1.3M",
    engagementRate: "98%",
    responseRate: "98%",
    status: "Top Influencer",
    statusColor: "bg-blue-100 text-blue-600",
    verified: true,
  },
  {
    id: "2",
    name: "Marcus Williams",
    username: "@marcuswilliams",
    category: "Tech",
    description: "Tech Reviewer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    rating: 4.7,
    followers: "890.0K",
    engagementRate: "98%",
    responseRate: "98%",
    status: "Trending",
    statusColor: "bg-orange-100 text-orange-600",
    verified: true,
  },
  {
    id: "3",
    name: "Aria Johnson",
    username: "@ariajohnson",
    category: "Beauty",
    description: "Beauty Expert",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    rating: 4.8,
    followers: "2.1M",
    engagementRate: "98%",
    responseRate: "98%",
    status: "Top Influencer",
    statusColor: "bg-blue-100 text-blue-600",
    verified: true,
  },
  {
    id: "4",
    name: "Alex Martinez",
    username: "@alexmartinez",
    category: "Fitness",
    description: "Fitness Coach",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    rating: 4.6,
    followers: "1.5M",
    engagementRate: "97%",
    responseRate: "95%",
    status: "Active",
    statusColor: "bg-green-100 text-green-600",
    verified: true,
  },
  {
    id: "5",
    name: "Emma Davis",
    username: "@emmadavis",
    category: "Travel",
    description: "Travel Blogger",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
    rating: 4.9,
    followers: "3.2M",
    engagementRate: "99%",
    responseRate: "97%",
    status: "Top Influencer",
    statusColor: "bg-blue-100 text-blue-600",
    verified: true,
  },
  {
    id: "6",
    name: "James Lee",
    username: "@jameslee",
    category: "Food",
    description: "Food Critic",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    rating: 4.5,
    followers: "750K",
    engagementRate: "96%",
    responseRate: "94%",
    status: "Trending",
    statusColor: "bg-orange-100 text-orange-600",
    verified: false,
  },
  {
    id: "7",
    name: "Sarah Wilson",
    username: "@sarahwilson",
    category: "Lifestyle",
    description: "Lifestyle Influencer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop",
    rating: 4.7,
    followers: "1.8M",
    engagementRate: "97%",
    responseRate: "96%",
    status: "Active",
    statusColor: "bg-green-100 text-green-600",
    verified: true,
  },
  {
    id: "8",
    name: "Michael Brown",
    username: "@michaelbrown",
    category: "Tech",
    description: "Tech Guru",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    rating: 4.8,
    followers: "2.5M",
    engagementRate: "98%",
    responseRate: "97%",
    status: "Top Influencer",
    statusColor: "bg-blue-100 text-blue-600",
    verified: true,
  },
];

const categories = [
  { name: "All", active: true },
  { name: "Fashion", active: false },
  { name: "Beauty", active: false },
  { name: "Tech", active: false },
  { name: "Fitness", active: false },
  { name: "Travel", active: false },
  { name: "Food", active: false },
  { name: "Lifestyle", active: false },
];

export const InfluencerMarketplace = () => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Influencer Marketplace
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with top influencers across various categories to amplify your brand&apos;s reach and engagement.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search influencers..."
                className="pl-10 pr-4 py-6 bg-white border-gray-200 rounded-lg w-full"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={category.active ? "default" : "outline"}
                  className={`whitespace-nowrap ${
                    category.active
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
              <Button variant="outline" className="bg-white hover:bg-gray-50 whitespace-nowrap">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">Showing 8 influencers</p>

        {/* Influencer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockInfluencers.map((influencer) => (
            <Card
              key={influencer.id}
              className="overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-shadow p-0"
            >
              {/* Cover Image (fill full upper section) */}
              <div className="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100">
                <Image
                  src={influencer.coverImage}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Avatar */}
              <div className="relative -mt-14 flex justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                  <Image
                    src={influencer.avatar}
                    alt={influencer.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 pt-2 text-center">
                {/* Name */}
                <div className="flex items-center justify-center gap-1 mb-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {influencer.name}
                  </h3>
                  {influencer.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500" />
                  )}
                </div>

                {/* Username & Description */}
                <p className="text-sm text-gray-500 mb-1">{influencer.username}</p>
                <p className="text-sm text-gray-600 mb-3">{influencer.description}</p>

                {/* Tags */}
                <div className="flex gap-2 justify-center mb-3 flex-wrap">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {influencer.category}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-full ${influencer.statusColor}`}>
                    {influencer.status}
                  </span>
                  {influencer.status === "Top Influencer" && (
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                      5.0 ★
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{influencer.rating}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="flex justify-center text-gray-400 mb-1">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-gray-900">{influencer.followers}</div>
                  </div>
                  <div>
                    <div className="flex justify-center text-gray-400 mb-1">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-gray-900">{influencer.engagementRate}</div>
                  </div>
                  <div>
                    <div className="flex justify-center text-gray-400 mb-1">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-gray-900">{influencer.responseRate}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                    View Profile →
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
