"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  }
};

// User Demographics Component
const UserDemographics = () => {
  const [activeTab, setActiveTab] = useState('all');

  const ageData = [
    { age: '18-20', users: 450 },
    { age: '21-25', users: 380 },
    { age: '26-30', users: 420 },
    { age: '31-35', users: 280 },
    { age: '36-40', users: 550 },
    { age: '41-45', users: 150 },
    { age: '46-50', users: 680 }
  ];

  const genderData = [
    { name: 'Male', value: 750, percentage: 30 },
    { name: 'Female', value: 1740, percentage: 70 }
  ];

  const languageData = [
    { language: 'English', users: 2800 },
    { language: 'French', users: 1200 },
    { language: 'Kiswahili', users: 2600 },
    { language: 'Arabic', users: 2700 },
    { language: 'Chinese', users: 2400 },
    { language: 'Luganda', users: 2300 },
    { language: 'Others', users: 2200 }
  ];

  const locationData = [
    { country: 'Uganda', users: 577 },
    { country: 'Kenya', users: 554 },
    { country: 'Rwanda', users: 537 },
    { country: 'Egypt', users: 501 },
    { country: 'Nigeria', users: 488 },
    { country: 'Mexico', users: 452 },
    { country: 'Tanzania', users: 408 },
    { country: 'France', users: 399 },
    { country: 'Germany', users: 388 },
    { country: 'Others', users: 320 }
  ];

  const COLORS = ['#3B82F6', '#93C5FD'];
  const LANGUAGE_COLOR = '#14B8A6';

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">User Demographics</h2>
        <button className="text-gray-400 hover:text-gray-600">⋯</button>
      </div>
      
      <p className="text-sm text-gray-500 mb-6">
        User demographics help businesses and organizations understand their audience better and tailor their offerings to meet their needs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Age Distribution */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800">Age</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="age" type="category" width={50} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800">Gender</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="text-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Male</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{genderData[0].value} - {genderData[0].percentage}%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-300"></div>
                <span className="text-xs text-gray-600">Female</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{genderData[1].value} - {genderData[1].percentage}%</p>
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800">Language</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={languageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="language" type="category" width={60} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="users" fill={LANGUAGE_COLOR} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <h3 className="text-base font-semibold mb-3 text-gray-800">Location</h3>
        
        <div className="flex gap-4 mb-4 border-b">
          <button 
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All users
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'new' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New Users
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'active' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Users
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country List */}
          <div>
            {locationData.map((item, index) => (
              <div key={index} className="mb-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">{item.country}</span>
                  <span className="text-sm font-medium text-gray-600">{item.users}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-300 bg-pink-500"
                    style={{ 
                      width: `${(item.users / 577) * 100}%`,
                      opacity: index === 0 ? 1 : 0.6
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* World Map */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <div className="relative w-full h-48">
              <svg viewBox="0 0 800 400" className="w-full h-full">
                <g className="map" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1">
                  <ellipse cx="450" cy="240" rx="60" ry="80" />
                  <ellipse cx="430" cy="140" rx="40" ry="35" />
                  <ellipse cx="580" cy="160" rx="80" ry="60" />
                  <ellipse cx="220" cy="140" rx="70" ry="50" />
                  <ellipse cx="260" cy="280" rx="45" ry="70" />
                  <ellipse cx="680" cy="300" rx="35" ry="30" />
                </g>
                <circle cx="450" cy="220" r="16" fill="#3B82F6" opacity="0.8" />
                <circle cx="460" cy="230" r="12" fill="#3B82F6" opacity="0.8" />
                <circle cx="220" cy="180" r="8" fill="#3B82F6" opacity="0.6" />
                <circle cx="430" cy="150" r="10" fill="#3B82F6" opacity="0.6" />
                <circle cx="580" cy="170" r="8" fill="#3B82F6" opacity="0.5" />
                <circle cx="520" cy="190" r="7" fill="#3B82F6" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function CampaignInfluencerProfilePage() {
  const params = useParams();
  const storeId = params?.storeId as string;
  const campaignId = params?.id as string;
  
  const influencer = influencersData["1"];

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
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={`/${storeId}/campaign/${campaignId}/influencers/performance`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Performance</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={influencer.avatar} alt={influencer.name} />
                    <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

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

                  <div className="flex gap-3">
                    <Link
                      href={`/${storeId}/campaign/${campaignId}/influencers/details`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        View Campaign Details
                      </Button>
                    </Link>
                    <Button variant="outline">
                      <Instagram className="w-4 h-4" />
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

            {/* User Demographics Section */}
            <UserDemographics />

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