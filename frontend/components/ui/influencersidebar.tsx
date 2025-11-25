"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationBell from './notification-bell';
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
  Star,
  Settings
} from 'lucide-react';

interface InfluencerSidebarProps {
  firstName: string;
  lastName: string;
  status: string;
  className?: string;
}

const InfluencerSidebar = ({ 
  firstName, 
  lastName, 
  status, 
  className = ''
}: InfluencerSidebarProps) => {
  const pathname = usePathname();

  return (
    <div className={`w-64 bg-white shadow-sm border-r border-gray-200 h-screen ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Adscod</h1>
              <p className="text-xs text-gray-500">Influencer Platform</p>
            </div>
          </div>
          
          {/* Notification Bell */}
          <NotificationBell />
        </div>
      </div>

      <nav className="px-4 space-y-1">
        {/* Dashboard */}
        <Link 
          href="/influencer/Dashboard" 
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            pathname === "/influencer/Dashboard" ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="flex-1">Home</span>
        </Link>

        {/* Campaigns */}
        <Link 
          href="/influencer/campaigns" 
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            pathname.startsWith("/influencer/campaigns") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="flex-1">Campaigns</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-black text-white">
            3
          </span>
        </Link>

        {/* Analytics */}
        <Link 
          href="/influencer/Analytics" 
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            pathname.startsWith("/influencer/analytics") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="flex-1">Analytics</span>
        </Link>

        {/* Academy */}
        <Link 
          href="/influencer/Academy" 
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            pathname.startsWith("/influencer/Academy") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="flex-1">Academy</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-black text-white">
            New
          </span>
        </Link>

        {/* Leaderboard */}
        <Link 
          href="/influencer/leaderboard" 
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            pathname.startsWith("/influencer/leaderboard") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="flex-1">Leaderboard</span>
        </Link>

        {/* Messages */}
        <Link 
          href="/influencer/Messages" 
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            pathname.startsWith("/influencer/Messages") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="flex-1">Messages</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-black text-white">
            5
          </span>
        </Link>
      </nav>

      <div className="px-4 mt-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tools & Settings</p>
        <nav className="space-y-1">
          {/* Profile Boost */}
          <Link 
            href="/influencer/profile-boost" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              pathname.startsWith("/influencer/profile-boost") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile Boost</span>
          </Link>

          {/* Earnings */}
          <Link 
            href="/influencer/earnings" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              pathname.startsWith("/influencer/earnings") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Earnings</span>
          </Link>

          {/* Community */}
          <Link 
            href="/influencer/community" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              pathname.startsWith("/influencer/community") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Community</span>
          </Link>

          {/* Settings */}
          <Link 
            href="/influencer/settings" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              pathname.startsWith("/influencer/settings") ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <div className="px-4 mt-8 mb-6">
        <div className="rounded-lg p-4 text-black border">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5" />
            <span className="font-medium">{`${firstName} ${lastName}`}</span>
          </div>
          <p className="text-sm opacity-90">
            {status === 'APPROVED' ? 'Verified Influencer' : 'Aspiring Influencer'}
          </p>
          
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="w-3 h-3" />
              <span className="font-medium">236</span>
              <span className="text-gray-500">Followers</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-600">
              <Star className="w-3 h-3" />
              <span className="text-gray-500">6.5</span>
              <span className="font-medium">Rating</span>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerSidebar;