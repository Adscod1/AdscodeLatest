"use client";
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CustomSidebar from '@/components/ui/custom-sidebar';
import { Profile } from '@prisma/client';
import { getCurrentProfile } from '@/actions/profile';
import { auth } from '@/utils/auth';
import { useIsMobile } from '@/hooks/use-mobile';

import { 
  Settings, 
  User, 
  BarChart3, 
  Users, 
  Bell, 
  HelpCircle,
  Home,
  FileText,
  TrendingUp,
  Shield,
  Palette,
  Globe
} from 'lucide-react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

const SettingsPage = ({ user }: { user: Profile }) => {
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

  
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showProgressStats, setShowProgressStats] = useState(true);
  const [taskCompletion, setTaskCompletion] = useState(true);
  const [communityActivity, setCommunityActivity] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [taskCompletionBottom, setTaskCompletionBottom] = useState(true);
  const [communityActivityBottom, setCommunityActivityBottom] = useState(true);
  const [emailNotificationsBottom, setEmailNotificationsBottom] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
         <CustomSidebar profile={profile} />

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${
        isMobile ? 'pt-20' : ''
      }`}>
        <div className={`${isMobile ? 'p-4' : 'p-8'} max-w-8xl`}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="space-y-8">
            {/* Account Settings */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
              </div>
              <p className="text-gray-600 mb-6">Manage your personal information and account details</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Profile Visibility</div>
                    <div className="text-sm text-gray-600">Make your profile visible to other users</div>
                  </div>
                  <Toggle  enabled={profileVisibility} onChange={setProfileVisibility} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Show Progress Stats</div>
                    <div className="text-sm text-gray-600">Display your qualification progress publicly</div>
                  </div>
                  <Toggle enabled={showProgressStats} onChange={setShowProgressStats} />
                </div>
                
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Edit Profile Information
                </button>
              </div>
            </section>

            {/* Notification Preferences */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="text-green-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              </div>
              <p className="text-gray-600 mb-6">Choose what notifications you want to receive</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Task Completion</div>
                    <div className="text-sm text-gray-600">Get notified when you complete tasks</div>
                  </div>
                  <Toggle enabled={taskCompletion} onChange={setTaskCompletion} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Community Activity</div>
                    <div className="text-sm text-gray-600">Notifications for forum replies and mentions</div>
                  </div>
                  <Toggle enabled={communityActivity} onChange={setCommunityActivity} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive important updates via email</div>
                  </div>
                  <Toggle enabled={emailNotifications} onChange={setEmailNotifications} />
                </div>
              </div>
            </section>

            {/* Second Notification Section */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-6">Choose what notifications you want to receive</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Task Completion</div>
                    <div className="text-sm text-gray-600">Get notified when you complete tasks</div>
                  </div>
                  <Toggle enabled={taskCompletionBottom} onChange={setTaskCompletionBottom} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Community Activity</div>
                    <div className="text-sm text-gray-600">Notifications for forum replies and mentions</div>
                  </div>
                  <Toggle enabled={communityActivityBottom} onChange={setCommunityActivityBottom} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive important updates via email</div>
                  </div>
                  <Toggle enabled={emailNotificationsBottom} onChange={setEmailNotificationsBottom} />
                </div>
              </div>
            </section>

            {/* Privacy & Security */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-red-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
              </div>
              <p className="text-gray-600 mb-6">Control your privacy and security settings</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-600">Add an extra layer of security</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Not Set Up
                    </span>
                    <button className="bg-gray-900 text-white text-xs px-3 py-1 rounded hover:bg-gray-800">
                      Enable
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Data Export</div>
                    <div className="text-sm text-gray-600">Download a copy of your data</div>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Request Export
                  </button>
                </div>
              </div>
            </section>

            {/* App Preferences */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="text-purple-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">App Preferences</h2>
              </div>
              <p className="text-gray-600 mb-6">Customize your app experience</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Dark Mode</div>
                    <div className="text-sm text-gray-600">Switch to dark theme</div>
                  </div>
                  <Toggle enabled={darkMode} onChange={setDarkMode} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Language</div>
                    <div className="text-sm text-gray-600">Choose your preferred language</div>
                  </div>
                  <select className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;