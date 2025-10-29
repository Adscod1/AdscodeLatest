'use client';

import React, { useState } from 'react';
import { Star, Eye, Heart, MessageCircle, Share2, MousePointerClick, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const InfluencerDashboard = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const campaignId = params.id as string;
  
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [platformFilter, setPlatformFilter] = useState('All Platforms');

  const stats = [
    { label: 'Total Influencers', value: '6', subtitle: '4 active', icon: Users, color: 'bg-purple-100' },
    { label: 'Total Views', value: '2.0M', subtitle: 'Across all campaigns', icon: Eye, color: 'bg-blue-100' },
    { label: 'Total Conversions', value: '3,520', subtitle: '+23% from last month', icon: TrendingUp, color: 'bg-green-100', trend: true },
    { label: 'Avg. Performance', value: '4.6/5.0', subtitle: '8.5% engagement', icon: Star, color: 'bg-yellow-100' }
  ];

  const influencers = [
    {
      name: 'Sarah Johnson',
      tier: 'Gold',
      status: 'Active',
      handle: '@sarahjstyle',
      platform: 'Instagram',
      followers: '245K followers',
      avatar: '👩‍🦰',
      campaign: 'Summer Sneaker Sale',
      rating: 4.8,
      views: '125,000',
      likes: '8,500',
      comments: '642',
      shares: '234',
      ctr: '2.56%',
      conversionRate: '8.91%',
      engagementRate: '7.8%',
      totalClicks: '3,200',
      conversions: '285'
    },
    {
      name: 'Marcus Chen',
      tier: 'Gold',
      status: 'Active',
      handle: '@chefmarcus',
      platform: 'YouTube',
      followers: '890K followers',
      avatar: '👨‍🍳',
      campaign: 'Mid-Year Max Promotion',
      rating: 4.9,
      views: '456,000',
      likes: '34,200',
      comments: '2,890',
      shares: '1,240',
      ctr: '2.72%',
      conversionRate: '7.9%',
      engagementRate: '8.4%',
      totalClicks: '12,400',
      conversions: '980'
    },
    {
      name: 'Emma Rodriguez',
      tier: 'Gold',
      status: 'Active',
      handle: '@emmaworkout',
      platform: 'TikTok',
      followers: '1.2M followers',
      avatar: '👩‍💼',
      campaign: 'Nike Air Max Promotion',
      rating: 4.7,
      views: '890,000',
      likes: '78,900',
      comments: '5,670',
      shares: '3,450',
      ctr: '2.12%',
      conversionRate: '7.61%',
      engagementRate: '9.8%',
      totalClicks: '18,900',
      conversions: '1420'
    },
    {
      name: 'David Kim',
      tier: 'Silver',
      status: 'Completed',
      handle: '@davidconnects',
      platform: 'Instagram',
      followers: '156K followers',
      avatar: '👨‍💻',
      campaign: 'Holiday Collection Launch',
      rating: 4.6,
      views: '89,000',
      likes: '6,700',
      comments: '445',
      shares: '167',
      ctr: '2.63%',
      conversionRate: '6.2%',
      engagementRate: '8.1%',
      totalClicks: '2,340',
      conversions: '145'
    },
    {
      name: 'Olivia Martinez',
      tier: 'Gold',
      status: 'Active',
      handle: '@oliviafashion',
      platform: 'Instagram',
      followers: '667K followers',
      avatar: '👩‍🎨',
      campaign: 'Summer Sneaker Sale',
      rating: 4.8,
      views: '234,000',
      likes: '19,800',
      comments: '1,230',
      shares: '567',
      ctr: '2.9%',
      conversionRate: '6.72%',
      engagementRate: '9.2%',
      totalClicks: '6,780',
      conversions: '456'
    },
    {
      name: 'Alex Thompson',
      tier: 'Silver',
      status: 'Pending',
      handle: '@alexsports',
      platform: 'YouTube',
      followers: '423K followers',
      avatar: '👨‍🦱',
      campaign: 'Retargeting Campaign',
      rating: 4.4,
      views: '178,000',
      likes: '12,300',
      comments: '890',
      shares: '345',
      ctr: '2.56%',
      conversionRate: '5.13%',
      engagementRate: '7.6%',
      totalClicks: '4,560',
      conversions: '234'
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const ProgressBar = ({ value, color = 'bg-purple-500' }: { value: string; color?: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full`} style={{ width: value }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-200 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Influencer Performance</h1>
              <p className="text-sm text-gray-500">Track individual creator metrics and campaign contributions</p>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <span className="text-xl">+</span>
            Add Influencer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.trend ? 'text-green-600' : 'text-gray-500'}`}>
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon size={20} className="text-gray-700" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search influencers..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>All Tiers</option>
            <option>Gold</option>
            <option>Silver</option>
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>All Platforms</option>
            <option>Instagram</option>
            <option>YouTube</option>
            <option>TikTok</option>
          </select>
        </div>

        {/* Influencer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {influencers.map((influencer, idx) => (
            <div key={idx} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{influencer.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{influencer.name}</h3>
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {influencer.tier}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{influencer.handle}</p>
                    <p className="text-xs text-gray-400">{influencer.platform} • {influencer.followers}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  influencer.status === 'Active' ? 'bg-green-100 text-green-700' : 
                  influencer.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {influencer.status}
                </span>
              </div>

              {/* Campaign */}
              <div className="mb-4 gap-2">
                <span className="text-xs text-gray-500 mb-1">Campaign</span>
                <span className="text-sm float-right font-medium text-gray-900">{influencer.campaign}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {renderStars(influencer.rating)}
                <span className="text-sm text-gray-600">{influencer.rating} rating</span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Eye size={12} />
                    <span>Views</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{influencer.views}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Heart size={12} />
                    <span>Likes</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{influencer.likes}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <MessageCircle size={12} />
                    <span>Comments</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{influencer.comments}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Share2 size={12} />
                    <span>Shares</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{influencer.shares}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <MousePointerClick size={12} className="text-purple-600" />
                      <span className="text-xs text-gray-700">Click-Through Rate</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">{influencer.ctr}</span>
                  </div>
                  <ProgressBar value={influencer.ctr} color="bg-purple-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-green-600" />
                      <span className="text-xs text-gray-700">Conversion Rate</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">{influencer.conversionRate}</span>
                  </div>
                  <ProgressBar value={influencer.conversionRate} color="bg-green-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Heart size={12} className="text-pink-600" />
                      <span className="text-xs text-gray-700">Engagement Rate</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">{influencer.engagementRate}</span>
                  </div>
                  <ProgressBar value={influencer.engagementRate} color="bg-pink-500" />
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Total Clicks</p>
                  <p className="text-sm font-semibold text-gray-900">{influencer.totalClicks}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Conversions</p>
                  <p className="text-sm font-semibold text-green-600">{influencer.conversions}</p>
                </div>
              </div>

              {/* View Profile Button */}
              <Link 
                href={`/${storeId}/campaign/${campaignId}/influencers/profile`}
                className="w-full py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>View Full Profile</span>
                <span>↗</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;