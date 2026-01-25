"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Profile } from '@prisma/client';
import { 
  messagesApi, 
  Conversation, 
  Message, 
  InfluencerConversation, 
  InfluencerMessage,
  storesApi,
  influencersApi
} from '@/lib/api-client';
import { 
  MessageSquare,
  Search,
  Send,
  ChevronLeft,
  Store,
  CheckCheck,
  Loader2,
  Inbox,
  RefreshCw,
  User,
  Users,
  Plus,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

interface MessagesDashboardProps {
  user: Profile;
}

type TabType = 'stores' | 'influencers';
type NewMessageTabType = 'businesses' | 'influencers';

const MessagesDashboard = ({ user }: MessagesDashboardProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get initial state from URL params
  const initialTab = (searchParams.get('tab') as TabType) || 'stores';
  const initialConversation = searchParams.get('conversation') || null;
  const initialInfluencer = searchParams.get('influencer') || null;
  const initialStore = searchParams.get('store') || null;
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedStoreConversation, setSelectedStoreConversation] = useState<string | null>(initialTab === 'stores' ? initialConversation : null);
  const [selectedInfluencerConversation, setSelectedInfluencerConversation] = useState<string | null>(initialTab === 'influencers' ? initialConversation : null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // New Message Modal State
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageTab, setNewMessageTab] = useState<NewMessageTabType>('businesses');
  const [newMessageSearch, setNewMessageSearch] = useState('');

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedStoreConversation, selectedInfluencerConversation]);

  // Handle URL params for opening a conversation with an influencer
  useEffect(() => {
    if (initialInfluencer && activeTab === 'influencers') {
      messagesApi.getOrCreateInfluencerConversation(initialInfluencer)
        .then(data => {
          if (data.success && data.conversation) {
            setSelectedInfluencerConversation(data.conversation.id);
            queryClient.invalidateQueries({ queryKey: ['user-influencer-conversations'] });
          }
        })
        .catch(() => {
          toast.error('Failed to start conversation with influencer');
        });
    }
  }, [initialInfluencer, activeTab, queryClient]);

  // Handle URL params for opening a conversation with a store
  useEffect(() => {
    if (initialStore && activeTab === 'stores') {
      messagesApi.getOrCreateConversation(initialStore)
        .then(data => {
          if (data.success && data.conversation) {
            setSelectedStoreConversation(data.conversation.id);
            queryClient.invalidateQueries({ queryKey: ['user-conversations'] });
          }
        })
        .catch(() => {
          toast.error('Failed to start conversation with store');
        });
    }
  }, [initialStore, activeTab, queryClient]);

  // ============================================================================
  // Store Conversations Queries
  // ============================================================================
  
  const { 
    data: storeConversationsData, 
    isLoading: isLoadingStoreConversations,
    refetch: refetchStoreConversations 
  } = useQuery({
    queryKey: ['user-conversations'],
    queryFn: () => messagesApi.getUserConversations(),
    refetchInterval: 10000,
  });

  const { 
    data: storeMessagesData, 
    isLoading: isLoadingStoreMessages,
    refetch: refetchStoreMessages
  } = useQuery({
    queryKey: ['conversation-messages', selectedStoreConversation],
    queryFn: () => selectedStoreConversation ? messagesApi.getConversationMessages(selectedStoreConversation) : null,
    enabled: !!selectedStoreConversation,
    refetchInterval: 5000,
  });

  const { data: storeUnreadData } = useQuery({
    queryKey: ['user-unread-count'],
    queryFn: () => messagesApi.getUserUnreadCount(),
    refetchInterval: 10000,
  });

  // ============================================================================
  // Influencer Conversations Queries
  // ============================================================================

  const { 
    data: influencerConversationsData, 
    isLoading: isLoadingInfluencerConversations,
    refetch: refetchInfluencerConversations 
  } = useQuery({
    queryKey: ['user-influencer-conversations'],
    queryFn: () => messagesApi.getUserInfluencerConversations(),
    refetchInterval: 10000,
  });

  const { 
    data: influencerMessagesData, 
    isLoading: isLoadingInfluencerMessages,
    refetch: refetchInfluencerMessages
  } = useQuery({
    queryKey: ['influencer-conversation-messages', selectedInfluencerConversation],
    queryFn: () => selectedInfluencerConversation ? messagesApi.getInfluencerConversationMessages(selectedInfluencerConversation) : null,
    enabled: !!selectedInfluencerConversation,
    refetchInterval: 5000,
  });

  const { data: influencerUnreadData } = useQuery({
    queryKey: ['user-influencer-unread-count'],
    queryFn: () => messagesApi.getUserInfluencerUnreadCount(),
    refetchInterval: 10000,
  });

  // ============================================================================
  // New Message Modal Queries
  // ============================================================================

  const { data: allStoresData, isLoading: isLoadingStores } = useQuery({
    queryKey: ['all-stores-for-messages'],
    queryFn: () => storesApi.getAllStores({ limit: 100 }),
    enabled: showNewMessageModal && newMessageTab === 'businesses',
  });

  const { data: allInfluencersData, isLoading: isLoadingInfluencers } = useQuery({
    queryKey: ['all-influencers-for-messages'],
    queryFn: () => influencersApi.getAll(),
    enabled: showNewMessageModal && newMessageTab === 'influencers',
  });

  // ============================================================================
  // Mutations
  // ============================================================================

  const sendStoreMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      messagesApi.sendMessage(conversationId, content),
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', selectedStoreConversation] });
      queryClient.invalidateQueries({ queryKey: ['user-conversations'] });
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.');
    },
  });

  const sendInfluencerMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      messagesApi.sendInfluencerMessage(conversationId, content),
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['influencer-conversation-messages', selectedInfluencerConversation] });
      queryClient.invalidateQueries({ queryKey: ['user-influencer-conversations'] });
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.');
    },
  });

  // ============================================================================
  // Data
  // ============================================================================

  const storeConversations = storeConversationsData?.conversations || [];
  const storeMessages = storeMessagesData?.messages || [];
  const currentStoreConversation = storeConversations.find(c => c.id === selectedStoreConversation);
  const storeUnreadCount = storeUnreadData?.count || 0;

  const influencerConversations = influencerConversationsData?.conversations || [];
  const influencerMessages = influencerMessagesData?.messages || [];
  const currentInfluencerConversation = influencerConversations.find(c => c.id === selectedInfluencerConversation);
  const influencerUnreadCount = influencerUnreadData?.count || 0;

  const totalUnreadCount = storeUnreadCount + influencerUnreadCount;

  // Filter conversations based on search
  const filteredStoreConversations = storeConversations.filter(conv =>
    conv.store?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredInfluencerConversations = influencerConversations.filter(conv => {
    const name = `${conv.influencer?.firstName || ''} ${conv.influencer?.lastName || ''}`.toLowerCase();
    return name.includes(searchText.toLowerCase());
  });

  // Filter stores and influencers for new message modal
  const allStores = allStoresData?.stores || [];
  const filteredStores = allStores.filter(store =>
    store.name?.toLowerCase().includes(newMessageSearch.toLowerCase())
  );

  const allInfluencers = allInfluencersData || [];
  const filteredNewInfluencers = allInfluencers.filter(inf => {
    const name = `${inf.firstName || ''} ${inf.lastName || ''}`.toLowerCase();
    return name.includes(newMessageSearch.toLowerCase());
  });

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    if (activeTab === 'stores' && selectedStoreConversation) {
      sendStoreMessageMutation.mutate({
        conversationId: selectedStoreConversation,
        content: messageText.trim(),
      });
    } else if (activeTab === 'influencers' && selectedInfluencerConversation) {
      sendInfluencerMessageMutation.mutate({
        conversationId: selectedInfluencerConversation,
        content: messageText.trim(),
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const handleBack = () => {
    if (activeTab === 'stores') {
      setSelectedStoreConversation(null);
    } else {
      setSelectedInfluencerConversation(null);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'stores') {
      refetchStoreConversations();
      if (selectedStoreConversation) {
        refetchStoreMessages();
      }
    } else {
      refetchInfluencerConversations();
      if (selectedInfluencerConversation) {
        refetchInfluencerMessages();
      }
    }
    toast.success('Messages refreshed');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchText('');
  };

  const handleStartConversationWithStore = async (storeId: string) => {
    try {
      const data = await messagesApi.getOrCreateConversation(storeId);
      if (data.success && data.conversation) {
        setActiveTab('stores');
        setSelectedStoreConversation(data.conversation.id);
        setShowNewMessageModal(false);
        setNewMessageSearch('');
        queryClient.invalidateQueries({ queryKey: ['user-conversations'] });
        toast.success('Conversation started!');
      }
    } catch {
      toast.error('Failed to start conversation');
    }
  };

  const handleStartConversationWithInfluencer = async (influencerId: string) => {
    try {
      const data = await messagesApi.getOrCreateInfluencerConversation(influencerId);
      if (data.success && data.conversation) {
        setActiveTab('influencers');
        setSelectedInfluencerConversation(data.conversation.id);
        setShowNewMessageModal(false);
        setNewMessageSearch('');
        queryClient.invalidateQueries({ queryKey: ['user-influencer-conversations'] });
        toast.success('Conversation started!');
      }
    } catch {
      toast.error('Failed to start conversation');
    }
  };

  const isSelectedConversation = activeTab === 'stores' ? selectedStoreConversation : selectedInfluencerConversation;
  const isLoading = activeTab === 'stores' ? isLoadingStoreConversations : isLoadingInfluencerConversations;
  const filteredConversations = activeTab === 'stores' ? filteredStoreConversations : filteredInfluencerConversations;
  const messages: Array<Message | InfluencerMessage> = activeTab === 'stores' ? storeMessages : influencerMessages;
  const isLoadingMessages = activeTab === 'stores' ? isLoadingStoreMessages : isLoadingInfluencerMessages;
  const isSending = sendStoreMessageMutation.isPending || sendInfluencerMessageMutation.isPending;

  return (
    <DashboardLayout profile={user}>
      <div className="flex h-[calc(100vh-64px)] bg-gray-50">
        {/* Conversations List - Hidden on mobile when conversation is selected */}
        <div className={`${
          isMobile && isSelectedConversation ? 'hidden' : 'flex'
        } w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col`}>
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-gray-900" />
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Messages</h1>
                {totalUnreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {totalUnreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="p-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                  title="New message"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh messages"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleTabChange('stores')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'stores'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Store className="w-4 h-4" />
                Businesses
                {storeUnreadCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === 'stores' ? 'bg-white text-gray-900' : 'bg-red-500 text-white'
                  }`}>
                    {storeUnreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleTabChange('influencers')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'influencers'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                Influencers
                {influencerUnreadCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === 'influencers' ? 'bg-white text-gray-900' : 'bg-red-500 text-white'
                  }`}>
                    {influencerUnreadCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'stores' ? 'businesses' : 'influencers'}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-gray-600 font-medium mb-2">No conversations yet</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {activeTab === 'stores' 
                    ? 'Start a conversation by messaging a business.'
                    : 'Start a conversation by messaging an influencer.'
                  }
                </p>
                <button
                  onClick={() => {
                    setShowNewMessageModal(true);
                    setNewMessageTab(activeTab === 'stores' ? 'businesses' : 'influencers');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Message
                </button>
              </div>
            ) : activeTab === 'stores' ? (
              // Store Conversations
              filteredStoreConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedStoreConversation(conv.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedStoreConversation === conv.id ? 'bg-gray-100 border-l-4 border-l-gray-900' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      {conv.store?.logo ? (
                        <Image
                          src={conv.store.logo}
                          alt={conv.store.name || 'Store'}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                          {conv.store?.name?.charAt(0)?.toUpperCase() || <Store className="w-5 h-5" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conv.store?.name || 'Unknown Store'}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {conv.lastMessageAt && formatMessageTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate pr-2">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                        {(conv.unreadCount ?? 0) > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Influencer Conversations
              filteredInfluencerConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedInfluencerConversation(conv.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedInfluencerConversation === conv.id ? 'bg-gray-100 border-l-4 border-l-gray-900' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      {conv.influencer?.user?.image ? (
                        <Image
                          src={conv.influencer.user.image}
                          alt={`${conv.influencer.firstName} ${conv.influencer.lastName}`}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {conv.influencer?.firstName?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conv.influencer ? `${conv.influencer.firstName} ${conv.influencer.lastName}` : 'Unknown Influencer'}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {conv.lastMessageAt && formatMessageTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate pr-2">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                        {(conv.unreadCount ?? 0) > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {conv.influencer?.primaryNiche && (
                        <p className="text-xs text-purple-600 mt-1">{conv.influencer.primaryNiche}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${
          isMobile && !isSelectedConversation ? 'hidden' : 'flex'
        } flex-1 flex-col bg-white`}>
          {isSelectedConversation && (activeTab === 'stores' ? currentStoreConversation : currentInfluencerConversation) ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <button
                      onClick={handleBack}
                      className="p-2 -ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {activeTab === 'stores' && currentStoreConversation ? (
                    <>
                      <div className="relative flex-shrink-0">
                        {currentStoreConversation.store?.logo ? (
                          <Image
                            src={currentStoreConversation.store.logo}
                            alt={currentStoreConversation.store.name || 'Store'}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                            {currentStoreConversation.store?.name?.charAt(0)?.toUpperCase() || <Store className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {currentStoreConversation.store?.name || 'Unknown Store'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          @{currentStoreConversation.store?.username || 'store'}
                        </p>
                      </div>
                    </>
                  ) : activeTab === 'influencers' && currentInfluencerConversation ? (
                    <>
                      <div className="relative flex-shrink-0">
                        {currentInfluencerConversation.influencer?.user?.image ? (
                          <Image
                            src={currentInfluencerConversation.influencer.user.image}
                            alt={`${currentInfluencerConversation.influencer.firstName} ${currentInfluencerConversation.influencer.lastName}`}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {currentInfluencerConversation.influencer?.firstName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {currentInfluencerConversation.influencer 
                            ? `${currentInfluencerConversation.influencer.firstName} ${currentInfluencerConversation.influencer.lastName}`
                            : 'Unknown Influencer'
                          }
                        </h3>
                        {currentInfluencerConversation.influencer?.primaryNiche && (
                          <p className="text-xs text-purple-600">
                            {currentInfluencerConversation.influencer.primaryNiche}
                          </p>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] md:max-w-md px-4 py-3 rounded-2xl ${
                            message.senderType === 'USER'
                              ? 'bg-gray-900 text-white rounded-br-md'
                              : activeTab === 'influencers'
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm rounded-bl-md'
                              : 'bg-white text-gray-900 shadow-sm border border-gray-200 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            message.senderType === 'USER' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className={`text-xs ${
                              message.senderType === 'USER' || (activeTab === 'influencers' && message.senderType === 'INFLUENCER')
                                ? 'text-gray-300' 
                                : 'text-gray-500'
                            }`}>
                              {formatMessageTime(message.createdAt)}
                            </span>
                            {message.senderType === 'USER' && message.isRead && (
                              <CheckCheck className="w-3 h-3 text-blue-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows={1}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none min-h-[48px] max-h-32"
                      style={{
                        height: 'auto',
                        overflowY: messageText.split('\n').length > 3 ? 'auto' : 'hidden'
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            // No conversation selected
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Messages</h2>
              <p className="text-gray-500 max-w-sm mb-6">
                {activeTab === 'stores'
                  ? "Select a conversation or start a new one with a business."
                  : "Select a conversation or start a new one with an influencer."
                }
              </p>
              <button
                onClick={() => {
                  setShowNewMessageModal(true);
                  setNewMessageTab(activeTab === 'stores' ? 'businesses' : 'influencers');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Start New Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">New Message</h2>
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setNewMessageSearch('');
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setNewMessageTab('businesses')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    newMessageTab === 'businesses'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Businesses
                </button>
                <button
                  onClick={() => setNewMessageTab('influencers')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    newMessageTab === 'influencers'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Influencers
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${newMessageTab}...`}
                  value={newMessageSearch}
                  onChange={(e) => setNewMessageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {newMessageTab === 'businesses' ? (
                isLoadingStores ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : filteredStores.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <Store className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No businesses found</p>
                  </div>
                ) : (
                  filteredStores.map((store) => (
                    <div
                      key={store.id}
                      onClick={() => handleStartConversationWithStore(store.id)}
                      className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          {store.logo ? (
                            <Image
                              src={store.logo}
                              alt={store.name || 'Store'}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                              {store.name?.charAt(0)?.toUpperCase() || <Store className="w-4 h-4" />}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {store.name}
                          </h3>
                          {store.username && (
                            <p className="text-xs text-gray-500">@{store.username}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                isLoadingInfluencers ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : filteredNewInfluencers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <Users className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No influencers found</p>
                  </div>
                ) : (
                  filteredNewInfluencers.map((influencer) => (
                    <div
                      key={influencer.id}
                      onClick={() => handleStartConversationWithInfluencer(influencer.id)}
                      className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          {influencer.profilePicture ? (
                            <Image
                              src={influencer.profilePicture}
                              alt={`${influencer.firstName} ${influencer.lastName}`}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {influencer.firstName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {influencer.firstName} {influencer.lastName}
                          </h3>
                          {influencer.primaryNiche && (
                            <p className="text-xs text-purple-600">{influencer.primaryNiche}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MessagesDashboard;
