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
  UserPlus,
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
                <defs>
                  <pattern id="ocean" patternUnits="userSpaceOnUse" width="4" height="4">
                    <rect width="4" height="4" fill="#F0F9FF"/>
                    <circle cx="2" cy="2" r="0.5" fill="#E0F2FE" opacity="0.3"/>
                  </pattern>
                </defs>
                
                {/* Ocean Background */}
                <rect width="800" height="400" fill="url(#ocean)"/>
                
                {/* Continents */}
                <g className="continents" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="0.5">
                  {/* North America */}
                  <path d="M 120 80 Q 140 70 160 75 L 180 85 Q 200 90 220 100 L 240 120 Q 250 140 245 160 L 240 180 Q 230 200 220 210 L 200 220 Q 180 225 160 220 L 140 210 Q 120 200 110 180 L 105 160 Q 100 140 105 120 L 110 100 Q 115 90 120 80 Z"/>
                  
                  {/* South America */}
                  <path d="M 180 240 Q 190 230 200 235 L 210 245 Q 220 260 225 280 L 230 300 Q 235 320 230 340 L 225 360 Q 220 375 210 380 L 200 385 Q 190 380 185 370 L 180 350 Q 175 330 180 310 L 185 290 Q 180 270 175 250 L 180 240 Z"/>
                  
                  {/* Europe */}
                  <path d="M 350 100 Q 370 95 390 100 L 410 110 Q 420 120 425 135 L 430 150 Q 425 165 415 170 L 400 175 Q 385 170 375 160 L 365 145 Q 360 130 355 115 L 350 100 Z"/>
                  
                  {/* Africa */}
                  <path d="M 380 180 Q 400 175 420 180 L 440 190 Q 450 210 455 230 L 460 250 Q 465 270 460 290 L 455 310 Q 450 330 440 340 L 420 350 Q 400 355 380 350 L 360 340 Q 350 320 355 300 L 360 280 Q 365 260 370 240 L 375 220 Q 380 200 380 180 Z"/>
                  
                  {/* Asia */}
                  <path d="M 450 80 Q 480 75 510 80 L 540 90 Q 570 100 590 120 L 610 140 Q 620 160 615 180 L 610 200 Q 600 220 580 230 L 560 235 Q 540 230 520 220 L 500 210 Q 480 200 470 180 L 465 160 Q 460 140 465 120 L 470 100 Q 460 90 450 80 Z"/>
                  
                  {/* Australia */}
                  <path d="M 580 300 Q 600 295 620 300 L 640 310 Q 650 320 655 335 L 650 350 Q 640 360 625 365 L 605 360 Q 590 355 580 345 L 575 330 Q 575 315 580 300 Z"/>
                  
                  {/* Antarctica */}
                  <path d="M 100 360 Q 200 355 300 360 L 400 365 Q 500 370 600 365 L 700 360 Q 750 365 780 370 L 800 375 L 800 400 L 0 400 L 0 375 Q 50 370 100 360 Z"/>
                </g>
                
                {/* Data Points based on location data */}
                <g className="data-points">
                  {/* Uganda */}
                  <circle cx="420" cy="230" r="8" fill="#DC2626" opacity="0.8">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <text x="430" y="235" fontSize="10" fill="#374151" className="font-medium">577</text>
                  
                  {/* Kenya */}
                  <circle cx="430" cy="240" r="7" fill="#DC2626" opacity="0.75"/>
                  <text x="438" y="245" fontSize="9" fill="#374151">554</text>
                  
                  {/* Europe (France/Germany) */}
                  <circle cx="380" cy="130" r="6" fill="#3B82F6" opacity="0.7"/>
                  <text x="388" y="135" fontSize="9" fill="#374151">787</text>
                  
                  {/* North America (Mexico) */}
                  <circle cx="180" cy="200" r="5" fill="#10B981" opacity="0.6"/>
                  <text x="188" y="205" fontSize="8" fill="#374151">452</text>
                  
                  {/* Egypt */}
                  <circle cx="400" cy="190" r="6" fill="#F59E0B" opacity="0.7"/>
                  <text x="408" y="195" fontSize="9" fill="#374151">501</text>
                  
                  {/* Nigeria */}
                  <circle cx="360" cy="220" r="5" fill="#8B5CF6" opacity="0.6"/>
                  <text x="368" y="225" fontSize="8" fill="#374151">488</text>
                  
                  {/* Tanzania */}
                  <circle cx="440" cy="250" r="4" fill="#EC4899" opacity="0.6"/>
                  <text x="446" y="255" fontSize="8" fill="#374151">408</text>
                  
                  {/* Rwanda */}
                  <circle cx="425" cy="235" r="6" fill="#06B6D4" opacity="0.7"/>
                  <text x="433" y="240" fontSize="9" fill="#374151">537</text>
                </g>
                
                {/* Connection lines showing data flow */}
                <g className="connections" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.3">
                  <path d="M 420 230 Q 400 200 380 130" strokeDasharray="2,2">
                    <animate attributeName="stroke-dashoffset" values="0;-4" dur="1s" repeatCount="indefinite"/>
                  </path>
                  <path d="M 430 240 Q 300 220 180 200" strokeDasharray="2,2">
                    <animate attributeName="stroke-dashoffset" values="0;-4" dur="1.5s" repeatCount="indefinite"/>
                  </path>
                  <path d="M 400 190 Q 390 160 380 130" strokeDasharray="2,2">
                    <animate attributeName="stroke-dashoffset" values="0;-4" dur="2s" repeatCount="indefinite"/>
                  </path>
                </g>
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
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        Invite
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
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />  <span>Follow</span>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}