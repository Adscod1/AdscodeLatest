"use client";
import React, { useState, useEffect } from 'react';
import { Profile } from "@prisma/client";
import Image from "next/image";
import { Menu } from 'lucide-react';
import CustomSidebar from "./custom-sidebar";
import { ProfileCard } from "./profile-card";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardLayoutProps {
  profile: Profile | null;
  influencer?: any;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  profile, 
  influencer, 
  children 
}) => {
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

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

  const avatarUrl =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.name || "User"
    )}&background=000000&color=fff&size=150`;

  const handleProfileSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["profile", profile?.id],
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile hamburger button - only show when menu is closed */}
      {isMobile && !isMobileMenuOpen && (
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-[999] p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-100 md:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-[9990] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <CustomSidebar 
          profile={profile} 
          influencer={influencer} 
          showMobileMenu={false}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={`fixed inset-y-0 left-0 z-[9999] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <CustomSidebar 
            profile={profile} 
            influencer={influencer} 
            showMobileMenu={false}
            onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}
      
      <main className="flex-1 overflow-auto">
        {/* Top Bar with Profile Photo */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsProfileCardOpen(true)}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt={profile?.name || "Profile"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {profile?.name || "User"}
              </span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Profile Card Modal */}
      <ProfileCard
        profile={profile}
        isOpen={isProfileCardOpen}
        onClose={() => setIsProfileCardOpen(false)}
        onSuccess={handleProfileSuccess}
      />
    </div>
  );
};
