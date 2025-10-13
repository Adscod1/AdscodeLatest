"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Share2, 
  Instagram, 
  Twitter, 
  Facebook,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";

// Mock data - in production, fetch this from your database
const influencersData = {
  "1": {
    id: "1",
    name: "Sophia Chen",
    username: "@sophiachen",
    category: "Fashion",
    description: "Fashion Stylist",
    bio: "Professional fashion stylist and content creator with over 7 years of experience. Specializing in sustainable fashion and streetwear. Passionate about helping brands connect with millennial and Gen Z audiences.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
    rating: 4.9,
    followers: "1.3M",
    posts: "540",
    following: "1000+",
    engagementRate: "98%",
    location: "Los Angeles, CA",
    responseTime: "Within 24 hours",
    totalCampaigns: "150+",
    brandsWorkedWith: "Nike, Adidas, Zara, H&M",
    avgEngagement: "98%",
    status: "Top Influencer",
    statusColor: "bg-blue-100 text-blue-600",
    verified: true,
    reviews: [
      {
        id: "1",
        author: "Jenny Orlin",
        avatar: "JO",
        rating: 5,
        comment: "Magna sit quis sunt in. Officia esse duis nunc amet officia ut aliquip labore.",
        date: "4 day ago"
      },
      {
        id: "2",
        author: "Jason Farmer",
        avatar: "JF",
        rating: 5,
        comment: "Magna sit quis sunt in. Officia esse duis nunc amet officia ut aliquip labore.",
        date: "4 day ago"
      }
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558769132-cb1aea9c4e4f?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=300&fit=crop"
    ]
  },
  "2": {
    id: "2",
    name: "Marcus Williams",
    username: "@marcuswilliams",
    category: "Tech",
    description: "Tech Reviewer",
    bio: "Professional tech reviewer and gadget enthusiast with over 5 years of experience. Specializing in consumer electronics, smartphones, and wearables. Helping brands reach tech-savvy audiences.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    rating: 4.7,
    followers: "890.0K",
    posts: "420",
    following: "850+",
    engagementRate: "98%",
    location: "San Francisco, CA",
    responseTime: "Within 12 hours",
    totalCampaigns: "120+",
    brandsWorkedWith: "Apple, Samsung, Sony, Microsoft",
    avgEngagement: "98%",
    status: "Trending",
    statusColor: "bg-orange-100 text-orange-600",
    verified: true,
    reviews: [
      {
        id: "1",
        author: "Sarah Mitchell",
        avatar: "SM",
        rating: 5,
        comment: "Outstanding tech content creator. Very professional and delivers on time.",
        date: "2 days ago"
      }
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop"
    ]
  },
  "3": {
    id: "3",
    name: "Aria Johnson",
    username: "@ariajohnson",
    category: "Beauty",
    description: "Beauty Expert",
    bio: "Professional beauty expert and makeup artist with over 8 years of experience. Specializing in skincare, makeup tutorials, and beauty product reviews. Passionate about empowering people through beauty.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    rating: 4.8,
    followers: "2.1M",
    posts: "680",
    following: "1200+",
    engagementRate: "98%",
    location: "New York, NY",
    responseTime: "Within 24 hours",
    totalCampaigns: "200+",
    brandsWorkedWith: "MAC, Sephora, Fenty Beauty, Glossier",
    avgEngagement: "98%",
    status: "Top Influencer",
    statusColor: "bg-blue-100 text-blue-600",
    verified: true,
    reviews: [
      {
        id: "1",
        author: "Lisa Anderson",
        avatar: "LA",
        rating: 5,
        comment: "Amazing collaboration experience! Highly recommended for beauty brands.",
        date: "1 week ago"
      }
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop"
    ]
  }
};

export default function InfluencerProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const influencer = id ? influencersData[id as keyof typeof influencersData] : null;

  if (!influencer) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Influencer not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={influencer.avatar} alt={influencer.name} />
                    <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">{influencer.name}</h1>
                        {influencer.verified && (
                          <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-1">{influencer.username}</p>
                      <p className="text-gray-700">{influencer.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{influencer.posts}</p>
                      <p className="text-sm text-gray-600">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{influencer.followers}</p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{influencer.following}</p>
                      <p className="text-sm text-gray-600">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{influencer.engagementRate}</p>
                      <p className="text-sm text-gray-600">Engagement</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {influencer.category}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full ${influencer.statusColor}`}>
                      {influencer.status}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 w-10 bg-blue-500 hover:bg-blue-600">
                      Follow
                    </Button>
                    <Button variant="outline">
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Facebook className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{influencer.bio}</p>
            </Card>

            {/* Reviews Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <Button variant="link" className="float-right text-blue-500 cursor-pointer">See all</Button>
              </div>
              <div className="space-y-4">
                {influencer.reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{review.author}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* My Work Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Work</h2>
                <Button variant="link" className="text-blue-500">
                  See all
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {influencer.portfolio.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Information Card */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{influencer.location}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <p className="font-medium">{influencer.rating}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Response Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{influencer.responseTime}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Working Experience Card */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Working Experience</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{influencer.totalCampaigns}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Brands Worked With</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{influencer.brandsWorkedWith}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Engagement</p>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{influencer.avgEngagement}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600">
                Connect
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
