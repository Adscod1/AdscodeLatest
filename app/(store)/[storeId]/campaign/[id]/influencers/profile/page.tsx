"use client";
import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, MapPin, Calendar, Star, Eye, Heart, MessageCircle, Share2, MousePointerClick, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const InfluencerProfile = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const campaignId = params.id as string;
  
  const [activeTab, setActiveTab] = useState('Content Performance');

  const influencerData = {
    name: 'Sarah Johnson',
    handle: '@sarahjfitness',
    platform: 'Instagram',
    followers: '245K followers',
    location: 'Los Angeles, CA',
    joined: 'Joined Jan 2024',
    rating: 4.8,
    bio: 'Fitness enthusiast & lifestyle creator. Helping people achieve their fitness goals through sustainable habits and positive mindset.',
    tier: 'Gold',
    status: 'Active',
    avatar: '👩‍🦰'
  };

  const stats = [
    { icon: Eye, label: 'Total Views', value: '125,000' },
    { icon: Heart, label: 'Total Likes', value: '8,500' },
    { icon: MessageCircle, label: 'Comments', value: '642' },
    { icon: Share2, label: 'Shares', value: '234' },
    { icon: MousePointerClick, label: 'Total Clicks', value: '3,200' },
    { icon: ShoppingCart, label: 'Conversions', value: '285' }
  ];

  const performanceMetrics = [
    {
      icon: MousePointerClick,
      label: 'Click-Through Rate',
      value: '2.56%',
      subtitle: 'Above industry average of 2.1%',
      progress: '2.56%',
      color: 'bg-purple-500'
    },
    {
      icon: ShoppingCart,
      label: 'Conversion Rate',
      value: '8.91%',
      subtitle: 'Excellent performance',
      progress: '8.91%',
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Engagement Rate',
      value: '7.8%',
      subtitle: 'Strong audience connection',
      progress: '7.8%',
      color: 'bg-pink-500'
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: '$12,450',
      subtitle: 'Avg. Order Value: $43.68',
      change: '+18% from last month',
      color: 'bg-yellow-500'
    }
  ];

  const contentPerformance = [
    {
      content: 'Morning Workout Routine',
      type: 'Reel',
      date: '2024-01-28',
      views: '45,200',
      engagement: '3,200',
      engagementIcon: '156',
      clicks: '1,240',
      ctr: '2.74%',
      conversions: '98',
      convRate: '7.91%'
    },
    {
      content: 'Product Review: Running Shoes',
      type: 'Post',
      date: '2024-01-25',
      views: '38,900',
      engagement: '2,800',
      engagementIcon: '234',
      clicks: '1,120',
      ctr: '2.88%',
      conversions: '112',
      convRate: '10%'
    },
    {
      content: 'Fitness Motivation Story',
      type: 'Story',
      date: '2024-01-22',
      views: '26,400',
      engagement: '1,900',
      engagementIcon: '145',
      clicks: '620',
      ctr: '2.35%',
      conversions: '52',
      convRate: '8.39%'
    },
    {
      content: 'Weekly Fitness Challenge',
      type: 'Reel',
      date: '2024-01-18',
      views: '12,500',
      engagement: '800',
      engagementIcon: '107',
      clicks: '220',
      ctr: '1.76%',
      conversions: '23',
      convRate: '10.45%'
    }
  ];

  const ageDistribution = [
    { range: '18-24', percentage: 25 },
    { range: '25-34', percentage: 45 },
    { range: '35-44', percentage: 20 },
    { range: '45+', percentage: 10 }
  ];

  const genderSplit = [
    { gender: 'Female', percentage: 68 },
    { gender: 'Male', percentage: 30 },
    { gender: 'Other', percentage: 2 }
  ];

  const topLocations = [
    { rank: '#1', city: 'Los Angeles', percentage: '22% of audience' },
    { rank: '#2', city: 'New York', percentage: '18% of audience' },
    { rank: '#3', city: 'Miami', percentage: '12% of audience' },
    { rank: '#4', city: 'Chicago', percentage: '10% of audience' },
    { rank: '#5', city: 'Houston', percentage: '8% of audience' }
  ];

  const campaigns = [
    { name: 'Summer Sneaker Sale', status: 'Active' }
  ];

  const ProgressBar = ({ value, color = 'bg-purple-500' }: { value: string; color?: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full`} style={{ width: value }}></div>
    </div>
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-200 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Influencer Profile</h1>
              <p className="text-sm text-gray-500">Detailed performance analytics and insights</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            <ExternalLink size={16} />
            View on Instagram
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="text-6xl">{influencerData.avatar}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{influencerData.name}</h2>
                  <p className="text-gray-600">{influencerData.handle}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{influencerData.platform} • {influencerData.followers}</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {influencerData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {influencerData.joined}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(influencerData.rating)}
                  <span className="text-lg font-semibold">{influencerData.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
                  {influencerData.tier}
                </span>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                  {influencerData.status}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{influencerData.bio}</p>
              <div className="flex items-center gap-3">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <MessageCircle size={16} />
                  Contact
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <span>📋</span>
                  Assign to Campaign
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <Icon size={14} />
                  <span>{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {performanceMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                  <Icon size={16} className="text-purple-600" />
                  <span>{metric.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                {metric.progress && (
                  <>
                    <ProgressBar value={metric.progress} color={metric.color} />
                    <p className="text-xs text-gray-500 mt-2">{metric.subtitle}</p>
                  </>
                )}
                {metric.change && (
                  <>
                    <p className="text-xs text-gray-600 mt-1">{metric.subtitle}</p>
                    <p className="text-xs text-green-600 mt-1">{metric.change}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {['Content Performance', 'Audience Insights', 'Campaign History'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Performance Tab */}
          {activeTab === 'Content Performance' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Content Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Content</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Views</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Engagement</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Clicks</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">CTR</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Conversions</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentPerformance.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.content}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.views}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Heart size={12} className="text-red-500" />
                            {item.engagement}
                            <MessageCircle size={12} className="text-gray-400" />
                            {item.engagementIcon}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.clicks}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.ctr}</td>
                        <td className="py-3 px-4 text-sm font-medium text-green-600">{item.conversions}</td>
                        <td className="py-3 px-4">
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                            {item.convRate}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audience Insights Tab */}
          {activeTab === 'Audience Insights' && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Age Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                  <div className="space-y-4">
                    {ageDistribution.map((age, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">{age.range}</span>
                          <span className="text-sm font-semibold text-gray-900">{age.percentage}%</span>
                        </div>
                        <ProgressBar value={`${age.percentage}%`} color="bg-purple-500" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Split */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Split</h3>
                  <div className="space-y-4">
                    {genderSplit.map((gender, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">{gender.gender}</span>
                          <span className="text-sm font-semibold text-gray-900">{gender.percentage}%</span>
                        </div>
                        <ProgressBar value={`${gender.percentage}%`} color="bg-purple-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Locations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
                <div className="grid grid-cols-5 gap-4">
                  {topLocations.map((location, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{location.rank}</div>
                      <div className="text-sm font-semibold text-gray-900">{location.city}</div>
                      <div className="text-xs text-gray-500">{location.percentage}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaign History Tab */}
          {activeTab === 'Campaign History' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Assignments</h3>
              {campaigns.map((campaign, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{campaign.name}</h4>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      {campaign.status}
                    </span>
                  </div>
                  <Link 
                    href={`/${storeId}/campaign/${campaignId}/influencers/details`}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;