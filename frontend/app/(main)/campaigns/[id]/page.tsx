"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Users,
  Building2,
  Star,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

// Mock campaign details data
const campaignDetails: { [key: string]: any } = {
  "1": {
    id: "1",
    title: "Back-wood Camp Sale",
    category: "Furniture",
    brand: {
      name: "Outdoor Living Co.",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=OLC",
      verified: true,
      tagline: "Your outdoor lifestyle partner",
      description: "Leading provider of premium outdoor furniture and camping equipment across East Africa.",
    },
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&h=600&fit=crop",
    publications: 486,
    type: "Open Campaign",
    startDate: "12.6.2025",
    endDate: "30.8.2025",
    status: "Active",
    rating: 4.5,
    reviews: 124,
    description: "Join our exciting summer campaign promoting outdoor furniture and camping gear. We're looking for content creators who love the outdoors and can showcase our products in authentic settings.",
    longDescription: "This campaign focuses on promoting our premium outdoor furniture collection and camping equipment for the summer season. We're seeking influencers who can create engaging content showcasing our products in real outdoor settings, whether it's camping trips, backyard gatherings, or outdoor adventures. The ideal creators have an audience interested in outdoor activities, home improvement, or lifestyle content.",
    requirements: [
      "Post at least 3 pieces of content (Instagram posts, stories, or reels)",
      "Tag @outdoorlivingco in all posts",
      "Use campaign hashtags: #OutdoorLiving #CampLife",
      "Include product links in bio or stories",
      "Submit content drafts for approval before posting",
    ],
    deliverables: [
      "3 Instagram feed posts",
      "5 Instagram stories",
      "1 Instagram Reel (optional bonus)",
      "Engagement with comments for 48 hours",
    ],
    compensation: "$500 - $2,000 per creator",
    targetAudience: "Outdoor enthusiasts, camping lovers, home decorators aged 25-45",
    location: "East Africa",
    followers: "5M",
    totalUses: "486 Publications",
    daysLeft: 75,
    objectives: [
      "Increase brand awareness by 40%",
      "Drive 10K+ website visits",
      "Generate 500+ product inquiries",
      "Achieve 2M+ impressions",
    ],
    statistics: {
      totalReach: "2.8M",
      engagement: "156K",
      conversions: "3.2K",
      roi: "385%",
    },
  },
  "2": {
    id: "2",
    title: "Xmas Super Sale",
    category: "Shopping",
    brand: {
      name: "Holiday Retail",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=HR",
      verified: true,
      tagline: "Your holiday shopping destination",
      description: "The largest holiday retail chain across the region, bringing joy to millions of families.",
    },
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&h=600&fit=crop",
    publications: 488,
    type: "Open Campaign",
    startDate: "19.9.2025",
    endDate: "30.6.2025",
    status: "Waiting",
    rating: 4.2,
    reviews: 89,
    description: "Seasonal holiday campaign for Christmas shopping deals. Help spread the festive cheer!",
    longDescription: "Our biggest holiday campaign of the year! We're looking for creators to help promote our Christmas super sale featuring amazing discounts across all categories. This is a fantastic opportunity to partner with a major retail brand during the busiest shopping season.",
    requirements: [
      "Create festive holiday-themed content",
      "Showcase various product categories",
      "Post during peak shopping hours",
      "Include promotional codes in content",
    ],
    deliverables: [
      "4 Instagram posts",
      "8 Stories over 2 weeks",
      "1 TikTok video",
    ],
    compensation: "$800 - $3,000 per creator",
    targetAudience: "Holiday shoppers, families, gift buyers aged 20-50",
    location: "East Africa",
    followers: "8M",
    totalUses: "488 Publications",
    daysLeft: 45,
    objectives: [
      "Drive holiday season sales",
      "Reach 5M+ potential customers",
      "Generate festive brand buzz",
    ],
    statistics: {
      totalReach: "4.2M",
      engagement: "298K",
      conversions: "5.6K",
      roi: "425%",
    },
  },
  "3": {
    id: "3",
    title: "On-Go Bottle Campaign",
    category: "Furniture",
    brand: {
      name: "EcoWare",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EW",
      verified: true,
      tagline: "Sustainable living solutions",
      description: "Pioneering eco-friendly products that make a difference for our planet.",
    },
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&h=600&fit=crop",
    publications: 488,
    type: "Open Campaign",
    startDate: "12.2.2025",
    endDate: "30.8.2025",
    status: "Completed",
    rating: 4.8,
    reviews: 203,
    description: "Sustainable water bottles and eco-friendly products promotion",
    longDescription: "This successful campaign promoted our revolutionary eco-friendly water bottles and sustainable lifestyle products. We partnered with environmentally conscious creators to spread awareness about reducing plastic waste.",
    requirements: [
      "Emphasize sustainability message",
      "Show product in daily use scenarios",
      "Highlight eco-friendly features",
    ],
    deliverables: [
      "3 Instagram posts",
      "6 Stories",
      "1 Long-form video",
    ],
    compensation: "$600 - $2,500 per creator",
    targetAudience: "Eco-conscious consumers, fitness enthusiasts aged 20-40",
    location: "Global",
    followers: "3.5M",
    totalUses: "488 Publications",
    daysLeft: 0,
    objectives: [
      "Promote sustainable living",
      "Build eco-conscious community",
      "Drive product awareness",
    ],
    statistics: {
      totalReach: "3.8M",
      engagement: "412K",
      conversions: "6.8K",
      roi: "495%",
    },
  },
};

