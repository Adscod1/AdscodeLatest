"use client";
import React, { useState } from 'react';
import { Profile, Role } from "@prisma/client";
import ResetButton from './ResetButton';
import LogoutButton from './LogoutButton';
import InfluencerSidebar from '@/components/ui/influencersidebar';
import { 
  Home, 
  BarChart3, 
  Target, 
  TrendingUp, 
  GraduationCap, 
  Trophy, 
  MessageSquare, 
  User, 
  DollarSign, 
  Users, 
  Settings,
  Edit3,
  Search,
  Zap,
  Star,
  Calendar,
  Lock,
  CheckCircle2,
  Bell,
  ChevronRight
} from 'lucide-react';

interface InfluencerData {
  id: string;
  firstName: string;
  lastName: string;
  primaryNiche: string;
  secondaryNiches: string[];
  bio: string | null;
  status: string;
  socialAccounts: any[];
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
}

interface DashboardProps {
  influencer: InfluencerData;
  profile: Profile;
}

const Dashboard = ({ influencer, profile }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculate total followers from social accounts
  const calculateTotalFollowers = () => {
    return influencer.socialAccounts.reduce((total: number, account: any) => {
      if (!account.followers) return total;
      
      const followerRange = account.followers;
      const numbers = followerRange.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const multiplier = followerRange.includes('K') ? 1000 : 
                          followerRange.includes('M') ? 1000000 : 1;
        return total + (parseInt(numbers[0]) * multiplier);
      }
      return total;
    }, 0);
  };

  const totalFollowers = calculateTotalFollowers();
  const followersDisplay = totalFollowers >= 1000000 
    ? `${Math.floor(totalFollowers / 1000000)}M+` 
    : totalFollowers >= 1000 
      ? `${Math.floor(totalFollowers / 1000)}K+` 
      : totalFollowers.toString();

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', active: true },
    { id: 'campaigns', icon: Target, label: 'Campaigns', badge: 3 },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'academy', icon: GraduationCap, label: 'Academy', badge: 'New', badgeColor: 'bg-purple-500' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 5 },
  ];

  const toolsItems = [
    { id: 'profile-boost', icon: User, label: 'Profile Boost' },
    { id: 'earnings', icon: DollarSign, label: 'Earnings' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const quickActions = [
    { icon: Edit3, title: 'Write Review', description: 'Share your experience', color: 'bg-blue-500' },
    { icon: Search, title: 'Find Campaigns', description: 'Browse opportunities', color: 'bg-green-500' },
    { icon: Zap, title: 'Complete Training', description: 'Unlock features', color: 'bg-purple-500' },
    { icon: TrendingUp, title: 'Boost Profile', description: 'Increase visibility', color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { type: 'review', title: 'Review submitted', subtitle: 'Tech Gadget XYZ', time: '2 hours ago', color: 'bg-green-100 text-green-600' },
    { type: 'profile', title: 'Profile viewed', subtitle: 'Brand Alpha', time: '5 hours ago', color: 'bg-blue-100 text-blue-600' },
    { type: 'training', title: 'Training started', subtitle: 'Content Creation 101', time: '1 day ago', color: 'bg-yellow-100 text-yellow-600' },
  ];

  const journeySteps = [
    { title: 'New User', description: 'Complete profile setup', status: 'completed', icon: CheckCircle2 },
    { title: 'Aspiring Influencer', description: '10+ reviews, 100+ followers', status: 'completed', icon: CheckCircle2 },
    { title: 'Verified Influencer', description: '50+ reviews, 500+ followers', status: 'locked', icon: Lock },
  ];

  const benefits = [
    'Write and publish reviews',
    'Access to community features',
    'Apply to entry-level campaigns',
    'Premium campaigns (locked)',
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - using the reusable component */}
      <InfluencerSidebar 
        firstName={influencer.firstName}
        lastName={influencer.lastName}
        status={influencer.status}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-gray-400" />
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"></div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Readiness Score</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">69%</div>
              <p className="text-xs text-gray-500">Keep improving to unlock more features</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">0 UGX</div>
              <p className="text-xs text-green-600">+0% this month</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Reviews Written</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">35</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-gray-500">15 more to reach Verified tier</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Followers</h3>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{followersDisplay}</div>
              <p className="text-xs text-gray-500">
                {influencer.status === 'APPROVED' 
                  ? 'Verified Influencer' 
                  : `${Math.max(0, 500 - totalFollowers)} more to reach Verified tier`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Journey Progress */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Your Journey Progress</h2>
                  <span className="text-sm text-gray-500">
                    {influencer.status === 'APPROVED' ? 'Verified Influencer' : 'Aspiring Influencer'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {journeySteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? 'Completed' : 'Locked'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`}></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-500">{activity.subtitle}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All Activity
                </button>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">For testing purposes only:</div>
                  <ResetButton />
                </div>
              </div>

              {/* Current Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Benefits</h2>
                
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {benefit.includes('locked') ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`text-sm ${
                        benefit.includes('locked') ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;