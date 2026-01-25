"use client";
import { getCurrentProfile } from "@/lib/api-client";
import { Profile } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from 'react';
import { 
  User, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users, 
  Bell, 
  Settings, 
  HelpCircle,
  MessageCircle,
  Eye,
  Clock,
  Award
} from 'lucide-react';

interface ForumSection {
  id: string;
  title: string;
  description: string;
  posts: number;
  members: number;
  lastActivity: string;
  isActive: boolean;
}

 const CommunityForums = ({ user }: { user: Profile }) => {
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
    
      const [isEditing, setIsEditing] = useState(false);
    
  const [activeTab, setActiveTab] = useState('progress');

  const [activeSection, setActiveSection] = useState('community');

  const forumSections: ForumSection[] = [
    {
      id: 'new-user-help',
      title: 'Rising Creator Help and Support',
      description: 'Get help with your journey to becoming a Pro Creator',
      posts: 245,
      members: 1200,
      lastActivity: '2 hours ago',
      isActive: true
    },
    {
      id: 'review-writing',
      title: 'Review Writing Tips',
      description: 'Share techniques for writing compelling product reviews',
      posts: 189,
      members: 856,
      lastActivity: '5 hours ago',
      isActive: true
    },
    {
      id: 'social-media-growth',
      title: 'Social Media Growth',
      description: 'Strategies for growing your social media presence',
      posts: 156,
      members: 634,
      lastActivity: '1 day ago',
      isActive: false
    },
    {
      id: 'success-stories',
      title: 'Success Stories',
      description: 'Share your journey from New User to Verified Influencer',
      posts: 89,
      members: 423,
      lastActivity: '3 days ago',
      isActive: false
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', active: false },
    { id: 'write-reviews', icon: FileText, label: 'Write Reviews', active: false },
    { id: 'my-progress', icon: TrendingUp, label: 'My Progress', active: false },
    { id: 'community', icon: Users, label: 'Community', active: true },
    { id: 'profile', icon: User, label: 'Profile', active: false },
  ];

  const features = [
    { icon: Bell, label: 'Notifications' },
    { icon: MessageCircle, label: 'Available for Auditing' },
    { icon: Award, label: 'Rewards for Writing' },
    { icon: Eye, label: 'Activities for Verifying' }
  ];

  return (
    <DashboardLayout profile={profile}>
        <div className="w-full max-w-none bg-gray-50">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Community Forums</h1>
              <p className="text-sm sm:text-base text-gray-600">Connect with other users and share experiences</p>
            </div>
            <button className="text-md sm:text-md font-medium text-white cursor-pointer hover:text-white hover:bg-blue-600 bg-blue-500 rounded-full p-2 m-2">+ Create Forum</button>
          </div>

          {/* Forum Sections */}
          <div className="space-y-4 sm:space-y-6">
            {forumSections.map((section) => (
              <div key={section.id} className="bg-white rounded border border-gray-50 p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{section.title}</h3>
                      {section.isActive && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-base rounded-full w-fit">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">{section.description}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{section.posts} posts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>{section.members} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>Last activity {section.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Community Guidelines */}
          <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-50 rounded p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <Award className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-blue-600 mb-1 text-sm sm:text-base">Community Guidelines</h3>
                <span>
                {/* <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors">
                    Read More
                  </button> */}
                </span>
                <p className="text-blue-500 text-xs sm:text-sm">
                  Be respectful, help others, and share authentic experiences to build a supportive community
                </p>
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default CommunityForums;