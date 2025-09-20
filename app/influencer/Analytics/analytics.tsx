"use client"
import React, { useState } from 'react';
import { 
  Eye, 
  Heart, 
  Users, 
  Star, 
  TrendingUp, 
  Award,
  Zap,
  BarChart3,
  Settings,
  MessageSquare,
  Trophy,
  DollarSign,
  UserPlus,
  Home,
  BookOpen,
  User
} from 'lucide-react';
import InfluencerSidebar from '@/components/ui/influencersidebar';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, color }) => {
  const changeColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className={`text-sm ${changeColors[changeType]} flex items-center`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  isNew?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, badge, isNew }) => (
  <div className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
    active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
  }`}>
    <div className="flex items-center space-x-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      {isNew && (
        <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">
          New
        </span>
      )}
      {badge && (
        <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
          {badge}
        </span>
      )}
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Overview');

  const metrics = [
    {
      title: 'Profile Views',
      value: '1,247',
      change: '+12.5% this month',
      changeType: 'positive' as const,
      icon: <Eye size={24} className="text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Engagement Rate',
      value: '6.2%',
      change: 'Above average',
      changeType: 'positive' as const,
      icon: <Heart size={24} className="text-green-600" />,
      color: 'bg-green-50'
    },
    {
      title: 'Total Reach',
      value: '5,420',
      change: '-2.1% this month',
      changeType: 'negative' as const,
      icon: <Users size={24} className="text-purple-600" />,
      color: 'bg-purple-50'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '',
      changeType: 'neutral' as const,
      icon: <Star size={24} className="text-yellow-600" />,
      color: 'bg-yellow-50'
    }
  ];

  const monthlyPerformance = [
    {
      month: 'Nov 2024',
      followers: 180,
      engagement: '5.2%',
      reviews: 8
    },
    {
      month: 'Dec 2024',
      followers: 250,
      engagement: '6.2%',
      reviews: 12
    }
  ];

  const topReviews = [
    {
      title: 'Wireless Headphones Review',
      views: 542,
      likes: 32,
      shares: 8,
      rating: 4.9,
      date: 'Dec 15, 2024'
    },
    {
      title: 'Smartphone Camera Test',
      views: 389,
      likes: 28,
      shares: 5,
      rating: 4.5,
      date: 'Dec 10, 2024'
    },
    {
      title: 'Gaming Laptop Performance',
      views: null,
      likes: null,
      shares: null,
      rating: 4.8,
      date: null
    }
  ];

  const reviewCategories = [
    { name: 'Electronics', percentage: 60 },
    { name: 'Software', percentage: 25 },
    { name: 'Gaming', percentage: 15 }
  ];

  const growthMetrics = [
    {
      title: 'Follower Growth',
      value: '+8.3%',
      subtitle: 'This Month',
      icon: <TrendingUp size={32} className="text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Review Quality',
      value: '+2.1',
      subtitle: 'Average Rating',
      icon: <Award size={32} className="text-green-600" />,
      color: 'bg-green-50'
    },
    {
      title: 'Profile Views',
      value: '+12.5%',
      subtitle: 'This Month',
      icon: <Eye size={32} className="text-purple-600" />,
      color: 'bg-purple-50'
    }
  ];

  const interests = [
    { name: 'Technology', percentage: 45 },
    { name: 'Gaming', percentage: 35 },
    { name: 'Reviews', percentage: 30 },
    { name: 'Electronics', percentage: 25 },
    { name: 'Mobile Apps', percentage: 20 }
  ];

  const demographics = [
    { range: '18-24 years', percentage: 45 },
    { range: '25-34 years', percentage: 35 },
    { range: '35+ years', percentage: 20 }
  ];

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-900">{rating}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Using the reusable InfluencerSidebar */}
      <InfluencerSidebar 
        firstName="Alex"
        lastName="Chen"
        status="Aspiring Influencer"
        className="w-64"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Home size={16} />
              <span>/</span>
              <span>Analytics</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Track your influence and engagement metrics</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Main Tabs */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {['Overview', 'Reviews', 'Audience', 'Growth'].map((tab) => (
                <TabButton
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </TabButton>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Performance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Performance</h3>
                
                <div className="space-y-6">
                  {monthlyPerformance.map((month, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{month.month}</h4>
                        <span className="text-sm text-gray-500">{month.reviews} reviews</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Followers</p>
                          <p className="text-xl font-semibold text-gray-900">{month.followers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Engagement</p>
                          <p className="text-xl font-semibold text-gray-900">{month.engagement}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Reviews */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Reviews</h3>
                
                <div className="space-y-4">
                  {topReviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{review.title}</h4>
                        <StarRating rating={review.rating} />
                      </div>
                      
                      {review.views && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {review.views}
                          </span>
                          <span className="flex items-center">
                            <Heart size={12} className="mr-1" />
                            {review.likes}
                          </span>
                          <span className="flex items-center">
                            <Users size={12} className="mr-1" />
                            {review.shares}
                          </span>
                        </div>
                      )}
                      
                      {review.date && (
                        <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="space-y-8">
              {/* Review Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">35</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2.4k</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
              </div>

              {/* Review Categories */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Categories</h3>
                <div className="space-y-4">
                  {reviewCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="font-medium text-gray-900">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-800 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Audience' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Audience Insights */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Audience Insights</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Demographics</h4>
                  <div className="space-y-4">
                    {demographics.map((demo, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{demo.range}</span>
                          <span className="font-medium text-gray-900">{demo.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-800 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${demo.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Top Interests</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Technology', 'Gaming', 'Reviews', 'Electronics', 'Mobile Apps'].map((interest) => (
                      <span 
                        key={interest}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {interests.map((interest, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{interest.name}</span>
                          <span className="font-medium text-gray-900">{interest.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${interest.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Growth' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 md:col-span-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Growth Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {growthMetrics.map((metric, index) => (
                    <div key={index} className={`p-6 rounded-xl ${metric.color}`}>
                      <div className="flex items-center justify-between mb-4">
                        {metric.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {metric.subtitle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;