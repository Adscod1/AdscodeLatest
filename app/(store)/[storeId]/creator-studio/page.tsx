"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoreApplications } from '@/actions/campaign';
import { 
  BarChart3, 
  Users, 
  Target, 
  Heart, 
  MessageCircle, 
  Eye, 
  TrendingUp, 
  Search, 
  Star,
  MapPin,
  Send,
  UserPlus,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Camera,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Loader2
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, addDays, startOfMonth, startOfWeek, endOfMonth, isSameMonth, isSameDay } from "date-fns";


interface Creator {
  id: string;
  name: string;
  handle: string;
  followers: string;
  engagement: string;
  category: string;
  rating: string;
  rate: string;
  location: string;
  icon?: string;
  email?: string;
  bio?: string;
  platforms?: {
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  userId?: string;
  image?: string;
}

interface Influencer {
  name: string;
  username: string;
  avatar: string;
  category: string;
  followers: string;
  engagement: string;
  rating: number;
  location: string;
  joinedDate: string;
  bio: string;
  platforms: {
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  demographics: {
    '18-24': number;
    '25-34': number;
    '35-44': number;
    '45+': number;
  };
  audienceGender: { female: number; male: number };
  topLocations: Array<{ country: string; rank: number }>;
  performance: {
    totalCampaigns: number;
    avgEngagement: number;
    successRate: number;
  };
  avgLikes: string;
  avgComments: number;
  avgReach: string;
}

interface Application {
  id: number;
  influencer: Influencer;
  campaign: string;
  appliedDate: string;
  proposedRate: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  deliverables: {
    instagramPosts: number;
    stories: number;
    reels: number;
  };
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

const CreatorStudioDashboard = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const initialTab = searchParams.get('tab') || 'Analytics';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSection, setActiveSection] = useState('Dashboard');
  
  // Creators/Influencers state
  const [creators, setCreators] = useState<Creator[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  const [creatorsError, setCreatorsError] = useState<string | null>(null);
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  
  // Campaign mode state
  const campaignMode = searchParams.get('campaignMode') === 'true';
  const campaignTitle = searchParams.get('campaignTitle') || 'New Campaign';
  const [addedToastMessage, setAddedToastMessage] = useState<string | null>(null);
  
  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showInfluencerDetails, setShowInfluencerDetails] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Calendar/Calender state
  const [currentMonth, setCurrentMonth] = useState('January 2024');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('Campaign Launch: Summer Fashion');
  const [eventSubtitle, setEventSubtitle] = useState('Summer Fashion Collection');
  const [eventType, setEventType] = useState('Meeting');
 
