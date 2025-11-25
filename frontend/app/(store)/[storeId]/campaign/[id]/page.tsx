"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Play, Share2, Edit, Trash2, DollarSign, Users, Eye, MousePointer, Clock, TrendingUp, Zap, Star, X, Loader } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import api from "@/lib/api-client";

// Star Rating Component
interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

const StarRating = ({ rating, onRatingChange, readonly = false }: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`w-6 h-6 transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            className={`w-full h-full ${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};
// User Demographics Component
const UserDemographics = () => {
  const [activeTab, setActiveTab] = useState('all');

  const ageData = [
    { age: '18-20', users: 450 },
    { age: '21-25', users: 380 },
    { age: '26-30', users: 420 },
    { age: '31-35', users: 280 },
    { age: '36-40', users: 550 },
    { age: '41-45', users: 150 },
    { age: '46-50', users: 680 }
  ];

  const genderData = [
    { name: 'Male', value: 750, percentage: 30 },
    { name: 'Female', value: 1740, percentage: 70 }
  ];

  const languageData = [
    { language: 'English', users: 2800 },
    { language: 'French', users: 1200 },
    { language: 'Kiswahili', users: 2600 },
    { language: 'Arabic', users: 2700 },
    { language: 'Chinese', users: 2400 },
    { language: 'Luganda', users: 2300 },
    { language: 'Others', users: 2200 }
  ];

  const locationData = [
    { country: 'Uganda', users: 577 },
    { country: 'Kenya', users: 554 },
    { country: 'Rwanda', users: 537 },
    { country: 'Egypt', users: 501 },
    { country: 'Nigeria', users: 488 },
    { country: 'Mexico', users: 452 },
    { country: 'Tanzania', users: 408 },
    { country: 'France', users: 399 },
    { country: 'Germany', users: 388 },
    { country: 'Others', users: 320 }
  ];

  const COLORS = ['#3B82F6', '#93C5FD'];
  const LANGUAGE_COLOR = '#14B8A6';

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">User Demographics</h2>
        <button className="text-gray-400 hover:text-gray-600">⋯</button>
      </div>
      
      <p className="text-sm text-gray-500 mb-6">
        User demographics help businesses and organizations understand their audience better and tailor their offerings to meet their needs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Age Distribution */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800">Age</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="age" type="category" width={50} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800">Gender</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="text-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Male</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{genderData[0].value} - {genderData[0].percentage}%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-300"></div>
                <span className="text-xs text-gray-600">Female</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{genderData[1].value} - {genderData[1].percentage}%</p>
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-800">Language</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={languageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="language" type="category" width={60} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="users" fill={LANGUAGE_COLOR} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <h3 className="text-base font-semibold mb-3 text-gray-800">Location</h3>
        
        <div className="flex gap-4 mb-4 border-b">
          <button 
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All users
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'new' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New Users
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'active' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Users
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country List */}
          <div>
            {locationData.map((item, index) => (
              <div key={index} className="mb-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">{item.country}</span>
                  <span className="text-sm font-medium text-gray-600">{item.users}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-300 bg-pink-500"
                    style={{ 
                      width: `${(item.users / 577) * 100}%`,
                      opacity: index === 0 ? 1 : 0.6
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* World Map */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <div className="relative w-full h-48">
              <svg viewBox="0 0 800 400" className="w-full h-full">
                <g className="map" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1">
                  <ellipse cx="450" cy="240" rx="60" ry="80" />
                  <ellipse cx="430" cy="140" rx="40" ry="35" />
                  <ellipse cx="580" cy="160" rx="80" ry="60" />
                  <ellipse cx="220" cy="140" rx="70" ry="50" />
                  <ellipse cx="260" cy="280" rx="45" ry="70" />
                  <ellipse cx="680" cy="300" rx="35" ry="30" />
                </g>
                <circle cx="450" cy="220" r="16" fill="#3B82F6" opacity="0.8" />
                <circle cx="460" cy="230" r="12" fill="#3B82F6" opacity="0.8" />
                <circle cx="220" cy="180" r="8" fill="#3B82F6" opacity="0.6" />
                <circle cx="430" cy="150" r="10" fill="#3B82F6" opacity="0.6" />
                <circle cx="580" cy="170" r="8" fill="#3B82F6" opacity="0.5" />
                <circle cx="520" cy="190" r="7" fill="#3B82F6" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Types
interface Influencer {
  id: number;
  name: string;
  platform: string;
  followers: string;
  engagement: string;
  posts: number;
  performance: number;
  avatar: string;
  color: string;
  hasRating?: boolean;
  currentRating?: number;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [campaignInfluencers, setCampaignInfluencers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Metrics');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [ratings, setRatings] = useState({
    overall: 0,
    communication: 0,
    contentQuality: 0,
    timeliness: 0,
    audienceEngagement: 0
  });
  const [workAgain, setWorkAgain] = useState('');
  const [feedback, setFeedback] = useState('');

  // Fetch campaign data on component mount
  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true);
        const campaignResult = await api.campaigns.getById(campaignId);
        if (campaignResult.success && campaignResult.campaign) {
          setCampaign(campaignResult.campaign);
          
          // Fetch influencers for this campaign
          const influencersResult = await api.campaigns.getApplicants(campaignId);
          if (influencersResult.success && influencersResult.applicants) {
            setCampaignInfluencers(influencersResult.applicants);
          }
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignData();
    }
  }, [campaignId]);

  // Transform real influencers to display format
  const influencers = campaignInfluencers.length > 0 ? campaignInfluencers.map((app: any, idx: number) => {
    const inf = app.influencer;
    const colors = ['purple', 'blue', 'green', 'orange', 'pink', 'red'];
    const color = colors[idx % colors.length];
    const primarySocial = inf.socialAccounts?.[0];
    
    return {
      id: inf.id,
      name: `${inf.firstName} ${inf.lastName}`,
      platform: primarySocial?.platform || 'Social Media',
      followers: primarySocial?.followers || 'N/A',
      engagement: '5.2%', // Would need to calculate from real data
      posts: 8, // Would need to fetch from real data
      performance: 85, // Would need to calculate from real data
      avatar: inf.firstName?.[0] || '?',
      color: color as any,
      hasRating: false,
      currentRating: 0,
      niche: inf.primaryNiche,
      bio: inf.bio,
      applicationStatus: app.applicationStatus,
    };
  }) : [
    {
      id: 1,
      name: 'Sarah Johnson',
      platform: 'Instagram',
      followers: '125K',
      engagement: '4.8%',
      posts: 8,
      performance: 85,
      avatar: 'S',
      color: 'purple'
    },
    {
      id: 2,
      name: 'Mike Chen',
      platform: 'YouTube',
      followers: '350K',
      engagement: '6.2%',
      posts: 5,
      performance: 92,
      avatar: 'M',
      color: 'blue'
    },
    {
      id: 3,
      name: 'Emma Davis',
      platform: 'TikTok',
      followers: '500K',
      engagement: '7.5%',
      posts: 12,
      performance: 96,
      avatar: 'E',
      color: 'green',
      hasRating: true,
      currentRating: 4.5
    }
  ];

  const openRatingModal = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    if (influencer.hasRating) {
      // Pre-fill with existing ratings if updating
      setRatings({
        overall: Math.floor(influencer.currentRating || 0),
        communication: Math.floor(influencer.currentRating || 0),
        contentQuality: Math.floor(influencer.currentRating || 0),
        timeliness: Math.floor(influencer.currentRating || 0),
        audienceEngagement: Math.floor(influencer.currentRating || 0)
      });
    } else {
      // Reset for new rating
      setRatings({
        overall: 0,
        communication: 0,
        contentQuality: 0,
        timeliness: 0,
        audienceEngagement: 0
      });
    }
    setWorkAgain('');
    setFeedback('');
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedInfluencer(null);
  };

  const submitRating = () => {
    // Here you would typically submit to your API
    if (selectedInfluencer) {
      console.log('Rating submitted:', {
        influencerId: selectedInfluencer.id,
        ratings,
        workAgain,
        feedback
      });
    }
    closeRatingModal();
  };

  const stats = campaign ? [
    { label: 'Budget Allocated', value: `${campaign.currency} ${campaign.budget?.toLocaleString() || '0'}`, change: 'Total', icon: DollarSign, color: 'purple' },
    { label: 'Total Applicants', value: (campaign._count?.applicants || 0).toString(), change: 'Influencers', icon: Users, color: 'green' },
    { label: 'Campaign Type', value: campaign.type || 'PRODUCT', change: campaign.status, icon: Eye, color: 'blue' },
    { label: 'Duration', value: campaign.duration ? `${campaign.duration} days` : 'Ongoing', change: campaign.status, icon: MousePointer, color: 'orange' }
  ] : [
    { label: 'Total Revenue', value: '$28,500', change: '+12.5%', icon: DollarSign, color: 'purple' },
    { label: 'Conversions', value: '285', change: '+8.4%', icon: Users, color: 'green' },
    { label: 'Impressions', value: '125,000', change: '+15.2%', icon: Eye, color: 'blue' },
    { label: 'Clicks', value: '3,500', change: '+10.1%', icon: MousePointer, color: 'orange' }
  ];

  const timelineEvents = campaign?.createdAt ? [
    { title: 'Campaign Created', date: new Date(campaign.createdAt).toLocaleDateString(), icon: Play, color: 'purple' },
    { title: 'Campaign ' + (campaign.status === 'PUBLISHED' ? 'Published' : campaign.status.toLowerCase()), date: new Date(campaign.updatedAt).toLocaleDateString(), icon: MousePointer, color: 'green' },
    ...(campaign._count?.applicants ? [{ title: `${campaign._count.applicants} Influencer${campaign._count.applicants !== 1 ? 's' : ''} Applied`, date: new Date(campaign.updatedAt).toLocaleDateString(), icon: Users, color: 'green' }] : []),
  ] : [
    { title: 'Campaign Launched', date: '2024-01-01', icon: Play, color: 'purple' },
    { title: 'First 1000 clicks reached', date: '2024-01-05', icon: MousePointer, color: 'green' },
    { title: 'Budget increased by $1000', date: '2024-01-10', icon: DollarSign, color: 'gray' },
    { title: '100 conversions achieved', date: '2024-01-15', icon: Users, color: 'green' },
    { title: 'Ad creative refreshed', date: '2024-01-20', icon: Edit, color: 'gray' }
  ];

  const adSets: Array<{name: string; conversions: number; budget: string; spent: number; status: string}> = []; // Ad sets not yet implemented in campaign model

  const ageDistribution = [
    { range: '18-24', percentage: 28 },
    { range: '25-34', percentage: 45 },
    { range: '35-44', percentage: 20 },
    { range: '45+', percentage: 7 }
  ];

  const locations = [
    { country: 'United States', percentage: '45%' },
    { country: 'United Kingdom', percentage: '22%' },
    { country: 'Canada', percentage: '18%' },
    { country: 'Australia', percentage: '15%' }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  // Show error state if campaign not found
  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Campaign not found</p>
          <button className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  // Format dates for display
  const startDate = campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'TBD';
  const endDate = campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'TBD';
  const campaignTitle = campaign.title || 'Campaign';
  const campaignDescription = campaign.description || 'No description provided';
  const campaignBudget = campaign.budget || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{campaignTitle}</h1>
              <p className="text-sm text-gray-500">{campaign.type || 'Campaign'} • Target: {campaign.category || 'Audience'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Play className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className={`px-3 py-1 ${
              campaign.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
              campaign.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            } text-xs font-semibold rounded-full`}>
              {campaign.status === 'PUBLISHED' ? 'Active' : campaign.status}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{startDate} - {endDate}</span>
            </div>
            <span className="text-sm text-gray-500">Campaign ID: {campaign.id}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  stat.color === 'purple' ? 'bg-purple-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <stat.icon className={`w-4 h-4 ${
                    stat.color === 'purple' ? 'text-purple-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-green-600 font-medium">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Campaign Overview & Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Overview</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">
                    {campaign?.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Objectives</h3>
                    <ul className="space-y-1">
                      {campaign?.targets?.awareness?.length > 0 ? (
                        campaign.targets.awareness.map((obj: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            {obj}
                          </li>
                        ))
                      ) : campaign?.targets?.advocacy?.length > 0 ? (
                        campaign.targets.advocacy.map((obj: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            {obj}
                          </li>
                        ))
                      ) : campaign?.targets?.conversions?.length > 0 ? (
                        campaign.targets.conversions.map((obj: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            {obj}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500 flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          No objectives defined
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {campaign?.platforms && Array.isArray(campaign.platforms) && campaign.platforms.length > 0 ? (
                        campaign.platforms.map((platform: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {platform}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No platforms specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Performance */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Detailed Performance</h2>
              </div>
              
              <div className="border-b border-gray-200">
                <div className="flex">
                  {['Metrics', 'Demographics', 'Ad Sets', 'Influencers'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-gray-900 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'Metrics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Campaign Status</div>
                        <div className="text-2xl font-bold text-gray-900">{campaign?.status || 'DRAFT'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Total Budget</div>
                        <div className="text-2xl font-bold text-gray-900">{campaign?.currency} {campaign?.budget?.toLocaleString() || '0'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Campaign Type</div>
                        <div className="text-2xl font-bold text-gray-900">{campaign?.type || 'PRODUCT'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Total Applicants</div>
                        <div className="text-2xl font-bold text-gray-900">{(campaign?._count?.applicants || 0)}</div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Campaign Duration</span>
                          <span className="text-sm font-semibold text-gray-900">{campaign?.duration || 'TBD'} days</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min((campaign?.duration || 0) / 30 * 100, 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Campaign Progress</span>
                          <span className="text-sm font-semibold text-gray-900">{campaign?.status === 'PUBLISHED' ? 'Live' : campaign?.status === 'COMPLETED' ? '100%' : '0%'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: campaign?.status === 'COMPLETED' ? '100%' : campaign?.status === 'PUBLISHED' ? '50%' : '0%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> Detailed analytics will be available once the campaign receives more traffic and conversions. 
                        Real-time metrics are coming soon!
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'Demographics' && (
                  <div className="space-y-6">
                    {campaign?.status === 'PUBLISHED' || campaign?.status === 'ACTIVE' ? (
                      <>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-4">Age Distribution</h3>
                          <div className="space-y-3">
                            {ageDistribution.map((age, idx) => (
                              <div key={idx}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-700">{age.range}</span>
                                  <span className="text-sm font-semibold text-gray-900">{age.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${age.percentage}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4">Gender Split</h3>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-3xl font-bold text-gray-900 mb-1">58%</div>
                              <div className="text-xs text-gray-500">Male</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-gray-900 mb-1">40%</div>
                              <div className="text-xs text-gray-500">Female</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-gray-900 mb-1">2%</div>
                              <div className="text-xs text-gray-500">Other</div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Locations</h3>
                          <div className="space-y-2">
                            {locations.map((location, idx) => (
                              <div key={idx} className="flex items-center justify-between py-2 text-sm">
                                <span className="text-gray-700">{location.country}</span>
                                <span className="font-semibold text-gray-900">{location.percentage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <UserDemographics />
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">Demographics data will appear here once the campaign is published</p>
                        <p className="text-gray-400 text-xs mt-1">Publish your campaign to start collecting audience insights</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Ad Sets' && (
                  <div className="space-y-4">
                    {adSets.length > 0 ? (
                      adSets.map((adSet, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">{adSet.name}</h3>
                              <p className="text-xs text-gray-500">{adSet.conversions} conversions</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              adSet.status === 'Active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {adSet.status}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Budget</span>
                              <span className="text-xs font-semibold text-gray-900">{adSet.budget}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${adSet.spent}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No ad sets created yet</p>
                        <p className="text-gray-400 text-xs mt-1">Ad sets will appear here once they are created</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Influencers' && (
                  <div className="space-y-6">
                    {/* Rate Influencer Performance Header */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Rate Influencer Performance</h3>
                      <p className="text-xs text-gray-600">Help others by sharing your experience working with these influencers</p>
                    </div>

                    {/* Influencers List */}
                    <div className="space-y-4">
                      {influencers.map((influencer) => (
                        <div key={influencer.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-${influencer.color}-100 rounded-full flex items-center justify-center`}>
                                <span className={`text-${influencer.color}-600 font-semibold text-sm`}>{influencer.avatar}</span>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-900">{influencer.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{influencer.platform} • {influencer.followers} followers</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>Engagement: {influencer.engagement}</span>
                                  <span>•</span>
                                  <span>Content: {influencer.posts} posts</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600 mb-1">{influencer.performance}%</div>
                              <div className="text-xs text-gray-500 mb-2">Performance</div>
                              <div className="flex items-center gap-2">
                                {influencer.hasRating ? (
                                  <>
                                    <div className="flex text-yellow-400 text-xs">
                                      <StarRating rating={Math.floor(influencer.currentRating)} readonly />
                                    </div>
                                    <span className="text-xs text-gray-500">{influencer.currentRating}</span>
                                    <button 
                                      onClick={() => openRatingModal(influencer)}
                                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                      Update Rating
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-xs text-gray-500">Not Rated</span>
                                    <button 
                                      onClick={() => openRatingModal(influencer)}
                                      className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full hover:bg-purple-700 transition-colors"
                                    >
                                      Rate Now
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Timeline</h2>
              <div className="space-y-4">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      event.color === 'purple' ? 'bg-purple-100' :
                      event.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <event.icon className={`w-5 h-5 ${
                        event.color === 'purple' ? 'text-purple-600' :
                        event.color === 'green' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-100 last:border-b-0">
                      <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Budget & Quick Stats */}
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Budget Overview</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {campaign ? `${campaign.currency} ${campaign.budget?.toLocaleString() || '0'}` : '$5,000'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="text-sm font-semibold text-red-600">
                    {campaign ? `${campaign.currency} ${'0'}` : '$3,200'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="text-sm font-semibold text-green-600">
                    {campaign ? `${campaign.currency} ${campaign.budget?.toLocaleString() || '0'}` : '$1,800'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                    <span className="text-sm font-semibold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-purple-900">
                        {campaign?.status === 'PUBLISHED' ? 'Status: Published' : 'Status: ' + campaign?.status}
                      </div>
                      <div className="text-xs text-purple-700 mt-0.5">
                        {campaign?.status === 'DRAFT' && 'Campaign is in draft mode'}
                        {campaign?.status === 'PUBLISHED' && 'Campaign is live and receiving applications'}
                        {campaign?.status === 'ACTIVE' && 'Campaign is active and running'}
                        {campaign?.status === 'COMPLETED' && 'Campaign has been completed'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {campaign?.duration ? `${campaign.duration} days` : 'Ongoing'}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Campaign Type</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {campaign?.type || 'PRODUCT'}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium">Applicants</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(campaign?._count?.applicants || 0).toString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Grade */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-3xl font-bold text-purple-600">A+</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Excellent Performance</h3>
              <p className="text-xs text-gray-600">This campaign is outperforming industry benchmarks</p>
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && selectedInfluencer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Rate Influencer Performance</h2>
                    <p className="text-sm text-gray-500">Provide feedback on {selectedInfluencer.name}'s performance during the campaign</p>
                  </div>
                  <button
                    onClick={closeRatingModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Influencer Info */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-14 h-14 bg-${selectedInfluencer.color}-100 rounded-full flex items-center justify-center`}>
                    <span className={`text-${selectedInfluencer.color}-600 font-semibold text-xl`}>
                      {selectedInfluencer.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedInfluencer.name}</h3>
                    <p className="text-sm text-gray-500">{selectedInfluencer.platform} • {selectedInfluencer.followers} followers</p>
                  </div>
                </div>

                {/* Rating Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Overall Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Overall Rating
                      </label>
                      <StarRating
                        rating={ratings.overall}
                        onRatingChange={(rating: number) => setRatings(prev => ({ ...prev, overall: rating }))}
                      />
                    </div>

                    {/* Communication */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Communication
                      </label>
                      <p className="text-xs text-gray-500 mb-3">How responsive and professional was their communication?</p>
                      <StarRating
                        rating={ratings.communication}
                        onRatingChange={(rating: number) => setRatings(prev => ({ ...prev, communication: rating }))}
                      />
                    </div>

                    {/* Content Quality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Content Quality
                      </label>
                      <p className="text-xs text-gray-500 mb-3">How would you rate the quality of their content?</p>
                      <StarRating
                        rating={ratings.contentQuality}
                        onRatingChange={(rating: number) => setRatings(prev => ({ ...prev, contentQuality: rating }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Timeliness */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Timeliness
                      </label>
                      <p className="text-xs text-gray-500 mb-3">Did they meet deadlines and deliver on time?</p>
                      <StarRating
                        rating={ratings.timeliness}
                        onRatingChange={(rating: number) => setRatings(prev => ({ ...prev, timeliness: rating }))}
                      />
                    </div>

                    {/* Audience Engagement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Audience Engagement
                      </label>
                      <p className="text-xs text-gray-500 mb-3">How well did their content engage their audience?</p>
                      <StarRating
                        rating={ratings.audienceEngagement}
                        onRatingChange={(rating: number) => setRatings(prev => ({ ...prev, audienceEngagement: rating }))}
                      />
                    </div>

                    {/* Work Again */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Would you work with this influencer again?
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setWorkAgain('Yes')}
                          className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                            workAgain === 'Yes'
                              ? 'bg-purple-50 border-purple-600 text-purple-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {workAgain === 'Yes' && <span className="text-purple-600">✓</span>}
                            <span>Yes</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setWorkAgain('No')}
                          className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                            workAgain === 'No'
                              ? 'bg-purple-50 border-purple-600 text-purple-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {workAgain === 'No' && <span className="text-purple-600">✓</span>}
                            <span>No</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback - Full Width */}
                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Additional Feedback (Optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience working with this influencer..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    rows={4}
                  />
                </div>

                {/* Footer */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={closeRatingModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRating}
                    disabled={ratings.overall === 0}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {selectedInfluencer.hasRating ? 'Update Rating' : 'Submit Rating'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}