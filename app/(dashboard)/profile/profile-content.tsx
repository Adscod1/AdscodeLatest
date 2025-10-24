"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile, Role } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomSidebar from "@/components/ui/custom-sidebar";
import {
  ArrowUp,
  Bell,
  Star,
  Box,
  Filter,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  ChevronRight,
  Clock,
  Share,
  FileText,
  CheckCircle,
  Users,
  User,
  Search,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserEngagement from "./components/user-engagement";
import UserLocation from "./components/user-location";
import { useState, useEffect } from "react";
import { ProfileEditForm } from "./components/profile-edit-form";
import { getCurrentProfile } from "@/actions/profile";
import AllStoresCards from "./components/all-stores-cards";
import { DashboardLayout } from "@/components/ui/dashboard-layout";

const fetchUserStats = async () => {
  // This would be your API call to fetch user stats
  return {
    followers: "11.5K",
    engagement: "5.34",
    categories: ["Fashion", "Shopping", "Beauty"],
    location: "Kampala, Uganda",
    role: "Product Reviewer",
    bio: "Eu aliquam fugiat magna reprehenderit reprehenderit tempor aliqua nisi officia irure qui sit. Labore pariatur ex ut aliqua ad deserunt sint duis non eiusmod deserunt eu lab labore mollit consectetur in quis. Adipisicing magna 🔥🔥🔥",
  };
};

const ProfileContent = ({ user }: { user: Profile }) => {
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const { data: userStats } = useQuery({
    queryKey: ["userStats", user.id],
    queryFn: fetchUserStats,
  });

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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <DashboardLayout profile={profile}>
          <div className="overflow-x-hidden">
          {/* Welcome Banner */}
          <div className="border border-2xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-black mb-6 sm:mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                Welcome {profile?.name || "Anonymous User"}
              </h1>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                Complete your first tasks to become an Aspiring Influencer
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="bg-white/20 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm">Current Level</p>
                  <p className="text-lg sm:text-xl font-semibold">New User</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm">Points Earned</p>
                  <p className="text-lg sm:text-xl font-semibold">125 / 500</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <span className="text-grey-500">Progress to Aspiring Influencer</span>
                  <span className="text-white font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-200 bg-opacity-30 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Decorative Star - Hidden on mobile */}
            <div className="absolute top-8 sm:top-16 right-4 sm:right-8 p-2 sm:p-4 bg-white/20 border rounded-full hidden sm:block">
              <Star className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-yellow-400" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-xs sm:text-sm">Reviews Written</h3>
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">2/5</div>
              <p className="text-xs text-blue-500">3 more to advance</p>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-xs sm:text-sm">Social Accounts</h3>
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">1/2</div>
              <p className="text-xs text-green-600">Connect Instagram/TikTok</p>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-xs sm:text-sm">Profile Complete</h3>
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">80%</div>
              <p className="text-xs text-purple-500">Add bio & photo</p>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-xs sm:text-sm">Points Earned</h3>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">125</div>
              <p className="text-xs text-yellow-700">375 to next level</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Your Next Steps */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Next Steps</h2>
                  <button className="text-blue-600 text-xs sm:text-sm font-medium flex items-center space-x-1 hover:text-blue-700">
                    <span className="hidden sm:inline">View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Complete these to become an Aspiring Influencer</p>
              </div>
              
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Profile Setup</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Added profile picture</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">Complete</span>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 border bg-blue-50 border-gray-200 rounded-lg hover:bg-gray-50">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Write 3 More Reviews</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Progress: 2/5 completed</p>
                  </div>
                  <button className="bg-gray-900 text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 whitespace-nowrap">
                    <span className="hidden sm:inline">Start Writing</span>
                    <span className="sm:hidden">Start</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 border bg-yellow-50 border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Connect Social Media</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Link Instagram or TikTok account</p>
                  </div>
                  <button className="bg-blue-600 text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 whitespace-nowrap">
                    <span className="hidden sm:inline">Connect Now</span>
                    <span className="sm:hidden">Connect</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Your Journey */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Journey</h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Progression through Adscod levels</p>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Current Level - New User */}
                <div className="relative bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="font-medium text-gray-900 text-sm sm:text-base">New User</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">Current Level</span>
                  </div>
                  
                  <div className="rounded-lg p-3 sm:p-4">
                    <p className="font-medium text-green-600 mb-3 text-sm sm:text-base">Welcome to Adscod! Start your journey here.</p>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-green-600">Create profile</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-green-600">Write first reviews</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-green-600">Connect social media</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Next Level - Aspiring Influencer */}
                <div className="relative border border-blue-200 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">Aspiring Influencer</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">Next Level</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <p className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Build your audience and credibility</p>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                        <span>5+ quality reviews</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                        <span>500+ social followers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                        <span>Regular content creation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Future Level - Verified Influencer */}
                <div className="relative opacity-60">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full bg-gray-100"></div>
                      <span className="font-medium text-gray-500 text-sm sm:text-base">Verified Influencer</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium whitespace-nowrap">Future</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <p className="font-medium text-gray-500 mb-3 text-sm sm:text-base">Access exclusive brand partnerships</p>
                    <ul className="text-xs sm:text-sm text-gray-500 space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                        <span>10+ reviews, 4.5+ rating</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                        <span>5000+ views per post</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                        <span>Brand collaboration ready</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
    </DashboardLayout>
  );
};

export default ProfileContent;