  const [selectedTime, setSelectedTime] = useState('--:--');
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
 
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: 'Dashboard' },
    { icon: Users, label: 'Listings', path: 'Listings' },
    { icon: Target, label: 'Calender', path: 'Calender' },
    { icon: Users, label: 'Creator Studio', path: 'Creator Studio', active: true },
    { icon: Star, label: 'Reviews', path: 'Reviews' },
    { icon: BarChart3, label: 'Analytics', path: 'Analytics' },
    { icon: Users, label: 'Competitor Analysis', path: 'Competitor Analysis' },
    { icon: MessageCircle, label: 'Sentiment Analysis', path: 'Sentiment Analysis' },
    { icon: Target, label: 'Coupons', path: 'Coupons' }
  ];

  const tabs = ['Discovery', 'Calender', 'Applications', 'Content', 'Analytics'];

  // Fetch creators on mount
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setCreatorsLoading(true);
        setCreatorsError(null);
        const response = await fetch('/api/influencer/list');
        
        if (!response.ok) {
          throw new Error('Failed to fetch creators');
        }
        
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setCreators(data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
        setCreatorsError(error instanceof Error ? error.message : 'Failed to fetch creators');
      } finally {
        setCreatorsLoading(false);
      }
    };

    fetchCreators();
  }, []);

  // Fetch applications on mount and when tab changes to Applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (activeTab !== 'Applications') return;
      
      try {
        setApplicationsLoading(true);
        const result = await getStoreApplications();
        
        if (result.success && result.applications) {
          // Transform database applications to UI format
          const transformedApplications: Application[] = result.applications.map((app: any, index: number) => {
            const influencer = app.influencer;
            const instagramAccount = influencer.socialAccounts?.find((acc: any) => acc.platform === 'INSTAGRAM');
            const tiktokAccount = influencer.socialAccounts?.find((acc: any) => acc.platform === 'TIKTOK');
            const youtubeAccount = influencer.socialAccounts?.find((acc: any) => acc.platform === 'YOUTUBE');
            
            // Default engagement rate (can be calculated from actual metrics later)
            const avgEngagement = 3.5;
            
            // Get total followers
            const totalFollowers = influencer.socialAccounts
              ?.reduce((sum: number, acc: any) => sum + (acc.followers || 0), 0) || 0;
            
            const formatFollowers = (count: number) => {
              if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
              if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
              return count.toString();
            };

            return {
              id: index + 1,
              influencer: {
                name: `${influencer.firstName} ${influencer.lastName}`,
                username: instagramAccount?.handle || tiktokAccount?.handle || youtubeAccount?.handle || 'N/A',
                avatar: '👤',
                category: influencer.primaryNiche || 'General',
                followers: formatFollowers(totalFollowers),
                engagement: `${avgEngagement?.toFixed(1) || '0.0'}%`,
                rating: 4.5,
                location: 'N/A',
                joinedDate: new Date(app.appliedAt).toLocaleDateString(),
                bio: influencer.bio || 'No bio available',
                platforms: {
                  instagram: instagramAccount ? formatFollowers(instagramAccount.followers) : '0',
                  tiktok: tiktokAccount ? formatFollowers(tiktokAccount.followers) : '0',
                  youtube: youtubeAccount ? formatFollowers(youtubeAccount.followers) : '0',
                },
                demographics: {
                  '18-24': 0,
                  '25-34': 0,
                  '35-44': 0,
                  '45+': 0,
                },
                audienceGender: { female: 0, male: 0 },
                topLocations: [],
                performance: {
                  totalCampaigns: 0,
                  avgEngagement: avgEngagement || 0,
                  successRate: 0,
                },
                avgLikes: '0',
                avgComments: 0,
                avgReach: '0',
              },
              campaign: app.campaign.title,
              appliedDate: new Date(app.appliedAt).toLocaleDateString(),
              proposedRate: `${app.campaign.currency} ${app.campaign.budget}`,
              status: app.applicationStatus === 'APPLIED' ? 'pending' : 
                      app.applicationStatus === 'SELECTED' ? 'approved' : 'rejected',
              message: 'Application submitted',
              deliverables: {
                instagramPosts: 0,
                stories: 0,
                reels: 0,
              },
            };
          });
          
          setApplications(transformedApplications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const renderAnalytics = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">Track ROI and campaign effectiveness</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>Last 12 months</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Custom Range
          </button>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Campaign Performance Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
          </div>

          <div className="space-y-6">
            {/* Total Reach */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-gray-600 uppercase tracking-wide">TOTAL REACH</span>
                <span className="text-xs text-gray-600 font-medium">+12% vs last month</span>
              </div>
              <p className="text-xl  text-gray-900">2.4M</p>
            </div>

            {/* Engagement Rate */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-gray-600 uppercase tracking-wide">ENGAGEMENT RATE</span>
                <span className="text-xs text-gray-600 font-medium">+0.8% vs last month</span>
              </div>
              <p className="text-xl  text-gray-900">4.2%</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Additional Metrics */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Click-through Rate</span>
                <span className="text-base font-semibold text-gray-900">2.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-base font-semibold text-gray-900">1.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Brand Mentions</span>
                <span className="text-base font-semibold text-gray-900">1,847</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="text-lg font-bold text-green-600">$</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Financial Metrics</h3>
          </div>

          {/* ROI Highlight Box */}
          <div className=" p-6 mb-6 border-b border-gray-200">
            <p className="text-sm text-green-800 mb-2 uppercase tracking-wide">Return on Investment</p>
            <p className="text-5xl font-bold text-blue-600 mb-1">200%</p>
            <p className="text-sm text-gray-800">Excellent performance</p>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Investment</span>
              <span className="text-base font-semibold text-gray-900">$15,750</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenue Generated</span>
              <span className="text-base font-semibold text-green-600">$47,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cost per Acquisition</span>
              <span className="text-base font-semibold text-gray-900">$24.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Order Value</span>
              <span className="text-base font-semibold text-gray-900">$89.30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    const contentItems = [
      {
        id: 1,
        title: 'Content #1',
        creator: '@creator1',
        type: 'video',
        size: '4.2 GB',
        likes: '1.2K',
        comments: 89,
        views: '5.4K'
      },
      {
        id: 2,
        title: 'Content #2',
        creator: '@creator2',
        type: 'image',
        size: null,
        likes: '1.2K',
        comments: 89,
        views: '5.4K'
      },
      {
        id: 3,
        title: 'Content #3',
        creator: '@creator3',
        type: null,
        size: null,
        likes: '1.2K',
        comments: 89,
        views: '5.4K'
      }
    ];

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="text-base sm:text-lg font-semibold">Content Library</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                {item.type && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-gray-700 text-white text-xs rounded-full">
                    {item.type}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">By {item.creator}</p>
                  </div>
                  {item.size && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                      {item.size}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-2">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{item.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCalender = () => {
    const upcomingEvents = [
      {
        title: 'Campaign Launch: Summer Fashion',
        subtitle: 'Summer Fashion Collection',
        time: 'Today, 10:00 AM',
        type: 'Launch',
        color: 'purple'
      },
      {
        title: 'Content Review Deadline',
        subtitle: 'Tech Product Launch',
        time: 'Tomorrow, 3:00 PM',
        type: 'Deadline',
        color: 'gray'
      },
      {
        title: 'Influencer Onboarding Call',
        subtitle: 'Food Brand Awareness',
        time: 'Jan 25, 3:00 PM',
        type: 'Meeting',
        color: 'gray'
      },
      {
        title: 'Campaign Performance Review',
        subtitle: 'Holiday Special',
        time: 'Jan 26, 11:00 AM',
        type: 'Review',
        color: 'gray'
      },
      {
        title: 'Strategy Meeting',
        subtitle: 'Q1 Planning',
        time: 'Jan 15, 9:00 AM',
        type: 'Meeting',
        color: 'gray'
      }
    ];

    const tasksDueSoon = [
      {
        title: 'Approve 5 pending content pieces',
        time: 'Due in 2 hours',
        priority: 'HIGH',
        badge: 'bg-red-100 text-red-700'
      },
      {
        title: 'Content Review Deadline',
        subtitle: 'Tech Product Launch',
        time: 'Tomorrow, 3:03 PM',
        type: 'Deadline'
      },
      {
        title: 'Influencer Onboarding Call',
        subtitle: 'Food Brand Awareness',
        time: 'Jan 25, 3:00 PM',
        type: 'Meeting'
      },
      {
        title: 'Campaign Performance Review',
        subtitle: 'Holiday Special',
        time: 'Jan 26, 11:00 AM',
        type: 'Review'
      },
      {
        title: 'Strategy Meeting',
        subtitle: 'Q1 Planning',
        time: 'Jan 15, 9:00 AM',
        type: 'Meeting'
      },
      {
        title: 'Send campaign brief to new influencers',
        time: 'Due in 4 hours',
        priority: 'Medium',
        badge: 'bg-purple-100 text-purple-700'
      },
      {
        title: 'Review analytics report',
        time: 'Due tomorrow',
        priority: 'Low',
        badge: 'bg-gray-100 text-gray-700'
      }
    ];

    const eventTypes = ['Launch', 'Deadline', 'Meeting', 'Review'];

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Campaign Calendar</h2>
            <p className="text-sm text-gray-500">Manage your campaign schedule and deadlines</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={16} />
              Filter
            </button>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-purple-700"
            >
              <span className="text-lg">+</span>
              Add Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Full Calendar Section */}
<div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-semibold text-gray-800">Campaign Calendar</h2>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setDate(addMonths(date, -1))}
        className="p-2 rounded-md hover:bg-gray-100 transition"
      >
        ←
      </button>
      <span className="font-medium text-gray-700">
        {format(date, "MMMM yyyy")}
      </span>
      <button
        onClick={() => setDate(addMonths(date, 1))}
        className="p-2 rounded-md hover:bg-gray-100 transition"
      >
        →
      </button>
    </div>
  </div>

  {/* Calendar Grid */}
  <div className="grid grid-cols-7 text-sm font-medium text-gray-500 border-b pb-2 mb-2">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <div key={day} className="text-center uppercase tracking-wide">
        {day}
      </div>
    ))}
  </div>

  <div className="grid grid-cols-7 gap-1 text-sm">
    {Array.from({ length: startOfWeek(endOfMonth(date)).getDate() + 7 }).map(
      (_, i) => {
        const day = addDays(startOfWeek(startOfMonth(date)), i);
        const isCurrentMonth = isSameMonth(day, date);
        const isToday = isSameDay(day, new Date());
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        return (
          <button
            key={i}
            onClick={() => setSelectedDate(day)}
            className={`h-24 rounded-md p-2 text-left transition
              ${isCurrentMonth ? "text-gray-800" : "text-gray-400"}
              ${isToday ? "border border-blue-500" : ""}
              ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
            `}
          >
            <div className="font-medium">{format(day, "d")}</div>
            {/* Example event */}
            {isSelected && (
              <div className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Event: Meeting
              </div>
            )}
          </button>
        );
      }
    )}
  </div>
</div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 ml-3.5 mb-1">{event.subtitle}</p>
                      <div className="flex items-center gap-1 ml-3.5 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Due Soon */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks Due Soon</h3>
              <div className="space-y-3">
                {tasksDueSoon.map((task, idx) => (
                  <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                        <h4 className="text-sm font-semibold text-gray-900">{task.title}</h4>
                      </div>
                      {task.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${task.badge}`}>
                          {task.priority}
                        </span>
                      )}
                      {task.type && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                          {task.type}
                        </span>
                      )}
                    </div>
                    {task.subtitle && (
                      <p className="text-xs text-gray-600 ml-3.5 mb-1">{task.subtitle}</p>
                    )}
                    <div className="flex items-center gap-1 ml-3.5 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{task.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New Event</h3>
                  <p className="text-sm text-gray-500">Create a new campaign event or deadline</p>
                </div>
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Campaign Launch: Summer Fashion"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={eventSubtitle}
                    onChange={(e) => setEventSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Summer Fashion Collection"
                  />
                </div>

                {/* Event Type */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => setShowEventTypeDropdown(!showEventTypeDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-left flex items-center justify-between"
                  >
                    <span className="text-gray-700">{eventType}</span>
                    <ChevronRight size={16} className={`text-gray-400 transform transition-transform ${showEventTypeDropdown ? 'rotate-90' : ''}`} />
                  </button>
                  {showEventTypeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {eventTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setEventType(type);
                            setShowEventTypeDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                            type === eventType ? 'bg-purple-600 text-white' : 'text-gray-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date - Using shadcn calendar */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      
                      className="rounded-md"
                    />
                  </div>
                </div> */}

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="--:--"
                    />
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Clock size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDiscovery = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="text-base sm:text-lg font-semibold">
            {campaignMode ? `Select Influencers for "${campaignTitle}"` : 'Influencer Discovery'}
          </h3>
        </div>
        {campaignMode && selectedInfluencers.length > 0 && (
          <Link
            href={`/${storeId}/createCampaign`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Back to Campaign ({selectedInfluencers.length})
          </Link>
        )}
      </div>

      {/* Toast Notification */}
      {addedToastMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-green-800 font-medium">{addedToastMessage}</p>
          </div>
          <button
            onClick={() => setAddedToastMessage(null)}
            className="text-green-600 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators..."
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
         
          <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <div className="w-4 h-4">filter</div>
          </button>
        </div>
      </div>

      {creatorsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading creators...</p>
          </div>
        </div>
      ) : creatorsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{creatorsError}</p>
        </div>
      ) : creators.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No approved creators found yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {creators.map((creator) => (
            <div key={creator.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                {creator.image ? (
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0">
                    {creator.icon || '⭐'}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base truncate">{creator.name}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">{creator.handle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Followers</p>
                  <p className="font-semibold text-sm sm:text-base">{creator.followers}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm">Engagement</p>
                  <p className="font-semibold text-sm sm:text-base">{creator.engagement}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">{creator.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{creator.rating}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Rate: {creator.rate}</p>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{creator.location}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${storeId}/campaign/1/influencers/profile`}
                  className="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>View Profile</span>
                </Link>
                <button 
                  onClick={() => {
                    if (campaignMode && typeof window !== 'undefined') {
                      const isAlreadySelected = selectedInfluencers.includes(creator.id);
                      
                      if (isAlreadySelected) {
                        // Remove from selection
                        setSelectedInfluencers(selectedInfluencers.filter(id => id !== creator.id));
                        setAddedToastMessage(`Removed from campaign: ${creator.name}`);
                      } else {
                        // Add to campaign
                        setSelectedInfluencers([...selectedInfluencers, creator.id]);
                        
                        // Save to localStorage
                        try {
                          const campaignKey = `campaign_${campaignTitle}`;
                          const currentSelected = JSON.parse(localStorage.getItem(campaignKey) || '[]');
                          const creatorData = {
                            id: creator.id,
                            name: creator.name,
                            handle: creator.handle,
                            followers: creator.followers,
                            image: creator.image,
                            icon: creator.icon,
                            category: creator.category,
                            engagement: creator.engagement,
                            rating: creator.rating
                          };
                          if (!currentSelected.find((c: any) => c.id === creator.id)) {
                            currentSelected.push(creatorData);
                            localStorage.setItem(campaignKey, JSON.stringify(currentSelected));
                          }
                        } catch (error) {
                          console.error('Error saving to localStorage:', error);
                        }
                        
                        setAddedToastMessage(`Added to campaign: ${creator.name}`);
                      }
                      
                      // Clear toast after 3 seconds
                      setTimeout(() => setAddedToastMessage(null), 3000);
                    }
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                    campaignMode && selectedInfluencers.includes(creator.id)
                      ? 'bg-green-100 border border-green-300 text-green-700 hover:bg-green-200'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{campaignMode && selectedInfluencers.includes(creator.id) ? 'Added' : 'Invite'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderApplications = () => {
    const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
      const styles: Record<'pending' | 'approved' | 'rejected', string> = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200'
      };
      const icons: Record<'pending' | 'approved' | 'rejected', React.ReactElement> = {
        pending: <span className="w-3 h-3 text-yellow-600">⏳</span>,
        approved: <span className="w-3 h-3 text-green-600">✓</span>,
        rejected: <span className="w-3 h-3 text-red-600">✗</span>
      };
      return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
          {icons[status]}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };

    // Show loading state
    if (applicationsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading applications...</span>
        </div>
      );
    }

    // Show empty state if no applications
    if (applications.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven&apos;t received any influencer applications yet. Make sure your campaigns are published to start receiving applications.
          </p>
          <Link href={`/${storeId}/campaign`} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Campaigns
          </Link>
        </div>
      );
    }

    const filteredApplications = applications.filter(app => 
      filterStatus === 'all' || app.status === filterStatus
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Influencer Applications</h3>
            <p className="text-sm text-gray-500 mt-1">Review and manage applications from influencers wanting to join your campaigns</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{applications.filter(a => a.status === 'pending').length} pending reviews</span>
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Show filtered empty state */}
        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No {filterStatus !== 'all' ? filterStatus : ''} applications found.</p>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xl">
                    {app.influencer.avatar}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{app.influencer.name}</h4>
                      <p className="text-sm text-gray-500">{app.influencer.username}</p>
                      <p className="text-xs text-gray-400">Applied {app.appliedDate}</p>
                    </div>
                    <div className="text-right">
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          Pending
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Approved
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign and Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Campaign</p>
                  <p className="font-semibold text-gray-900">{app.campaign}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Followers</p>
                  <p className="font-semibold text-gray-900">{app.influencer.followers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Engagement</p>
                  <p className="font-semibold text-gray-900">{app.influencer.engagement}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Proposed Rate</p>
                  <p className="font-semibold text-green-600">{app.proposedRate}</p>
                </div>
              </div>

              {/* Application Message */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Application Message</p>
                <p className="text-sm text-gray-700 italic">"{app.message}"</p>
              </div>

              {/* Proposed Deliverables */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Proposed Deliverables</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{app.deliverables.instagramPosts} Instagram Posts</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{app.deliverables.stories} Stories</span>
                  </div>
                  {app.deliverables.reels > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{app.deliverables.reels} Reels</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {app.status === 'pending' && (
                  <button 
                    onClick={() => {
                      setSelectedApplication(app);
                      setShowContractModal(true);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <span>📋</span>
                    Approve
                  </button>
                )}
                {app.status === 'approved' && (
                  <button 
                    onClick={() => {
                      setSelectedApplication(app);
                      setShowContractModal(true);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <span>📄</span>
                    Send Contract
                  </button>
                )}
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <span>❌</span>
                  Decline
                </button>
                <button 
                  onClick={() => {
                    setSelectedApplication(app);
                    setShowMessageModal(true);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <span>💬</span>
                  Message
                </button>
                <button 
                  onClick={() => {
                    router.push(`/${storeId}/creator-studio/influencer/${app.id}`);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <span>👁️</span>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return renderAnalytics();
      case 'Content':
        return renderContent();
      case 'Calender':
        return renderCalender();
      case 'Applications':
        return renderApplications();
      case 'Discovery':
        return renderDiscovery();
      default:
        return renderAnalytics();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Creator Studio</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage influencer partnerships and content collaborations</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div className="flex items-center gap-3 p-3 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Active Calender</p>
                <p className="text-xl sm:text-2xl font-bold">12</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Creators</p>
                <p className="text-xl sm:text-2xl font-bold">248</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Reach</p>
                <p className="text-xl sm:text-xl font-bold">2.4M</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Avg. Engagement</p>
                <p className="text-xl sm:text-2xl font-bold">4.2%</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:space-x-8 sm:gap-0 mt-4 sm:mt-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CreatorStudioDashboard;