const statusColors = {
  Active: "bg-green-100 text-green-700 border-green-200",
  Waiting: "bg-pink-100 text-pink-700 border-pink-200",
  Completed: "bg-purple-100 text-purple-700 border-purple-200",
  Pending: "bg-orange-100 text-orange-700 border-orange-200",
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Deleted: "bg-red-100 text-red-700 border-red-200",
};

const CampaignDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const campaign = campaignDetails[params.id as keyof typeof campaignDetails];

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign not found</h2>
          <Link href="/campaigns">
            <Button>Back to Campaigns</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Link href="/campaigns">
          <Button variant="ghost" className="mb-6 hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image Card */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 border-2 border-white">
                      <Image
                        src={campaign.brand.avatar}
                        alt={campaign.brand.name}
                        fill
                        className="object-cover"
                      />
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{campaign.brand.name}</h3>
                        {campaign.brand.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-white/90">{campaign.brand.tagline}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Campaign Info Card */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">{campaign.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{campaign.rating}</span>
                        <span className="text-gray-500">({campaign.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                    {campaign.status}
                  </span>
                </div>

                <p className="text-gray-700 text-lg">{campaign.description}</p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{campaign.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{campaign.followers} Followers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{campaign.totalUses}</span>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{campaign.startDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{campaign.endDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time Left</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-pink-600">
                        {campaign.daysLeft > 0 ? `${campaign.daysLeft} days` : "Ended"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About Campaign */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Campaign</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{campaign.longDescription}</p>

              <div className="space-y-6">
                {/* Requirements */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {campaign.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Deliverables</h3>
                  <ul className="space-y-2">
                    {campaign.deliverables.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Campaign Objectives */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Campaign Objectives</h3>
                  <ul className="space-y-2">
                    {campaign.objectives.map((obj: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compensation */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Compensation</h3>
                  <p className="text-2xl font-bold text-green-600">{campaign.compensation}</p>
                  <p className="text-sm text-gray-600 mt-1">Based on follower count and engagement rate</p>
                </div>

                {/* Target Audience */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Target Audience</h3>
                  <p className="text-gray-700">{campaign.targetAudience}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Brand */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">About the Brand</h2>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-16 h-16">
                  <Image
                    src={campaign.brand.avatar}
                    alt={campaign.brand.name}
                    fill
                    className="object-cover"
                  />
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{campaign.brand.name}</h3>
                    {campaign.brand.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{campaign.brand.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">{campaign.brand.description}</p>
              <Button className="w-full" variant="outline">
                View Brand Profile
              </Button>
            </Card>

            {/* Campaign Statistics */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Campaign Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Reach</span>
                    <span className="font-bold text-gray-900">{campaign.statistics.totalReach}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <span className="font-bold text-gray-900">{campaign.statistics.engagement}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-2/3"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Conversions</span>
                    <span className="font-bold text-gray-900">{campaign.statistics.conversions}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-1/2"></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ROI</span>
                    <span className="text-xl font-bold text-green-600">{campaign.statistics.roi}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Publications</span>
                  <span className="font-medium text-gray-900">{campaign.publications}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-medium text-gray-900">{campaign.followers}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="font-medium text-pink-600">
                    {campaign.daysLeft > 0 ? campaign.daysLeft : "Ended"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Apply to Campaign
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
