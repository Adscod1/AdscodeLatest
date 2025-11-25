"use client";
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Profile } from '@prisma/client';
import { auth } from '@/utils/auth';
import { getCurrentProfile } from '@/lib/api-client';
import { 
  Bell, 
  CheckCircle, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Lightbulb,
  User,
  BarChart3,
  Edit,
  Users,
  UserCircle,
  Settings,
  HelpCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'reply' | 'milestone' | 'tip';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  category?: 'main' | 'features' | 'settings';
}

const NotificationsDashboard = ({ user }: { user: Profile }) => {
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

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Profile Setup Complete!',
      description: "You've successfully completed your profile setup. Great job!",
      timestamp: '2 hours ago',
      isRead: false,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      id: '2',
      type: 'info',
      title: 'Review Approved',
      description: "Your review for 'Wireless Headphones Pro' has been approved and is now live.",
      timestamp: '5 hours ago',
      isRead: false,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      id: '3',
      type: 'reply',
      title: 'New Forum Reply',
      description: "Someone replied to your post in 'Review Writing Tips' forum.",
      timestamp: '1 day ago',
      isRead: true,
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />
    },
    {
      id: '4',
      type: 'milestone',
      title: 'Halfway There!',
      description: "You've completed 5 out of 10 required reviews. Keep going!",
      timestamp: '2 days ago',
      isRead: true,
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />
    },
    {
      id: '5',
      type: 'tip',
      title: 'Pro Tip',
      description: 'Add more photos to your reviews to increase engagement and likes.',
      timestamp: '3 days ago',
      isRead: true,
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />
    }
  ]);

  const menuItems: MenuItem[] = [
    // Main section
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, category: 'main' },
    { id: 'write-reviews', label: 'Write Reviews', icon: <Edit className="w-5 h-5" />, category: 'main' },
    { id: 'my-progress', label: 'My Progress', icon: <TrendingUp className="w-5 h-5" />, category: 'main' },
    { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" />, category: 'main' },
    { id: 'profile', label: 'Profile', icon: <UserCircle className="w-5 h-5" />, category: 'main' },
    
    // Features section
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, category: 'features', isActive: true },
    
    // Settings section
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, category: 'settings' },
    { id: 'help', label: 'Help Center', icon: <HelpCircle className="w-5 h-5" />, category: 'settings' }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id 
        ? { ...notification, isRead: !notification.isRead }
        : notification
    ));
  };

  const getNotificationBgColor = (type: Notification['type'], isRead: boolean) => {
    if (isRead) return 'bg-gray-50';
    
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'info': return 'bg-yellow-50';
      case 'reply': return 'bg-blue-50';
      case 'milestone': return 'bg-purple-50';
      case 'tip': return 'bg-amber-50';
      default: return 'bg-gray-50';
    }
  };

  const renderMenuSection = (category: string, title: string) => {
    const items = menuItems.filter(item => item.category === category);
    
    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {title}
        </h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                item.isActive
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <DashboardLayout profile={profile}>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Notifications</h1>
                <p className="text-sm sm:text-base text-gray-600">Stay updated on your progress and community activity</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full text-center">
                    {unreadCount} unread
                  </span>
                )}
                <button
                  onClick={markAllAsRead}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 text-center sm:text-left"
                >
                  Mark All as Read
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 sm:space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${getNotificationBgColor(notification.type, notification.isRead)} rounded-xl border border-gray-200 p-4 sm:p-6 transition-all duration-200 hover:shadow-sm cursor-pointer`}
                  onClick={() => toggleNotificationRead(notification.id)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-1 space-y-1 sm:space-y-0">
                        <h3 className={`text-sm font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'} pr-2`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`text-xs ${notification.isRead ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notification.timestamp}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className={`text-xs sm:text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'} leading-relaxed`}>
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {notifications.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-sm sm:text-base text-gray-600 px-4">You're all caught up! Check back later for updates.</p>
              </div>
            )}
          </div>
    </DashboardLayout>
  );
};

export default NotificationsDashboard;