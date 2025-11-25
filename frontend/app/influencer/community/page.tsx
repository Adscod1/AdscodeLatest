"use client";

import React, { useState } from 'react';
import InfluencerSidebar from '@/components/ui/influencersidebar';
import { 
  Search, 
  Plus, 
  Users, 
  MessageSquare, 
  Heart, 
  Calendar, 
  Home, 
  ChevronRight 
} from 'lucide-react';

interface Discussion {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  title: string;
  category: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface Contributor {
  name: string;
  avatar: string;
  initials: string;
  role: string;
  contributions: number;
  badge?: string;
}

interface Event {
  title: string;
  type: string;
  date: string;
  participants: number;
}

const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('community');

  const discussions: Discussion[] = [
    {
      id: '1',
      author: { name: 'Sa', avatar: '', initials: 'Sa' },
      title: 'Best practices for tech product reviews',
      category: 'Tips & Tricks',
      timeAgo: '2 hours ago',
      content: "I've been reviewing tech products for 6 months now and wanted to share some insights on what makes a review stand out to brands...",
      likes: 12,
      comments: 28,
      tags: ['tech', 'reviews', 'tips']
    },
    {
      id: '2',
      author: { name: 'MR', avatar: '', initials: 'MR' },
      title: 'How to negotiate better campaign rates?',
      category: 'Business',
      timeAgo: '5 hours ago',
      content: "As I'm moving from emerging to verified influencer status, I'm wondering about the best strategies for negotiating campaign compensation...",
      likes: 8,
      comments: 15,
      tags: ['negotiation', 'campaigns', 'rates']
    },
    {
      id: '3',
      author: { name: 'EW', avatar: '', initials: 'EW' },
      title: 'New member introduction and questions',
      category: 'Welcome',
      timeAgo: '1 day ago',
      content: "Hi everyone! I just joined Adscod and I'm excited to start my influencer journey. I have a few questions about getting started...",
      likes: 5,
      comments: 12,
      tags: ['introduction', 'newbie', 'questions']
    },
    {
      id: '4',
      author: { name: 'LA', avatar: '', initials: 'LA' },
      title: 'Fashion campaign experience sharing',
      category: 'Success Stories',
      timeAgo: '2 days ago',
      content: "Just completed my first major fashion campaign with StyleHub! Want to share my experience and lessons learned for other aspiring fashion influencers...",
      likes: 20,
      comments: 45,
      tags: ['fashion', 'success', 'campaign']
    }
  ];

  const topContributors: Contributor[] = [
    { name: 'Sarah Johnson', initials: 'SJ', avatar: '', role: 'Helper', contributions: 47, badge: 'helper' },
    { name: 'Mike Rodriguez', initials: 'MR', avatar: '', role: 'Mentor', contributions: 35, badge: 'mentor' },
    { name: 'Emma Wilson', initials: 'EW', avatar: '', role: 'Rising Star', contributions: 28, badge: 'star' },
    { name: 'David Kim', initials: 'DK', avatar: '', role: 'Contributor', contributions: 12 }
  ];

  const upcomingEvents: Event[] = [
    { title: 'Influencer Marketing Masterclass', type: 'Webinar', date: 'Dec 28, 2024 at 2:00 PM', participants: 56 },
    { title: 'Q&A with Top Brands', type: 'Live Session', date: 'Jan 3, 2025 at 3:00 PM', participants: 78 },
    { title: 'Content Creation Workshop', type: 'Workshop', date: 'Jan 12, 2025 at 1:00 PM', participants: 32 }
  ];

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'helper': return 'bg-blue-100 text-blue-800';
      case 'mentor': return 'bg-purple-100 text-purple-800';
      case 'star': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Tips & Tricks': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Welcome': 'bg-purple-100 text-purple-800',
      'Success Stories': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <InfluencerSidebar 
        firstName="Alex" 
        lastName="Chen" 
        status="PENDING" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6 w-full">
        <div className="w-full max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Home className="w-4 h-4 mr-1" />
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900">Community</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Connect, learn, and grow with fellow influencers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,248</div>
            <div className="text-sm text-gray-600">Community Members</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-600">Active Discussions</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-600">Helpful Answers</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-600">Weekly Events</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discussions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Community Discussions</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search discussions..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Discussion List */}
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">{discussion.author.initials}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{discussion.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(discussion.category)}`}>
                            {discussion.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{discussion.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {discussion.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {discussion.comments}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {discussion.tags.map((tag) => (
                            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">{contributor.initials}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 text-sm">{contributor.name}</p>
                        {contributor.badge && (
                          <span className={`px-2 py-1 rounded-full text-xs ${getBadgeColor(contributor.badge)}`}>
                            {contributor.role}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{contributor.contributions} contributions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{event.type}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.participants} participants</p>
                    <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">Join Event</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Community Guidelines</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Be respectful and supportive</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Share helpful insights and experiences</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Keep discussions relevant and constructive</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Help newcomers learn and grow</span>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 mt-3">Read Full Guidelines</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;