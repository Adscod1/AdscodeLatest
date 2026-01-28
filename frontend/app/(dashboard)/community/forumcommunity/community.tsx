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
  Award,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ArrowLeft,
  Heart,
  Reply,
  Share2,
  Flag,
  MoreHorizontal,
  Pin,
  Send,
  Plus,
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

interface ForumReply {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  badge: string;
  badgeColor: string;
  content: string;
  likes: number;
  timeAgo: string;
}

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  badge: string;
  badgeColor: string;
  isPinned: boolean;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  replies: ForumReply[];
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'posts' | 'members'>('recent');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Forum detail view state
  const [selectedForum, setSelectedForum] = useState<ForumSection | null>(null);
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [postFilter, setPostFilter] = useState<'all' | 'pinned'>('all');
  const [postSort, setPostSort] = useState<'most' | 'recent' | 'oldest'>('most');
  const [showPostFilterDropdown, setShowPostFilterDropdown] = useState(false);
  const [showPostSortDropdown, setShowPostSortDropdown] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newDiscussion, setNewDiscussion] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Sample forum posts data
  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: 'Sarah Mitchell',
      avatar: 'SM',
      avatarColor: 'bg-green-500',
      badge: 'Elite Partner',
      badgeColor: 'bg-yellow-50 text-yellow-500',
      isPinned: true,
      content: 'Welcome to everyone joining the platform! 👋 I remember being a new user just 6 months ago. Here are my top tips: 1) Complete your profile 100%, 2) Start with categories you\'re passionate about, 3) Engage with the community daily. Feel free to ask any questions!',
      likes: 45,
      comments: 2,
      timeAgo: '2 hours ago',
      replies: [
        {
          id: '1-1',
          author: 'Tom Harris',
          avatar: 'TH',
          avatarColor: 'bg-gray-400',
          badge: 'Rising Creator',
          badgeColor: 'bg-gray-100 text-gray-600',
          content: 'This is so helpful! Thank you for sharing your experience.',
          likes: 5,
          timeAgo: '1 hour ago'
        },
        {
          id: '1-2',
          author: 'Amy Chen',
          avatar: 'AC',
          avatarColor: 'bg-green-500',
          badge: 'Rising Creator',
          badgeColor: 'bg-gray-100 text-gray-600',
          content: 'Totally agree with point 3! Engagement is everything.',
          likes: 3,
          timeAgo: '45 min ago'
        }
      ]
    },
    {
      id: '2',
      author: 'Mike Chen',
      avatar: 'MC',
      avatarColor: 'bg-teal-500',
      badge: 'Pro Creator',
      badgeColor: 'bg-blue-50 text-blue-500',
      isPinned: false,
      content: 'How long does it typically take to get verified? I\'ve been writing reviews for about 2 weeks now and wondering what the timeline looks like.',
      likes: 8,
      comments: 1,
      timeAgo: '4 hours ago',
      replies: []
    },
    {
      id: '3',
      author: 'Emma Wilson',
      avatar: 'EW',
      avatarColor: 'bg-purple-400',
      badge: 'Rising Creator',
      badgeColor: 'bg-gray-100 text-gray-600',
      isPinned: false,
      content: 'Just joined today! Super excited to start my influencer journey. Any advice on which categories to start with for beginners?',
      likes: 15,
      comments: 0,
      timeAgo: '6 hours ago',
      replies: []
    }
  ];

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

  // Filter and sort forums
  const filteredAndSortedForums = forumSections
    .filter((section) => {
      // Search filter
      const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && section.isActive) ||
        (filterStatus === 'inactive' && !section.isActive);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'posts':
          return b.posts - a.posts;
        case 'members':
          return b.members - a.members;
        case 'recent':
        default:
          // Simple sort based on lastActivity string (in real app, use timestamps)
          return 0;
      }
    });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'posts', label: 'Most Posts' },
    { value: 'members', label: 'Most Members' }
  ];

  const postFilterOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'pinned', label: 'Pinned' }
  ];

  const postSortOptions = [
    { value: 'most', label: 'Most Liked' },
    { value: 'recent', label: 'Recent' },
    { value: 'oldest', label: 'Oldest' }
  ];

  const handleJoinForum = (forum: ForumSection) => {
    setSelectedForum(forum);
  };

  const handleBackToForums = () => {
    setSelectedForum(null);
    setReplyingTo(null);
    setReplyText('');
  };

  const handleLikePost = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleReply = (postId: string) => {
    if (replyingTo === postId) {
      setReplyingTo(null);
      setReplyText('');
    } else {
      setReplyingTo(postId);
      setReplyText('');
    }
  };

  const handleSubmitReply = () => {
    // In a real app, this would submit to an API
    console.log('Submitting reply:', replyText, 'to post:', replyingTo);
    setReplyingTo(null);
    setReplyText('');
  };

  const handlePostDiscussion = () => {
    // In a real app, this would submit to an API
    console.log('Posting discussion:', newDiscussion);
    setNewDiscussion('');
  };

  // Filter and sort posts
  const filteredPosts = forumPosts
    .filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(postSearchQuery.toLowerCase());
      const matchesFilter = postFilter === 'all' || (postFilter === 'pinned' && post.isPinned);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      switch (postSort) {
        case 'most':
          return b.likes - a.likes;
        case 'oldest':
          return 0; // Would use actual timestamps
        case 'recent':
        default:
          return 0;
      }
    });

  // Forum Detail View
  if (selectedForum) {
    return (
      <DashboardLayout profile={profile}>
        <div className="w-full max-w-none bg-gray-50">
          {/* Forum Header */}
          <div className="mb-6">
            <button 
              onClick={handleBackToForums}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedForum.title}</span>
              <span className="text-sm text-gray-400">• {selectedForum.members.toLocaleString()} members</span>
            </button>
          </div>

          {/* New Discussion Input */}
          <div className="bg-white rounded border border-gray-100 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium`}>
                {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newDiscussion}
                  onChange={(e) => setNewDiscussion(e.target.value)}
                  placeholder="Start a new discussion..."
                  className="w-full p-3 border-0 resize-none text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none min-h-[110px]"
                  rows={2}
                />
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Be respectful and follow community guidelines</p>
                  <button 
                    onClick={handlePostDiscussion}
                    disabled={!newDiscussion.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters for Posts */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts and replies..."
                value={postSearchQuery}
                onChange={(e) => setPostSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              {/* Post Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowPostFilterDropdown(!showPostFilterDropdown);
                    setShowPostSortDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded text-sm text-gray-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>{postFilterOptions.find(o => o.value === postFilter)?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showPostFilterDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded">
                    {postFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setPostFilter(option.value as 'all' | 'pinned');
                          setShowPostFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          postFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Post Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowPostSortDropdown(!showPostSortDropdown);
                    setShowPostFilterDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{postSortOptions.find(o => o.value === postSort)?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showPostSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded shadow-lg z-10">
                    {postSortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setPostSort(option.value as 'most' | 'recent' | 'oldest');
                          setShowPostSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          postSort === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded border border-gray-50 p-4 sm:p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${post.avatarColor} flex items-center justify-center text-white text-sm font-medium`}>
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{post.author}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${post.badgeColor}`}>
                          {post.badge}
                        </span>
                        {post.isPinned && (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-500">
                            <Pin className="w-3 h-3" />
                            Pinned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{post.timeAgo}</span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    <button 
                      onClick={() => handleReply(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        replyingTo === post.id ? 'text-blue-500 bg-blue-50 px-3 py-1 rounded-full' : 'text-gray-500 hover:text-blue-500'
                      }`}
                    >
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                    {post.comments > 0 && (
                      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-gray-600">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-50 rounded text-gray-400 hover:text-gray-600">
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reply Form */}
                {replyingTo === post.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium`}>
                        {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-3 border border-gray-100 rounded resize-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button 
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 text-sm font-medium rounded-full text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleSubmitReply}
                            disabled={!replyText.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Replies */}
                {post.replies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 pl-4 border-l-2 border-gray-100">
                        <div className={`w-8 h-8 rounded-full ${reply.avatarColor} flex items-center justify-center text-white text-xs font-medium`}>
                          {reply.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${reply.badgeColor}`}>
                              {reply.badge}
                            </span>
                            <span className="text-xs text-gray-400">• {reply.timeAgo}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                          <button 
                            onClick={() => handleLikePost(reply.id)}
                            className={`flex items-center gap-1 mt-2 text-xs transition-colors ${
                              likedPosts.has(reply.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${likedPosts.has(reply.id) ? 'fill-current' : ''}`} />
                            <span>{reply.likes + (likedPosts.has(reply.id) ? 1 : 0)}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout profile={profile}>
        <div className="w-full max-w-none bg-gray-50">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
              <p className="text-sm sm:text-base text-gray-600">Connect with other users and share experiences</p>
            </div>
              <button className="flex items-center gap-2 text-md sm:text-md font-base text-white cursor-pointer hover:text-white hover:bg-blue-600 bg-blue-500 rounded p-2 px-4 m-2">
                <Plus className="w-4 h-4" />
                Create Forum
              </button>
            </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search forums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowFilterDropdown(!showFilterDropdown);
                    setShowSortDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>{filterOptions.find(o => o.value === filterStatus)?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded shadow-lg z-10">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterStatus(option.value as 'all' | 'active' | 'inactive');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          filterStatus === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowFilterDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as 'recent' | 'posts' | 'members');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Forum Sections */}
          <div className="space-y-4 sm:space-y-6">
            {filteredAndSortedForums.map((section) => (
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
                  
                  <button 
                    onClick={() => handleJoinForum(section)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
                  >
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