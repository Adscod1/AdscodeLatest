"use client";
import React, { useState, useEffect } from 'react';

import { Profile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Bell,
  Settings,
  HelpCircle,
  FileText,
  MessageSquare,
  Box,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';
import { ProfileEditForm } from "@/app/(dashboard)/profile/components/profile-edit-form";
import AllStoresCards from "@/app/(dashboard)/profile/components/all-stores-cards";

interface CustomSidebarProps {
  profile: Profile | null;
  influencer?: any;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ profile, influencer: propInfluencer }) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasInfluencerAccount, setHasInfluencerAccount] = useState<boolean | null>(null);
  
  // Check if the user has an influencer account
  useEffect(() => {
    // If influencer was provided as a prop, use that
    if (propInfluencer !== undefined) {
      setHasInfluencerAccount(!!propInfluencer && Object.keys(propInfluencer).length > 0);
      return;
    }
    
    // Otherwise, check from localStorage or fetch from API
    const checkInfluencerStatus = async () => {
      try {
        // First check localStorage to avoid unnecessary API calls
        const cachedStatus = localStorage.getItem('hasInfluencerAccount');
        if (cachedStatus !== null) {
          setHasInfluencerAccount(cachedStatus === 'true');
          return;
        }
        
        // Fetch from API if needed (this would be replaced with your actual API call)
        const response = await fetch('/api/check-influencer-status');
        const data = await response.json();
        
        setHasInfluencerAccount(!!data.isInfluencer);
        localStorage.setItem('hasInfluencerAccount', data.isInfluencer ? 'true' : 'false');
      } catch (error) {
        console.error('Failed to check influencer status:', error);
        setHasInfluencerAccount(false);
      }
    };
    
    checkInfluencerStatus();
  }, [propInfluencer]);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false); // Close sidebar on mobile by default
      } else {
        setIsOpen(true); // Open sidebar on desktop by default
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const avatarUrl =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.name || "User"
    )}&background=DC143C&color=fff&size=150`;

  const isActive = (path: string) => pathname === path;

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false); // Close sidebar on mobile when clicking a link
    }
  };

  // Mock categories for now - you can fetch these from your API
  const userCategories = ["Fashion", "Beauty", "Shopping"];

  if (!profile) {
    return (
      <>
        {/* Overlay for mobile */}
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
        
        {/* Toggle button - positioned at sidebar edge */}
        <button
        onClick={toggleSidebar}
        className={`fixed h-10 w-10 top-1/2 -translate-y-1/2 right-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300 ${
          isMobile 
            ? 'left-4' 
            : isOpen && !isCollapsed 
              ? 'left-10' 
              : 'left-10'
        }`}
      >
        {(isMobile && isOpen) || (!isMobile && !isCollapsed && isOpen) ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>


        <aside className={`
          ${isMobile ? 'fixed' : 'relative'} 
          ${isCollapsed && !isMobile ? 'w-16' : 'w-64'} 
          bg-white border-r border-gray-200 min-h-screen z-40 transition-all duration-300
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
        `}>
          <div className="p-4">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                {(!isCollapsed || isMobile) && (
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Overlay for mobile - transparent to show content behind */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={`fixed h-10 w-10 top-1/2 -translate-y-1/2 right-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300 ${
          isMobile 
            ? 'right-4' 
            : isOpen && !isCollapsed 
              ? 'right-4' 
              : 'right-4'
        }`}
      >
        {(isMobile && isOpen) || (!isMobile && !isCollapsed && isOpen) ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      <aside className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isCollapsed && !isMobile ? 'w-16' : 'w-64'} 
        bg-white border-r border-gray-200 min-h-screen z-40 transition-all duration-300
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
      `}>
        <div className="p-4">
          {/* Profile Section */}
          <div className=" items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src={avatarUrl}
                alt={profile?.name || "Profile"}
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            
            {(!isCollapsed || isMobile) && (
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="w-full">
                    <ProfileEditForm
                      profile={profile}
                      onSuccess={() => {
                        setIsEditing(false);
                        queryClient.invalidateQueries({
                          queryKey: ["profile", profile.id],
                        });
                      }}
                      onCancel={() => setIsEditing(false)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{profile?.name || "Anonymous User"}</p>
                      <button
                        className="text-blue-500 text-xs hover:text-blue-700"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{profile?.role || "User"}</p>
                    
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">236</span>
                        <span className="text-gray-500">Followers</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-600">
                        <User className="w-3 h-3" />
                        <span className="font-medium">128</span>
                        <span className="text-gray-500">Following</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bio Section */}
          {(!isCollapsed || isMobile) && !isEditing && (
            <div className="px-2 py-4 border-b border-gray-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-sm">Bio</h2>
                <button
                  className="text-blue-500 text-xs hover:text-blue-700"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {profile?.bio || "No bio available. Click edit to add your bio."}
              </p>
            </div>
          )}
          
          <nav className="space-y-2">
            {(!isCollapsed || isMobile) && (
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">MAIN</div>
            )}
            
            <Link 
              href="/profile" 
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg group ${
                isActive('/profile') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "Dashboard" : ""}
            >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Dashboard</span>}
            </Link>
            
            <Link 
              href="/reviews/write" 
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group ${
                isActive('/reviews/write') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "Write Reviews" : ""}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Write Reviews</span>}
            </Link>
            
            <Link 
              href="/ProgressSec/Progress" 
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group ${
                isActive('/ProgressSec/Progress') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "My Progress" : ""}
            >
                <TrendingUp className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>My Progress</span>}
            </Link>
            
            <Link 
              href="/community/forumcommunity" 
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group ${
                isActive('/community/forumcommunity') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "Community" : ""}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Community</span>}
            </Link>
            
            <Link 
              href="/profile/sideprofile" 
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group ${
                isActive('/profile/sideprofile') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "Profile" : ""}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Profile</span>}
            </Link>

            {(!isCollapsed || isMobile) && (
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 mt-6">FEATURES</div>
            )}
            
            <Link 
              href="/Notifications/not"
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group ${
                isActive('/Notifications/not') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "Notifications" : ""}
            >
              <Bell className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Notifications</span>}
            </Link>
            
            <Link 
              href="#" 
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg group"
              title={isCollapsed ? "Messages" : ""}
            >
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Messages</span>}
            </Link>
          </nav>

          {/* Action buttons */}
          {(!isCollapsed || isMobile) && (
            <div className="space-y-2 mt-6">
              <Link 
                href={hasInfluencerAccount ? "/influencer/Dashboard" : "/influencer/register"} 
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group hover:bg-gray-50"
                title={hasInfluencerAccount ? "Influencer Dashboard" : "Become an Influencer"}
              >
                <Box className="w-5 h-5 flex-shrink-0" />
                <span>{hasInfluencerAccount ? "Influencer Dashboard" : "Become an Influencer"}</span>
              </Link>
              <Link 
                href="/new" 
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group hover:bg-gray-50"
                title="Create Store"
              >
                <Box className="w-5 h-5 flex-shrink-0" />
                <span>Create Store</span>
              </Link>
            </div>
          )}
          
          {/* Collapsed action buttons - icon only */}
          {isCollapsed && !isMobile && (
            <div className="space-y-2 mt-6">
              <Link 
                href={hasInfluencerAccount ? "/influencer/Dashboard" : "/influencer/register"} 
                onClick={handleLinkClick}
                className="flex items-center justify-center px-3 py-2 text-gray-700 rounded-lg group hover:bg-gray-50"
                title={hasInfluencerAccount ? "Influencer Dashboard" : "Become an Influencer"}
              >
                <Box className="w-5 h-5 flex-shrink-0" />
              </Link>
              <Link 
                href="/new" 
                onClick={handleLinkClick}
                className="flex items-center justify-center px-3 py-2 text-gray-700 rounded-lg group hover:bg-gray-50"
                title="Create Store"
              >
                <Box className="w-5 h-5 flex-shrink-0" />
              </Link>
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link 
              href="/Settingss" 
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group ${
                isActive('/Settingss') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "Settings" : ""}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Settings</span>}
            </Link>
            
            <Link 
              href="/Help" 
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg group ${
                isActive('/Help') ? 'border border-blue-200' : 'hover:bg-gray-50'
              }`}
              title={isCollapsed ? "Help Center" : ""}
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span>Help Center</span>}
            </Link>
          </div>
        </div>
        <AllStoresCards />
      </aside>
    </>
  );
};

export default CustomSidebar;