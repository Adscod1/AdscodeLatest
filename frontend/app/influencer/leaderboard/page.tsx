"use client";

import React, { useState } from 'react';
import InfluencerSidebar from '@/components/ui/influencersidebar';
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Users, 
  MessageSquare, 
  Award,
  Home,
  BarChart3,
  GraduationCap,
  Settings,
  DollarSign,
  Zap
} from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  points: number;
  reviews: number;
  campaigns: number;
  rank: number;
  verified: boolean;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  status: 'Verified' | 'Aspiring' | 'New User';
}

interface CategoryLeader {
  category: string;
  leader: string;
  points: number;
  rank: number;
}

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'overall' | 'category' | 'nearby'>('overall');
  const [currentUser] = useState<Influencer>({
    id: 'current',
    name: 'Alex Chen',
    avatar: 'AC',
    points: 850,
    reviews: 35,
    campaigns: 0,
    rank: 127,
    verified: false,
    trend: 'neutral',
    trendValue: 0,
    status: 'Aspiring'
  });

  const topInfluencers: Influencer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      points: 2840,
      reviews: 156,
      campaigns: 24,
      rank: 1,
      verified: true,
      trend: 'up',
      trendValue: 2,
      status: 'Verified'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      avatar: 'MR',
      points: 2720,
      reviews: 142,
      campaigns: 21,
      rank: 2,
      verified: true,
      trend: 'down',
      trendValue: 1,
      status: 'Verified'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'EW',
      points: 2580,
      reviews: 128,
      campaigns: 19,
      rank: 3,
      verified: true,
      trend: 'up',
      trendValue: 1,
      status: 'Verified'
    }
  ];

  const nearbyInfluencers: Influencer[] = [
    {
      id: '125',
      name: 'John Smith',
      avatar: 'JS',
      points: 870,
      reviews: 33,
      campaigns: 1,
      rank: 125,
      verified: false,
      trend: 'neutral',
      trendValue: 0,
      status: 'Aspiring'
    },
    {
      id: '126',
      name: 'Maria Garcia',
      avatar: 'MG',
      points: 860,
      reviews: 36,
      campaigns: 0,
      rank: 126,
      verified: false,
      trend: 'neutral',
      trendValue: 0,
      status: 'Aspiring'
    },
    currentUser,
    {
      id: '128',
      name: 'Taylor Brown',
      avatar: 'TB',
      points: 840,
      reviews: 34,
      campaigns: 0,
      rank: 128,
      verified: false,
      trend: 'neutral',
      trendValue: 0,
      status: 'Aspiring'
    },
    {
      id: '129',
      name: 'Jordan Lee',
      avatar: 'JL',
      points: 830,
      reviews: 33,
      campaigns: 0,
      rank: 129,
      verified: false,
      trend: 'neutral',
      trendValue: 0,
      status: 'New User'
    }
  ];

  const categoryLeaders: CategoryLeader[] = [
    {
      category: 'Tech Reviews',
      leader: 'TechGuru95',
      points: 1850,
      rank: 1
    },
    {
      category: 'Fashion',
      leader: 'StyleQueen',
      points: 1720,
      rank: 1
    },
    {
      category: 'Food & Dining',
      leader: 'FoodieFinder',
      points: 1650,
      rank: 1
    }
  ];

  const renderInfluencerCard = (influencer: Influencer, showRank = true) => (
    <div 
      key={influencer.id} 
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
        influencer.id === 'current' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-4">
        {showRank && (
          <div className="flex items-center space-x-2 min-w-[60px]">
            {influencer.rank <= 3 ? (
              <Trophy className={`h-5 w-5 ${
                influencer.rank === 1 ? 'text-yellow-500' : 
                influencer.rank === 2 ? 'text-gray-400' : 'text-amber-600'
              }`} />
            ) : (
              <span className="text-sm font-medium text-gray-500">#{influencer.rank}</span>
            )}
            {influencer.trend === 'up' && (
              <span className="text-green-500 text-xs flex items-center">
                ▲{influencer.trendValue}
              </span>
            )}
            {influencer.trend === 'down' && (
              <span className="text-red-500 text-xs flex items-center">
                ▼{influencer.trendValue}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {influencer.avatar}
            </div>
            {influencer.verified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Award className="h-2.5 w-2.5 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">
              {influencer.name}
              {influencer.id === 'current' && <span className="text-blue-600"> (You)</span>}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span>{influencer.points} pts</span>
              <span>{influencer.reviews} reviews</span>
              <span>{influencer.campaigns} campaigns</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          influencer.status === 'Verified' ? 'bg-green-100 text-green-800' :
          influencer.status === 'Aspiring' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {influencer.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Using our reusable InfluencerSidebar component */}
      <InfluencerSidebar 
        firstName="Alex"
        lastName="Chen"
        status="PENDING"
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
              <span>/</span>
              <span className="text-gray-900">Leaderboard</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-gray-600">See how you rank among other influencers</p>
          </div>

          {/* Current Rank Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Current Rank</p>
                  <h2 className="text-4xl font-bold text-gray-900">#{currentUser.rank}</h2>
                  <p className="text-sm text-gray-600">{currentUser.points} points</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Reviews: {currentUser.reviews}</p>
                <p className="text-sm text-gray-600">Campaigns: {currentUser.campaigns}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Aspiring Influencer
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit m-auto">
            {[
              { key: 'overall', label: 'Overall' },
              { key: 'category', label: 'By Category' },
              { key: 'nearby', label: 'Near You' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overall' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Top Influencers
              </h2>
              <div className="space-y-4">
                {topInfluencers.map((influencer) => renderInfluencerCard(influencer))}
              </div>
            </div>
          )}

          {activeTab === 'category' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Leaders</h2>
              <div className="space-y-4">
                {categoryLeaders.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">{leader.category}</h3>
                      <p className="text-sm text-gray-600">Leader: {leader.leader}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{leader.points} pts</p>
                      <p className="text-sm text-gray-600">Category #{leader.rank}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nearby' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Ranking Area</h2>
              <div className="space-y-4">
                {nearbyInfluencers.map((influencer) => renderInfluencerCard(influencer))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;