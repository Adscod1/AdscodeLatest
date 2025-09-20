"use client";

import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Users, Calendar, DollarSign, Bell, Settings, BarChart3, Trophy, MessageSquare, User, ChevronDown } from 'lucide-react';
import InfluencerSidebar from '@/components/ui/influencersidebar';

interface Campaign {
  id: string;
  title: string;
  company: string;
  budget: string;
  deadline: string;
  location: string;
  applicants: number;
  requirements: string;
  category: string;
  status: 'available' | 'applied' | 'active' | 'completed';
  featured?: boolean;
}

const CampaignsPage = () => {
  const [selectedTab, setSelectedTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');

  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Tech Gadget Review Campaign',
      company: 'TechCorp',
      budget: '$50,000 - 150,000 UGX',
      deadline: 'Dec 30, 2024',
      location: 'Remote',
      applicants: 45100,
      requirements: '500+ followers, Tech niche',
      category: 'Electronics',
      status: 'available',
      featured: true
    },
    {
      id: '2',
      title: 'Fashion Brand Ambassador',
      company: 'StyleHub',
      budget: '$75,000 - 200,000 UGX',
      deadline: 'Jan 15, 2025',
      location: 'Kampala',
      applicants: 23350,
      requirements: '1000+ followers, Fashion content',
      category: 'Fashion',
      status: 'applied',
      featured: true
    },
    {
      id: '3',
      title: 'Health & Wellness Content',
      company: 'WellnessPlus',
      budget: '$30,000 - 80,000 UGX',
      deadline: 'Jan 8, 2025',
      location: 'Remote',
      applicants: 67150,
      requirements: '300+ followers, Health content',
      category: 'Health',
      status: 'available'
    }
  ];

  const stats = [
    { label: 'Available', count: 24, color: 'text-blue-600' },
    { label: 'Applied', count: 3, color: 'text-orange-500' },
    { label: 'Completed', count: 0, color: 'text-green-600' },
    { label: 'Total Earned (UGX)', count: 0, color: 'text-purple-600' }
  ];

  // Remove the filtering logic since all campaigns should be shown

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
            {campaign.featured && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Featured</span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{campaign.category}</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">by {campaign.company}</p>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'applied' ? (
            <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg">Applied</button>
          ) : (
            <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
              Apply Now
            </button>
          )}
          <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
            View Details
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          <span>{campaign.budget}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{campaign.deadline}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{campaign.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{campaign.applicants.toLocaleString()} applied</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Requirements:</span> {campaign.requirements}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Using our reusable InfluencerSidebar component */}
      <InfluencerSidebar 
        firstName="Alex"
        lastName="Chen"
        status="PENDING"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                <p className="text-gray-600">Discover and apply to brand partnerships</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Create Alert
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.count}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns, brands, categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Category</span>
              <span>Budget</span>
              <span>Location</span>
            </div>
          </div>

          <div className="flex space-x-8 border-b border-gray-200">
            {['available', 'applied', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-4 px-1 text-sm font-medium capitalize ${
                  selectedTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Campaigns</h2>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;