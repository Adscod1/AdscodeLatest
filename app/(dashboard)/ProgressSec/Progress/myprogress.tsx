"use client";
import React from 'react';
import { getCurrentProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import CustomSidebar from "@/components/ui/custom-sidebar";
import { Profile, Role } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users, 
  Settings, 
  HelpCircle, 
  Bell,
  Camera,
  MessageSquare,
  Star,
  Box,
  Play,
  ThumbsUp,
  CheckCircle,
  Clock
} from 'lucide-react';


    const ProgressDashboard = ({ user }: { user: Profile }) => {
      const queryClient = useQueryClient();
      
    
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
    
      const [isEditing, setIsEditing] = useState(false);
    
  const [activeTab, setActiveTab] = useState('progress');

  const sidebarItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'reviews', icon: FileText, label: 'Write Reviews' },
    { id: 'progress', icon: TrendingUp, label: 'My Progress', active: true },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const featureItems = [
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help Center' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomSidebar profile={profile} />

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Influencer Qualification</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Complete all requirements to become a verified influencer</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 xl:gap-12">
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">375/2025</div>
                <div className="text-xs sm:text-sm text-gray-500">Points Earned</div>
                <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-gray-900 rounded-full" style={{width: '18.5%'}}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">4/12</div>
                <div className="text-xs sm:text-sm text-gray-500">Tasks Complete</div>
                <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-green-600 rounded-full" style={{width: '33.3%'}}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">75%</div>
                <div className="text-xs sm:text-sm text-gray-500">Overall Progress</div>
                <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-purple-600 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Requirements Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Influencer Requirements Summary</h2>
            <p className="text-blue-800 mb-4 text-sm sm:text-base">To become a verified influencer on Adsook, you must meet these minimum requirements:</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">10+ Reviews</div>
                <div className="text-xs sm:text-sm text-gray-600">Quality product reviews</div>
              </div>
              <div className="text-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">1K+ Followers</div>
                <div className="text-xs sm:text-sm text-gray-600">On main platform</div>
              </div>
              <div className="text-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Play className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">5+ Videos</div>
                <div className="text-xs sm:text-sm text-gray-600">Engaging content</div>
              </div>
              <div className="text-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">4.5+ Rating</div>
                <div className="text-xs sm:text-sm text-gray-600">Review quality score</div>
              </div>
            </div>
          </div>

          {/* Profile Setup */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Profile Setup</h3>
              <p className="text-sm sm:text-base text-gray-600">Complete your profile to get started</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start sm:items-center space-x-3 mb-4 sm:mb-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Add Profile Picture</div>
                      <div className="text-xs sm:text-sm text-gray-600">Upload a professional profile picture</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-600 mr-1" />
                          <div className="text-xs sm:text-sm font-medium text-yellow-600">50 points</div>
                        </div>
                        <div className="text-xs text-gray-500">Required for verification</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:ml-4">
                    <span className="text-sm text-green-600 font-medium">Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start sm:items-center space-x-3 mb-4 sm:mb-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Complete Bio & Social Links</div>
                      <div className="text-xs sm:text-sm text-gray-600">Write a compelling bio and link your social accounts</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-600 mr-1" />
                          <div className="text-xs sm:text-sm font-medium text-yellow-600">75 points</div>
                        </div>
                        <div className="text-xs text-gray-500">Must include at least 2 social platforms</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:ml-4">
                    <span className="text-sm text-green-600 font-medium">Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Writing Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Review Writing Requirements</h3>
              <p className="text-sm sm:text-base text-gray-600">Build credibility through quality reviews</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Write Product Reviews</div>
                      <div className="text-xs sm:text-sm text-gray-600">Write 10 detailed product reviews (min 200 words each)</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-600 mr-1" />
                          <div className="text-xs sm:text-sm font-medium text-yellow-600">200 points</div>
                        </div>
                        <div className="text-xs text-orange-500">In Progress</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-xs text-gray-500">Progress: 6/10 reviews</div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>60%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-900 rounded-full w-3/5"></div>
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 border border-gray-600 text-black rounded-lg hover:bg-gray-100 transition-colors text-sm">
                    Continue Progress
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ThumbsUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Receive Review Likes</div>
                      <div className="text-xs sm:text-sm text-gray-600">Get at least 50 likes across all your reviews</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-600 mr-1" />
                          <div className="text-xs sm:text-sm font-medium text-yellow-600">150 points</div>
                        </div>
                        <div className="text-xs text-orange-500">In Progress</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-xs text-gray-500">Progress: 32/50 likes</div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>64%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-900 rounded-full" style={{width: '64%'}}></div>
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                    Continue Progress
                  </button>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Maintain Review Quality</div>
                      <div className="text-xs sm:text-sm text-gray-600">Achieve 4.5+ average rating on your reviews</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-600 mr-1" />
                          <div className="text-xs sm:text-sm font-medium text-yellow-600">100 points</div>
                        </div>
                        <div className="text-xs text-gray-500">Current rating: 4.7/5.0</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600 font-medium">Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Follower & Engagement Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Follower & Engagement Requirements</h3>
              <p className="text-sm sm:text-base text-gray-600">Build your audience and engagement</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Build Instagram Following</div>
                      <div className="text-xs sm:text-sm text-gray-600">Reach 1,000+ Instagram followers</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="text-xs sm:text-sm font-medium text-yellow-600">⚡ 250 points</div>
                        <div className="text-xs text-orange-500">In Progress</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-xs text-gray-500">Progress: 756/1,000 followers</div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>76%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-900 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                    Continue Progress
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">TikTok/YouTube Presence</div>
                      <div className="text-xs sm:text-sm text-gray-600">Have 500+ followers on TikTok or YouTube</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="text-xs sm:text-sm font-medium text-yellow-600">⚡ 200 points</div>
                        <div className="text-xs text-blue-500">Available</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-xs text-gray-500">Choose one platform to focus on</div>
                  <button className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                    Start Task
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Engagement Rate Goal</div>
                      <div className="text-xs sm:text-sm text-gray-600">Maintain 3%+ engagement rate for 30 days</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="text-xs sm:text-sm font-medium text-yellow-600">⚡ 150 points</div>
                        <div className="text-xs text-blue-500">Available</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                    Start Task
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Creation Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Content Creation Skills</h3>
              <p className="text-sm sm:text-base text-gray-600">Demonstrate content creation abilities</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Create Video Content</div>
                      <div className="text-xs sm:text-sm text-gray-600">Post 5 engaging videos (min 30 seconds each)</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="text-xs sm:text-sm font-medium text-yellow-600">⚡ 200 points</div>
                        <div className="text-xs text-orange-500">In Progress</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-xs text-gray-500">Progress: 3/5 videos</div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>60%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-900 rounded-full w-3/5"></div>
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                    Continue Progress
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Photography Portfolio</div>
                      <div className="text-xs sm:text-sm text-gray-600">Upload 20 high-quality product photos</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="text-xs sm:text-sm font-medium text-yellow-600">⚡ 150 points</div>
                        <div className="text-xs text-green-500">Completed</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 text-xs text-gray-500">All photos approved</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600 font-medium">Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Qualifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Advanced Qualifications</h3>
              <p className="text-sm sm:text-base text-gray-600">Final steps to become a verified influencer</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-500 text-sm sm:text-base">Complete Brand Challenge</div>
                      <div className="text-xs sm:text-sm text-gray-400">Successfully complete a trial brand collaboration</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="text-xs sm:text-sm font-medium text-gray-400">⚡ 300 points</div>
                        <div className="text-xs text-gray-400">Locked</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 text-xs text-gray-400">Unlocks after completing previous tasks</div>
                  <button className="w-full py-2 px-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm" disabled>
                    🔒 Complete previous requirements
                  </button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-500 text-sm sm:text-base">Community Leadership</div>
                      <div className="text-xs sm:text-sm text-gray-400">Help 5 new users complete their first review</div>
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <div className="text-xs sm:text-sm font-medium text-gray-400">⚡ 200 points</div>
                        <div className="text-xs text-gray-400">Locked</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 text-xs text-gray-400">Mentor role requirement</div>
                  <button className="w-full py-2 px-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm" disabled>
                    🔒 Complete previous requirements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;