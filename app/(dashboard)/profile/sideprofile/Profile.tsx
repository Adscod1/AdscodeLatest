"use client";
import React, { useState } from 'react';
import { getCurrentProfile } from "@/actions/profile";
import { Profile } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomSidebar from "@/components/ui/custom-sidebar";
import { auth } from "@/utils/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from 'next/image';

import { 
  Home, 
  Edit3, 
  TrendingUp, 
  Users, 
  User, 
  Bell, 
  Settings, 
  HelpCircle,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share,
  Award,
  Star
} from 'lucide-react';

interface Post {
  id: number;
  content: string;
  emoji: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}

const SocialProfile = ({ user }: { user: Profile }) => {
      const queryClient = useQueryClient();
      const isMobile = useIsMobile();
      
    
      const { data: profile } = useQuery({
        queryKey: ["profile", user.id],
        queryFn: getCurrentProfile,
        initialData: user,
      });
    
      const avatarUrl =
        profile?.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profile?.name || "User"
        )}&background=DC143C&color=fff&size=150`;
    
     
    

  const [activeTab, setActiveTab] = useState<'recent' | 'achievements' | 'analytics'>('recent');
  const [sidebarTab, setSidebarTab] = useState<'recent' | 'achievements'>('recent');

  const posts: Post[] = [
    {
      id: 1,
      content: "Just tried the new coffee shop downtown - amazing latte art!",
      emoji: "☕",
      likes: 124,
      comments: 18,
      shares: 5,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      content: "Working on some exciting new content. Can't wait to share it with you all!",
      emoji: "📱",
      likes: 89,
      comments: 12,
      shares: 3,
      timeAgo: "1 day ago"
    },
    {
      id: 3,
      content: "Beautiful sunset from today's hike. Nature never fails to inspire",
      emoji: "🌅",
      likes: 156,
      comments: 23,
      shares: 8,
      timeAgo: "2 days ago"
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 1,
      title: "Profile Complete",
      description: "Completed profile setup",
      date: "Mar 15",
      icon: <Star className="w-4 h-4 text-yellow-500" />
    },
    {
      id: 2,
      title: "First Post",
      description: "Shared your first content",
      date: "Mar 16",
      icon: <Star className="w-4 h-4 text-yellow-500" />
    },
    {
      id: 3,
      title: "Engagement Master",
      description: "Achieved 100+ likes on a post",
      date: "Mar 20",
      icon: <Star className="w-4 h-4 text-yellow-500" />
    },
    {
      id: 4,
      title: "Community Builder",
      description: "Engaged with 20+ posts",
      date: "Mar 22",
      icon: <Star className="w-4 h-4 text-yellow-500" />
    }
  ];

  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", active: true },
    { icon: <Edit3 className="w-5 h-5" />, label: "Write Reviews" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "My Progress" },
    { icon: <Users className="w-5 h-5" />, label: "Community" },
    { icon: <User className="w-5 h-5" />, label: "Profile", highlighted: true }
  ];

  const featureItems = [
    { icon: <Bell className="w-5 h-5" />, label: "Notifications" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings" },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Help Center" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
        <CustomSidebar profile={profile} />

      {/* Main Content */}
      <div className={`flex-1 min-w-0 flex flex-col ${
        isMobile ? 'pt-20' : ''
      }`}>
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
               <Image
                             src={avatarUrl}
                             alt={profile?.name || "Profile"}
                             width={80}
                             height={80}
                             className="rounded-full w-16 h-16 sm:w-20 sm:h-20"
                           />
              </div>

              {/* Profile Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{profile?.name || "Anonymous User"}</h1>
                  <span className="text-sm sm:text-base text-gray-600">{profile?.role || "User"}</span>
                </div>
                <div className="flex items-center space-x-1 mb-3">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">Regular User</span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md">
                  Content creator passionate about lifestyle, tech, and travel. Building authentic connections through engaging storytelling.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Joined March 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 text-center hover:border-gray-300 transition-colors">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">856</div>
              <div className="text-xs sm:text-sm text-gray-500">Followers</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 text-center hover:border-gray-300 transition-colors">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">234</div>
              <div className="text-xs sm:text-sm text-gray-500">Following</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 text-center hover:border-gray-300 transition-colors">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mb-1">47</div>
              <div className="text-xs sm:text-sm text-gray-500">Posts</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 text-center hover:border-gray-300 transition-colors">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 mb-1">4.2%</div>
              <div className="text-xs sm:text-sm text-gray-500">Engagement</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Tabs */}
          <div className="flex space-x-4 sm:space-x-8 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('recent')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'recent'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Posts
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'achievements'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'analytics'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Content Based on Active Tab */}
          {activeTab === 'recent' && (
            <div className="space-y-4 sm:space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-gray-900 mb-4 break-words">{post.content} {post.emoji}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-red-500 transition-colors w-fit">
                          <Heart className="w-4 h-4 flex-shrink-0" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors w-fit">
                          <MessageCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-500 transition-colors w-fit">
                          <Share className="w-4 h-4 flex-shrink-0" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{post.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-3 sm:space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{achievement.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{achievement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="flex flex-col xl:flex-row gap-6 sm:gap-8">
              {/* Growth Metrics Card */}
              <div className="flex-1 bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Growth Metrics</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Your account growth over time</p>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Follower Growth</span>
                    <span className="text-xs sm:text-sm font-medium text-green-600">+12% this month</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Engagement Rate</span>
                    <span className="text-xs sm:text-sm font-medium text-blue-600">4.2% average</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Post Frequency</span>
                    <span className="text-xs sm:text-sm font-medium text-purple-600">3 posts/week</span>
                  </div>
                </div>
              </div>

              {/* Top Content Card */}
              <div className="flex-1 bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Top Content</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Your best performing posts</p>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">Sunset hiking post</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">156 likes</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">Coffee shop review</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">124 likes</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">Behind the scenes</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">89 likes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialProfile;