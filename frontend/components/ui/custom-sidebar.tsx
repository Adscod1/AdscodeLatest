"use client";
import React, { useState, useEffect } from 'react';

import { Profile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api-client";
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
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import AllStoresCards from "@/app/(dashboard)/profile/components/all-stores-cards";

interface CustomSidebarProps {
  profile: Profile | null;
  influencer?: any;
  showMobileMenu?: boolean;
  onMobileMenuClose?: () => void;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ profile, influencer: propInfluencer, showMobileMenu = true, onMobileMenuClose }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInfluencerAccount, setHasInfluencerAccount] = useState<boolean | null>(null);
  
  // Check if the user has an influencer account
  useEffect(() => {
    if (propInfluencer !== undefined) {
      setHasInfluencerAccount(!!propInfluencer && Object.keys(propInfluencer).length > 0);
      return;
    }
    
    const checkInfluencerStatus = async () => {
      try {
        const cachedStatus = localStorage.getItem('hasInfluencerAccount');
        if (cachedStatus !== null) {
          setHasInfluencerAccount(cachedStatus === 'true');
          return;
        }
        
        const data = await api.influencers.checkStatus();
        
        setHasInfluencerAccount(!!data.isInfluencer);
        localStorage.setItem('hasInfluencerAccount', data.isInfluencer ? 'true' : 'false');
      } catch (error) {
        console.error('Failed to check influencer status:', error);
        setHasInfluencerAccount(false);
      }
    };
    
    checkInfluencerStatus();
  }, [propInfluencer]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === "/profile" && pathname === "/profile") return true;
    return pathname.includes(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses =
      "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium";
    return isActive(path)
      ? `${baseClasses} text-blue-500  hover:bg-gray-50`
      : `${baseClasses} text-gray-600 hover:text-blue-500 hover:bg-gray-50`;
  };

  const handleLinkClick = () => {
    if (isMobile) {
      if (onMobileMenuClose) {
        onMobileMenuClose();
      } else {
        setIsMobileMenuOpen(false);
      }
    }
  };



  if (!profile) {
    return (
      <>
        {/* Mobile hamburger button */}
        {showMobileMenu && isMobile && !isMobileMenuOpen && (
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="fixed top-4 left-4 z-[9999] p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-100 md:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Mobile overlay */}
        {showMobileMenu && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-[9996] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Loading State */}
        <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          showMobileMenu && isMobile 
            ? `fixed inset-y-0 left-0 z-[9997] transform ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }` 
            : 'relative'
        }`}>
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              {/* Mobile close button */}
              {isMobile && (
                <button 
                  onClick={() => {
                    if (onMobileMenuClose) {
                      onMobileMenuClose();
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 md:hidden"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="animate-pulse space-y-4 mt-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger button */}
      {showMobileMenu && isMobile && !isMobileMenuOpen && (
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-[9999] p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-100 md:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Mobile overlay */}
      {showMobileMenu && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-[9996] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
        showMobileMenu && isMobile 
          ? `fixed inset-y-0 left-0 z-[9997] transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }` 
          : 'relative'
      }`}>
        {/* Logo/Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
      <div className="bg-black text-white p-1.5 rounded-sm mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 258 284">
                    <image xlinkHref="data:image/png;base64,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" x="0" y="0" width="258" height="284"/>
                  </svg>
      </div>
      <span className="text-xl font-bold text-gray-900">
        Adscod
      </span>
    </Link>
            </div>
            {/* Mobile close button */}
            {isMobile && (
              <button 
                onClick={() => {
                  if (onMobileMenuClose) {
                    onMobileMenuClose();
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="p-1 rounded-lg hover:bg-gray-100 md:hidden"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">MAIN</h2>
            <nav className="space-y-1">
              <Link
                href="/profile"
                onClick={handleLinkClick}
                className={getLinkClassName("/profile")}
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/reviews/write"
                onClick={handleLinkClick}
                className={getLinkClassName("/reviews/write")}
              >
                <FileText className="w-4 h-4 mr-3" />
                Write Reviews
              </Link>
              <Link
                href="/ProgressSec/Progress"
                onClick={handleLinkClick}
                className={getLinkClassName("/ProgressSec/Progress")}
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                My Progress
              </Link>
              <Link
                href="/community/forumcommunity"
                onClick={handleLinkClick}
                className={getLinkClassName("/community/forumcommunity")}
              >
                <Users className="w-4 h-4 mr-3" />
                Community
              </Link>
              <Link
                href="/profile/sideprofile"
                onClick={handleLinkClick}
                className={getLinkClassName("/profile/sideprofile")}
              >
                <User className="w-4 h-4 mr-3" />
                Profile
              </Link>
              <Link
                href="#"
                onClick={handleLinkClick}
                className={getLinkClassName("/messages")}
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                Messages
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  14+
                </span>
              </Link>
              <Link
                href="/Notifications/not"
                onClick={handleLinkClick}
                className={getLinkClassName("/Notifications/not")}
              >
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </Link>
              <Link
                href={hasInfluencerAccount ? "/influencer/Dashboard" : "/influencer/register"}
                onClick={handleLinkClick}
                className={getLinkClassName(hasInfluencerAccount ? "/influencer/Dashboard" : "/influencer/register")}
              >
                <Box className="w-4 h-4 mr-3 " />
                {hasInfluencerAccount ? "Influencer Dashboard" : "Become an Influencer"}
              </Link>
              <Link
                href="/new"
                onClick={handleLinkClick}
                className={getLinkClassName("/new")}
              >
                <Plus className="w-4 h-4 mr-3 " />
                Create Store
              </Link>

              <AllStoresCards />
            </nav>
          </div>

          {/* Personal Section */}
          <div className="space-y-1 mt-8">
            
            <nav className="space-y-1">
      
              <Link
                href="/Settingss"
                onClick={handleLinkClick}
                className={getLinkClassName("/Settingss")}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Link>
              <Link
                href="/Help"
                onClick={handleLinkClick}
                className={getLinkClassName("/Help")}
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Help Center
              </Link>
            </nav>
          </div>
        </div>
       
      </aside>
    </>
  );
};

export default CustomSidebar;