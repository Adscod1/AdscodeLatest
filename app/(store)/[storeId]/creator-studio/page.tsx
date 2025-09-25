"use client";
import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  Heart, 
  MessageCircle, 
  Eye, 
  TrendingUp, 
  Search, 
  Star,
  MapPin,
  Send,
  MoreHorizontal,
  Camera
} from 'lucide-react';

const CreatorStudioDashboard = () => {
  const [activeTab, setActiveTab] = useState('Analytics');
  const [activeSection, setActiveSection] = useState('Dashboard');

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: 'Dashboard' },
    { icon: Users, label: 'Listings', path: 'Listings' },
    { icon: Target, label: 'Campaigns', path: 'Campaigns' },
    { icon: Users, label: 'Creator Studio', path: 'Creator Studio', active: true },
    { icon: Star, label: 'Reviews', path: 'Reviews' },
    { icon: BarChart3, label: 'Analytics', path: 'Analytics' },
    { icon: Users, label: 'Competitor Analysis', path: 'Competitor Analysis' },
    { icon: MessageCircle, label: 'Sentiment Analysis', path: 'Sentiment Analysis' },
    { icon: Target, label: 'Coupons', path: 'Coupons' }
  ];

  const tabs = ['Discovery', 'Campaigns', 'Content', 'Analytics'];

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Campaign Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Reach</span>
              <span className="font-semibold">2.4M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Engagement Rate</span>
              <span className="font-semibold">4.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Click-through Rate</span>
              <span className="font-semibold">2.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold">1.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 flex items-center justify-center">$</div>
            <h3 className="text-lg font-semibold">ROI Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Spent</span>
              <span className="font-semibold">$15,750</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Generated</span>
              <span className="font-semibold">$47,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ROI</span>
              <span className="font-semibold text-green-600">200%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost per Acquisition</span>
              <span className="font-semibold">$24.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Camera className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Content Library</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <div className="p-4">
              <h4 className="font-semibold mb-2">Content #{item}</h4>
              <p className="text-sm text-gray-600 mb-3">By @creator{item}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>1.2K</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>89</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>5.4K</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Active Campaigns</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-lg">Summer Collection Launch</h4>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                Active
              </span>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Budget</p>
              <p className="font-semibold">$5,000</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Creators</p>
              <p className="font-semibold">5</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Reach</p>
              <p className="font-semibold">450K</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Engagement</p>
              <p className="font-semibold">3.2%</p>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-black h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-lg">Holiday Promo Campaign</h4>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                Planning
              </span>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Budget</p>
              <p className="font-semibold">$8,000</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Creators</p>
              <p className="font-semibold">3</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Reach</p>
              <p className="font-semibold">320K</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Engagement</p>
              <p className="font-semibold">4.1%</p>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-black h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiscovery = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Influencer Discovery</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Category</option>
          <option>Fashion</option>
          <option>Tech</option>
          <option>Fitness</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Followers</option>
          <option>10K-50K</option>
          <option>50K-100K</option>
          <option>100K+</option>
        </select>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <div className="w-4 h-4"></div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: 'Sarah Johnson',
            handle: '@sarahjfashion',
            followers: '125K',
            engagement: '4.2%',
            category: 'Fashion',
            rating: 4.8,
            rate: '$500-800',
            location: 'New York',
            icon: '⭐'
          },
          {
            name: 'Mike Chen',
            handle: '@mikechen tech',
            followers: '89K',
            engagement: '3.8%',
            category: 'Tech',
            rating: 4.6,
            rate: '$300-600',
            location: 'San Francisco',
            icon: '💻'
          },
          {
            name: 'Emma Wilson',
            handle: '@emmawilsonfit',
            followers: '210K',
            engagement: '5.1%',
            category: 'Fitness',
            rating: 4.9,
            rate: '$800-1200',
            location: 'Los Angeles',
            icon: '💪'
          }
        ].map((creator, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {creator.icon}
              </div>
              <div>
                <h4 className="font-semibold">{creator.name}</h4>
                <p className="text-gray-600 text-sm">{creator.handle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 text-sm">Followers</p>
                <p className="font-semibold">{creator.followers}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Engagement</p>
                <p className="font-semibold">{creator.engagement}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">{creator.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{creator.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Rate: {creator.rate}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                {creator.location}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Contact
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return renderAnalytics();
      case 'Content':
        return renderContent();
      case 'Campaigns':
        return renderCampaigns();
      case 'Discovery':
        return renderDiscovery();
      default:
        return renderAnalytics();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Creator Studio</h1>
              <p className="text-gray-600">Manage influencer partnerships and content collaborations</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-600">Total Creators</p>
                <p className="text-2xl font-bold">248</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold">2.4M</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Engagement</p>
                <p className="text-2xl font-bold">4.2%</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CreatorStudioDashboard;