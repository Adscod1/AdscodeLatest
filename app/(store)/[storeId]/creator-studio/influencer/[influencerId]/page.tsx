"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, DollarSign, Heart } from "lucide-react";

export default function InfluencerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params?.storeId as string;
  const influencerId = params?.influencerId as string;

  // Mock data - in production, fetch based on influencerId
  const influencerData = {
    name: "Sarah Anderson",
    username: "@sarahstyle",
    category: "Fashion & Lifestyle",
    rating: 4.8,
    bio: "Fashion & lifestyle content creator passionate about sustainable fashion and authentic storytelling. Collaborating with brands that align with my values.",
    location: "Los Angeles, CA",
    joinedDate: "March 2020",
    avatar: "🌸",
    
    // Stats
    successRate: "94%",
    completedCampaigns: 9,
    avgEngagement: "4.2%",
    avgReach: "180K",
    
    // Platforms
    platforms: [
      { name: "Instagram", followers: "250K", engagement: "5.2%" },
      { name: "TikTok", followers: "180K", engagement: "8.1%" },
      { name: "YouTube", followers: "95K", engagement: "3.8%" }
    ],
    
    // Performance metrics
    performance: {
      avgLikes: "12.5K",
      avgComments: 485,
      avgShares: 120,
      bestPerforming: "Carousel Posts"
    },
    
    // Recent campaigns
    recentCampaigns: [
      {
        brand: "EcoFashion Co.",
        type: "Product Launch",
        date: "March 2024",
        reach: "95K",
        roi: "301%",
        status: "Excellent"
      },
      {
        brand: "Sustainable Beauty",
        type: "Brand Awareness",
        date: "February 2024",
        reach: "78K",
        roi: "1940%",
        status: "Good"
      }
    ],
    
    // Audience analysis
    audienceAnalysis: {
      followerQuality: {
        real: 84,
        massFollowers: 8,
        suspicious: 5,
        influencers: 3
      },
      qualityScore: 84,
      engagementAuthenticity: 92
    },
    
    // Audience interests
    audienceInterests: [
      { interest: "Fashion", percentage: 45 },
      { interest: "Lifestyle", percentage: 38 },
      { interest: "Beauty", percentage: 32 },
      { interest: "Travel", percentage: 28 },
      { interest: "Fitness", percentage: 24 },
      { interest: "Food", percentage: 18 }
    ],
    
    // Device breakdown
    deviceBreakdown: [
      { device: "Mobile (iOS)", percentage: 58 },
      { device: "Mobile (Android)", percentage: 28 },
      { device: "Desktop", percentage: 11 },
      { device: "Tablet", percentage: 3 }
    ],
    
    // Content categories
    contentCategories: [
      { category: "Fashion & Style", percentage: 45 },
      { category: "Health & Wellness", percentage: 32 },
      { category: "Food & Beverage", percentage: 25 },
      { category: "Beauty & Cosmetics", percentage: 38 },
      { category: "Travel & Tourism", percentage: 28 },
      { category: "Technology", percentage: 18 }
    ],
    
    // Top countries
    topCountries: [
      { country: "United States", percentage: 45, flag: "🇺🇸" },
      { country: "Canada", percentage: 18, flag: "🇨🇦" },
      { country: "United Kingdom", percentage: 12, flag: "🇬🇧" },
      { country: "Australia", percentage: 10, flag: "🇦🇺" },
      { country: "Germany", percentage: 8, flag: "🇩🇪" },
      { country: "France", percentage: 7, flag: "🇫🇷" }
    ],
    
    // Top cities
    topCities: [
      { city: "Los Angeles, CA", percentage: 18, flag: "🇺🇸" },
      { city: "New York, NY", percentage: 15, flag: "🇺🇸" },
      { city: "London", percentage: 12, flag: "🇬🇧" },
      { city: "Toronto", percentage: 8, flag: "🇨🇦" },
      { city: "Sydney", percentage: 7, flag: "🇦🇺" },
      { city: "Paris", percentage: 6, flag: "🇫🇷" }
    ],
    
    // Demographics
    demographics: {
      male: 22,
      female: 78,
      ageGroups: [
        { age: "13-17 years", male: 41, female: 37, total: 20 },
        { age: "18-24 years", male: 35, female: 20, total: 35 },
        { age: "25-34 years", male: 16, female: 27, total: 45 },
        { age: "35-44 years", male: 16, female: 35, total: 25 },
        { age: "45-54 years", male: 4, female: 6, total: 10 },
        { age: "55+ years", male: 2, female: 3, total: 5 }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-2xl">
                {influencerData.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">{influencerData.name}</h1>
                </div>
                <p className="text-gray-600 mb-1">{influencerData.username}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    {influencerData.category}
                  </span>
                  <span>⭐ {influencerData.rating} rating</span>
                </div>
                <p className="text-sm text-gray-700 max-w-2xl">{influencerData.bio}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>📍 {influencerData.location}</span>
                  <span>📅 Joined {influencerData.joinedDate}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                💬 Message
              </button>
              <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                Send Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 mb-1">{influencerData.successRate}</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 mb-1">{influencerData.completedCampaigns}</div>
          <div className="text-sm text-gray-600">Completed Campaigns</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 mb-1">{influencerData.avgEngagement}</div>
          <div className="text-sm text-gray-600">Avg Engagement</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 mb-1">{influencerData.avgReach}</div>
          <div className="text-sm text-gray-600">Avg Reach</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Platform Presence */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Presence</h3>
            <div className="space-y-4">
              {influencerData.platforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                      platform.name === 'Instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      platform.name === 'TikTok' ? 'bg-black' : 'bg-red-600'
                    }`}>
                      {platform.name === 'Instagram' && '📷'}
                      {platform.name === 'TikTok' && '🎵'}
                      {platform.name === 'YouTube' && '▶️'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{platform.name}</div>
                      <div className="text-sm text-gray-500">{platform.followers} followers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Engagement</div>
                    <div className="font-semibold text-green-600">{platform.engagement}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xl font-bold text-gray-900">{influencerData.performance.avgLikes}</div>
                <div className="text-sm text-gray-600">Avg. Likes</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{influencerData.performance.avgComments}</div>
                <div className="text-sm text-gray-600">Avg. Comments</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xl font-bold text-gray-900">{influencerData.performance.avgShares}</div>
                <div className="text-sm text-gray-600">Avg. Shares</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Best Performing</div>
                <div className="font-medium text-gray-900">{influencerData.performance.bestPerforming}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Send Message</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Make Offer</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Add to Favorites</span>
              </button>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
              <span className="text-sm text-gray-500">Audience Analysis</span>
            </div>
            <div className="space-y-4">
              {influencerData.recentCampaigns.map((campaign, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{campaign.brand}</h4>
                      <p className="text-sm text-gray-600">{campaign.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.status === 'Excellent' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">{campaign.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{campaign.reach}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">{campaign.roi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Follower Quality Analysis */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Follower Quality Analysis</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600 mb-1">{influencerData.audienceAnalysis.followerQuality.real}%</div>
                <div className="text-xs text-green-700">Real</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-50">
                <div className="text-2xl font-bold text-yellow-600 mb-1">{influencerData.audienceAnalysis.followerQuality.massFollowers}%</div>
                <div className="text-xs text-yellow-700">Mass Followers</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50">
                <div className="text-2xl font-bold text-orange-600 mb-1">{influencerData.audienceAnalysis.followerQuality.suspicious}%</div>
                <div className="text-xs text-orange-700">Suspicious</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50">
                <div className="text-2xl font-bold text-red-600 mb-1">{influencerData.audienceAnalysis.followerQuality.influencers}%</div>
                <div className="text-xs text-red-700">Influencers</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Quality Score</div>
                <div className="text-xl font-bold text-purple-600">{influencerData.audienceAnalysis.qualityScore}/100</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Engagement Authenticity</div>
                <div className="text-xl font-bold text-purple-600">{influencerData.audienceAnalysis.engagementAuthenticity}%</div>
              </div>
            </div>
          </div>

          {/* Audience Interests */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Interests</h3>
            <div className="space-y-3">
              {influencerData.audienceInterests.map((interest, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{interest.interest}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${interest.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{interest.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="space-y-3">
              {influencerData.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{device.device}</span>
                  <span className="text-sm font-medium text-gray-600">{device.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Categories */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              {influencerData.contentCategories.map((category, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-gray-700 mb-1">{category.category}</div>
                  <div className="font-semibold text-gray-900">{category.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Geography */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Top Countries</h4>
                <div className="space-y-2">
                  {influencerData.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span className="text-gray-700">{country.country}</span>
                      </div>
                      <span className="font-medium text-gray-900">{country.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Top Cities</h4>
                <div className="space-y-2">
                  {influencerData.topCities.map((city, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{city.flag}</span>
                        <span className="text-gray-700">{city.city}</span>
                      </div>
                      <span className="font-medium text-gray-900">{city.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Age & Gender Demographics */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Age & Gender Demographics</h3>
            
            {/* Gender Overview */}
            <div className="flex justify-center gap-12 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">{influencerData.demographics.male}%</div>
                <div className="text-sm text-gray-600">Male</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-500 mb-2">{influencerData.demographics.female}%</div>
                <div className="text-sm text-gray-600">Female</div>
              </div>
            </div>

            {/* Age Group Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Age Group Distribution</h4>
              <div className="space-y-2">
                {influencerData.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {/* Age Label */}
                    <div className="w-16 text-xs text-gray-700 font-medium">
                      {group.age}
                    </div>
                    
                    {/* Bar Chart Container */}
                    <div className="flex-1 relative max-w-xs">
                      {/* Background bar */}
                      <div className="w-full h-3 bg-gray-200 rounded-sm relative overflow-hidden">
                        {/* Male portion (left side) */}
                        <div 
                          className="absolute left-0 top-0 h-full bg-blue-500"
                          style={{ width: `${(group.male / (group.male + group.female)) * 100}%` }}
                        />
                        {/* Female portion (right side) */}
                        <div 
                          className="absolute right-0 top-0 h-full bg-pink-500"
                          style={{ width: `${(group.female / (group.male + group.female)) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Percentage labels */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-blue-500">M: {group.male}% • F: {group.female}%</span>
                      <span className="text-gray-700 font-medium">• Total: {group.total}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}