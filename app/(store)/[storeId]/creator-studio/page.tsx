"use client";
import React, { useState } from 'react';
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
  MoreHorizontal,
  Calendar,
  Camera
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('Analytics');
  const [activeSection, setActiveSection] = useState('Dashboard');
  
  // Applications state
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showInfluencerDetails, setShowInfluencerDetails] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: 'Dashboard' },
    { icon: Users, label: 'Listings', path: 'Listings' },
    { icon: Target, label: 'Campaigns', path: 'Campaigns' },
    { icon: Users, label: 'Creator Studio', path: 'Creator Studio', active: true },
    { icon: Star, label: 'Reviews', path: 'Reviews' },
    { icon: BarChart3, label: 'Analytics', path: 'Analytics' },
    { icon: Users, label: 'Competitor Analysis', path: 'Competitor Analysis' },
    { icon: MessageCircle, label: 'Sentiment Analysis', path: 'Sentiment Analysis' },
    { icon: Target, label: 'Coupons', path: 'Coupons' }
  ];

  const tabs = ['Discovery', 'Campaigns', 'Applications', 'Content', 'Analytics'];

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
            <Calendar className="w-4 h-4" />
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
                <span className="text-xs text-green-600 font-medium">+12% vs last month</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">2.4M</p>
            </div>

            {/* Engagement Rate */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-gray-600 uppercase tracking-wide">ENGAGEMENT RATE</span>
                <span className="text-xs text-green-600 font-medium">+0.8% vs last month</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">4.2%</p>
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
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
            <p className="text-sm text-green-800 mb-2 uppercase tracking-wide">Return on Investment</p>
            <p className="text-5xl font-bold text-green-600 mb-1">200%</p>
            <p className="text-sm text-green-700">Excellent performance</p>
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

  const renderCampaigns = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Target className="w-4 h-4 sm:w-5 sm:h-5" />
        <h3 className="text-base sm:text-lg font-semibold">Active Campaigns</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div>
              <h4 className="font-semibold text-base sm:text-lg">Summer Collection Launch</h4>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                Active
              </span>
            </div>
            <button className="self-start sm:self-auto px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Budget</p>
              <p className="font-semibold text-sm sm:text-base">$5,000</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Creators</p>
              <p className="font-semibold text-sm sm:text-base">5</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Reach</p>
              <p className="font-semibold text-sm sm:text-base">450K</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Engagement</p>
              <p className="font-semibold text-sm sm:text-base">3.2%</p>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-black h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div>
              <h4 className="font-semibold text-base sm:text-lg">Holiday Promo Campaign</h4>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                Planning
              </span>
            </div>
            <button className="self-start sm:self-auto px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Budget</p>
              <p className="font-semibold text-sm sm:text-base">$8,000</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Creators</p>
              <p className="font-semibold text-sm sm:text-base">3</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Reach</p>
              <p className="font-semibold text-sm sm:text-base">320K</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Engagement</p>
              <p className="font-semibold text-sm sm:text-base">4.1%</p>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-black h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiscovery = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        <h3 className="text-base sm:text-lg font-semibold">Influencer Discovery</h3>
      </div>

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
          <select className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
            <option>Category</option>
            <option>Fashion</option>
            <option>Tech</option>
            <option>Fitness</option>
          </select>
          <select className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
            <option>Followers</option>
            <option>10K-50K</option>
            <option>50K-100K</option>
            <option>100K+</option>
          </select>
          <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <div className="w-4 h-4"></div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            name: 'Sarah Johnson',
            handle: '@sarahjfashion',
            followers: '125K',
            engagement: '4.2%',
            category: 'Fashion',
            rating: 4.8,
            rate: '$500-800',
            location: 'New York',
            icon: '⭐'
          },
          {
            name: 'Mike Chen',
            handle: '@mikechen tech',
            followers: '89K',
            engagement: '3.8%',
            category: 'Tech',
            rating: 4.6,
            rate: '$300-600',
            location: 'San Francisco',
            icon: '💻'
          },
          {
            name: 'Emma Wilson',
            handle: '@emmawilsonfit',
            followers: '210K',
            engagement: '5.1%',
            category: 'Fitness',
            rating: 4.9,
            rate: '$800-1200',
            location: 'Los Angeles',
            icon: '💪'
          }
        ].map((creator, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0">
                {creator.icon}
              </div>
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
              <button className="flex-1 bg-black text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-800 flex items-center justify-center gap-2">
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Contact</span>
                <span className="sm:hidden">Contact</span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => {
    const applications: Application[] = [
      {
        id: 1,
        influencer: {
          name: 'Alex Rivera',
          username: '@alexrivera',
          avatar: '🌸',
          category: 'Lifestyle',
          followers: '95K',
          engagement: '4.5%',
          rating: 4.8,
          location: 'Los Angeles, CA',
          joinedDate: 'March 2020',
          bio: 'Fashion & lifestyle content creator passionate about sustainable fashion and authentic storytelling. Collaborating with brands that align with my values.',
          platforms: {
            instagram: '250K',
            tiktok: '180K',
            youtube: '95K'
          },
          demographics: {
            '18-24': 35,
            '25-34': 45,
            '35-44': 15,
            '45+': 5
          },
          audienceGender: { female: 78, male: 22 },
          topLocations: [
            { country: 'United States', rank: 1 },
            { country: 'Canada', rank: 2 },
            { country: 'United Kingdom', rank: 3 },
            { country: 'Australia', rank: 4 }
          ],
          performance: {
            totalCampaigns: 47,
            avgEngagement: 4.2,
            successRate: 94
          },
          avgLikes: '12.5K',
          avgComments: 485,
          avgReach: '180K'
        },
        campaign: 'Summer Collection Launch',
        appliedDate: '15/01/2024',
        proposedRate: '$400',
        status: 'pending' as const,
        message: "I love your brand's aesthetic and would be thrilled to showcase your summer collection to my engaged audience of fashion enthusiasts.",
        deliverables: {
          instagramPosts: 2,
          stories: 5,
          reels: 1
        }
      },
      {
        id: 2,
        influencer: {
          name: 'Jordan Kim',
          username: '@jordankimfit',
          avatar: '🦊',
          category: 'Fitness',
          followers: '180K',
          engagement: '3.9%',
          rating: 4.6,
          location: 'New York, NY',
          joinedDate: 'January 2019',
          bio: 'Certified personal trainer and nutrition coach. Helping people achieve their fitness goals through sustainable lifestyle changes.',
          platforms: {
            instagram: '180K',
            tiktok: '220K',
            youtube: '145K'
          },
          demographics: {
            '18-24': 42,
            '25-34': 38,
            '35-44': 15,
            '45+': 5
          },
          audienceGender: { female: 65, male: 35 },
          topLocations: [
            { country: 'United States', rank: 1 },
            { country: 'United Kingdom', rank: 2 },
            { country: 'Canada', rank: 3 },
            { country: 'Germany', rank: 4 }
          ],
          performance: {
            totalCampaigns: 52,
            avgEngagement: 3.7,
            successRate: 96
          },
          avgLikes: '15.2K',
          avgComments: 620,
          avgReach: '220K'
        },
        campaign: 'Holiday Promo Campaign',
        appliedDate: '12/01/2024',
        proposedRate: '$650',
        status: 'approved' as const,
        message: "Your holiday campaign aligns perfectly with my content strategy. I can create authentic content that resonates with my fitness community.",
        deliverables: {
          instagramPosts: 3,
          stories: 10,
          reels: 2
        }
      },
      {
        id: 3,
        influencer: {
          name: 'Sophie Martinez',
          username: '@sophiemartinez',
          avatar: '🎨',
          category: 'Beauty',
          followers: '67K',
          engagement: '5.2%',
          rating: 4.5,
          location: 'Miami, FL',
          joinedDate: 'June 2020',
          bio: 'Beauty enthusiast and makeup artist. Creating honest reviews and tutorials for products I truly believe in.',
          platforms: {
            instagram: '67K',
            tiktok: '92K',
            youtube: '45K'
          },
          demographics: {
            '18-24': 48,
            '25-34': 35,
            '35-44': 12,
            '45+': 5
          },
          audienceGender: { female: 85, male: 15 },
          topLocations: [
            { country: 'United States', rank: 1 },
            { country: 'Mexico', rank: 2 },
            { country: 'Spain', rank: 3 },
            { country: 'Brazil', rank: 4 }
          ],
          performance: {
            totalCampaigns: 34,
            avgEngagement: 5.1,
            successRate: 91
          },
          avgLikes: '8.3K',
          avgComments: 380,
          avgReach: '95K'
        },
        campaign: 'Summer Collection Launch',
        appliedDate: '10/01/2024',
        proposedRate: '$300',
        status: 'rejected' as const,
        message: "I'm excited about the opportunity to collaborate and create beautiful content featuring your products.",
        deliverables: {
          instagramPosts: 1,
          stories: 3,
          reels: 0
        }
      }
    ];

    const recentCampaigns = [
      { name: 'EcoFashion Co.', type: 'Product Launch', roi: '250%', badge: 'Excellent' },
      { name: 'Sustainable Beauty', type: 'Brand Awareness', roi: '180%', badge: 'Good' },
      { name: 'Green Living', type: 'Lifestyle Content', roi: '220%', badge: 'Excellent' }
    ];

    const quickMessages = [
      "Thank you for your application! We're reviewing it and will get back to you soon.",
      "Could you please provide more information about your content creation process?",
      "We'd like to schedule a brief call to discuss this opportunity further.",
      "Your application looks great! We have a few questions about the proposed timeline."
    ];

    const filteredApplications = applications.filter(app => 
      filterStatus === 'all' || app.status === filterStatus
    );

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

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Influencer Applications</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Review and manage influencer applications</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="px-3 sm:px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                {applications.filter(a => a.status === 'pending').length} pending reviews
              </span>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-1 ${app.status === 'approved' ? 'bg-green-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-lg sm:text-2xl">
                      {app.influencer.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">{app.influencer.name}</h3>
                          <span className="text-xs sm:text-sm text-gray-500">{app.influencer.username}</span>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{app.influencer.category}</span>
                          <span>Applied on {app.appliedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">CAMPAIGN</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{app.campaign}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">FOLLOWERS</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">{app.influencer.followers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ENGAGEMENT</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">{app.influencer.engagement}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">PROPOSED RATE</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">{app.proposedRate}</p>
                      </div>
                    </div>

                    {/* Application Message */}
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">APPLICATION MESSAGE</p>
                      <p className="text-xs sm:text-sm text-gray-700 italic">"{app.message}"</p>
                    </div>

                    {/* Deliverables */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">PROPOSED DELIVERABLES</p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <span className="px-2 sm:px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                          {app.deliverables.instagramPosts} Instagram Posts
                        </span>
                        <span className="px-2 sm:px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                          {app.deliverables.stories} Stories
                        </span>
                        {app.deliverables.reels > 0 && (
                          <span className="px-2 sm:px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                            {app.deliverables.reels} Reels
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowContractModal(true);
                            }}
                            className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            ✓ <span className="hidden sm:inline">Approve Application</span><span className="sm:hidden">Approve</span>
                          </button>
                          <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                            Decline
                          </button>
                        </>
                      )}
                      {app.status === 'approved' && (
                        <button 
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowContractModal(true);
                          }}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          📄 <span className="hidden sm:inline">Send Contract</span><span className="sm:hidden">Contract</span>
                        </button>
                      )}
                      <div className="flex gap-2 sm:gap-3">
                        <button 
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowMessageModal(true);
                          }}
                          className="flex-1 sm:flex-none px-3 sm:px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          💬 <span className="hidden sm:inline">Message</span><span className="sm:hidden">Message</span>
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowInfluencerDetails(true);
                          }}
                          className="flex-1 sm:flex-none px-3 sm:px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          👁️ <span className="hidden sm:inline">View Details</span><span className="sm:hidden">View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
      case 'Campaigns':
        return renderCampaigns();
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
                <p className="text-xs sm:text-sm text-gray-600">Active Campaigns</p>
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
                <p className="text-xl sm:text-2xl font-bold">2.4M</p>
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