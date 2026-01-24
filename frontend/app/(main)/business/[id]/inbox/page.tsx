"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home,
  Send,
  Paperclip,
  ChevronLeft,
  Store,
  Search,
  MessageCircle,
  HelpCircle,
  Clock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import api, { Message } from "@/lib/api-client";

interface QuickQuestion {
  id: string;
  question: string;
  icon: React.ReactNode;
}

const BusinessInbox = () => {
  const params = useParams();
  const businessId = params.id as string;
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Get current user from session
  const { data: user } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const session = await authClient.getSession();
        return session?.data?.user ?? null;
      } catch (error) {
        console.error('Session error:', error);
        return null;
      }
    },
  });

  const currentUserName = user?.name || "Guest User";
  const currentUserImage = user?.image || null;
  const currentUsername = `@${user?.email?.split('@')[0] || 'user'}`;

  // Fetch business/store data
  const { data: storeData } = useQuery({
    queryKey: [`store-${businessId}`],
    queryFn: () => api.stores.getById(businessId),
  });

  const store = storeData?.store;
  const businessName = store?.name || "Business";

  // Get or create conversation with the store
  const { data: conversationData, isLoading: isLoadingConversation } = useQuery({
    queryKey: [`conversation-${businessId}`],
    queryFn: () => api.messages.getOrCreateConversation(businessId),
    enabled: !!businessId && !!user,
  });

  const conversation = conversationData?.conversation;

  // Fetch messages for the conversation
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: [`messages-${conversation?.id}`],
    queryFn: () => api.messages.getConversationMessages(conversation!.id),
    enabled: !!conversation?.id,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  const messages = messagesData?.messages || [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (conversation?.id) {
        return api.messages.sendMessage(conversation.id, content);
      } else {
        return api.messages.sendMessageToStore(businessId, content);
      }
    },
    onSuccess: () => {
      setMessageText('');
      // Refetch messages and conversation
      queryClient.invalidateQueries({ queryKey: [`messages-${conversation?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`conversation-${businessId}`] });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick questions
  const quickQuestions: QuickQuestion[] = [
    {
      id: '1',
      question: 'What are your business hours?',
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: '2',
      question: 'Do you offer delivery services?',
      icon: <MessageCircle className="w-4 h-4" />
    },
    {
      id: '3',
      question: 'What payment methods do you accept?',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: '4',
      question: 'Do you have a return policy?',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: '5',
      question: 'Are your products available for bulk orders?',
      icon: <MessageCircle className="w-4 h-4" />
    },
    {
      id: '6',
      question: 'Can I schedule a consultation?',
      icon: <Clock className="w-4 h-4" />
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(messageText.trim());
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessageText(question);
  };

  // Get initials for avatars
  const getUserInitials = () => {
    const names = currentUserName.split(' ');
    return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBusinessInitials = () => {
    const names = businessName.split(' ');
    return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const dateKey = new Date(message.createdAt).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to message this business.</p>
          <Link href="/auth/login">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Container */}
      <div className="max-w-8xl mx-auto px-2 sm:px-4 py-3 sm:py-6 flex flex-col gap-3 sm:gap-6">
        {/* Header Card - Full Width */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href={`/business/${businessId}`}>
              <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
            </Link>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Home className="h-4 w-4" />
                  <span>Business</span>
                  <span>/</span>
                  <span className="text-gray-900">Inbox</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">Conversation with {businessName}</h1>
                <p className="text-gray-600 text-xs sm:text-sm">Send messages to the business</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {currentUserImage ? (
                  <img
                    src={currentUserImage}
                    alt={currentUserName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{currentUserName}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{currentUsername}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar and Chat Area */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-3 sm:space-y-6 overflow-y-auto max-h-48 lg:max-h-none">
            {/* Search Card */}
            <div className="bg-white rounded shadow-sm p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Search Message
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-1.5 sm:py-2 border border-gray-200 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Questions Card */}
            <div className="bg-white rounded shadow-sm p-3 sm:p-4 hidden lg:block">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuickQuestion(q.question)}
                    className="w-full text-left p-2 sm:p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                        {q.icon}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700 group-hover:text-blue-700">
                        {q.question}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area Card */}
          <div className="flex-1">
            <div className="bg-white rounded shadow-sm flex flex-col" style={{ minHeight: '650px' }}>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {store?.logo ? (
                    <img 
                      src={store.logo} 
                      alt={businessName}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm sm:font-semibold text-gray-900">{businessName}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                      Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {isLoadingConversation || isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      Send a message to {businessName} and they&apos;ll respond as soon as possible.
                    </p>
                  </div>
                ) : (
                  <>
                    {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
                      <div key={dateKey}>
                        {/* Date separator */}
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs text-gray-500">{formatMessageDate(dateMessages[0].createdAt)}</span>
                          </div>
                        </div>
                        
                        {/* Messages for this date */}
                        {dateMessages.map((message) => (
                          <div key={message.id} className={`flex ${message.senderType === 'USER' ? 'justify-end' : 'justify-start'} mb-3`}>
                            <div className="flex items-start space-x-1.5 sm:space-x-2 max-w-[85%] sm:max-w-xs lg:max-w-md">
                              {message.senderType === 'STORE' && (
                                store?.logo ? (
                                  <img 
                                    src={store.logo} 
                                    alt={businessName}
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-semibold flex-shrink-0">
                                    {getBusinessInitials()}
                                  </div>
                                )
                              )}
                              <div className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                                message.senderType === 'USER' 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <p className="text-xs sm:text-sm">{message.content}</p>
                                <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${message.senderType === 'USER' ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {formatMessageTime(message.createdAt)}
                                </p>
                              </div>
                              {message.senderType === 'USER' && (
                                currentUserImage ? (
                                  <img 
                                    src={currentUserImage} 
                                    alt={currentUserName}
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-semibold flex-shrink-0">
                                    {getUserInitials()}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={sendMessageMutation.isPending}
                      className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-200 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="p-1.5 sm:p-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
                {sendMessageMutation.isError && (
                  <p className="text-red-500 text-xs mt-2">Failed to send message. Please try again.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInbox;
