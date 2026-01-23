"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Mail, Users, Clock, AlertCircle, MoreVertical, MessageSquare, Send, Loader2, ArrowLeft } from 'lucide-react';
import api, { Conversation, Message } from "@/lib/api-client";

export default function MessagesPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const queryClient = useQueryClient();
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch store conversations
  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery({
    queryKey: [`store-conversations-${storeId}`, statusFilter, searchQuery],
    queryFn: () => api.messages.getStoreConversations(storeId, {
      status: statusFilter,
      search: searchQuery || undefined,
    }),
    enabled: !!storeId,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const conversations = conversationsData?.conversations || [];

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: [`store-unread-${storeId}`],
    queryFn: () => api.messages.getStoreUnreadCount(storeId),
    enabled: !!storeId,
    refetchInterval: 10000,
  });

  const unreadCount = unreadData?.count || 0;

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: [`store-messages-${selectedConversation?.id}`],
    queryFn: () => api.messages.getStoreConversationMessages(storeId, selectedConversation!.id),
    enabled: !!selectedConversation?.id,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const messages = messagesData?.messages || [];

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      return api.messages.replyAsStore(storeId, selectedConversation!.id, content);
    },
    onSuccess: () => {
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: [`store-messages-${selectedConversation?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`store-conversations-${storeId}`] });
      queryClient.invalidateQueries({ queryKey: [`store-unread-${storeId}`] });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = () => {
    if (replyText.trim() && !replyMutation.isPending && selectedConversation) {
      replyMutation.mutate(replyText.trim());
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = [
    { label: 'Unread Messages', value: unreadCount.toString(), subtext: 'Require attention', icon: Mail },
    { label: 'Total Conversations', value: conversations.length.toString(), subtext: 'Active chats', icon: Users },
    { label: 'Urgent Messages', value: conversations.filter(c => (c.unreadCount || 0) > 2).length.toString(), subtext: 'High priority', icon: AlertCircle },
    { label: 'Avg. Response Time', value: '< 1 hour', subtext: 'This week', icon: Clock }
  ];

  const getBadgeStyles = (color: string): string => {
    const styles: Record<string, string> = {
      red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-400 text-gray-900',
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      gray: 'bg-gray-400 text-white'
    };
    return styles[color] || 'bg-gray-400 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-[450px] bg-white border-r border-gray-200 flex-col`}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Messages</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage customer communications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-200">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <stat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                <span className="text-[10px] sm:text-xs text-gray-500 truncate">{stat.label}</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 truncate">{stat.subtext}</div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="p-3 sm:p-4 border-b border-gray-200 space-y-2 sm:space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations yet</h3>
              <p className="text-xs text-gray-500">When customers message you, they&apos;ll appear here.</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  {/* Avatar */}
                  {conversation.user?.image ? (
                    <img
                      src={conversation.user.image}
                      alt={conversation.user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-white">
                        {getInitials(conversation.user?.name)}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.user?.name || conversation.user?.email || 'Unknown User'}
                        </h3>
                        <p className="text-xs text-gray-500">{formatTime(conversation.lastMessageAt)}</p>
                      </div>
                      {(conversation.unreadCount || 0) > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat View / Empty State */}
      <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-white relative`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {selectedConversation.user?.image ? (
                <img
                  src={selectedConversation.user.image}
                  alt={selectedConversation.user.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {getInitials(selectedConversation.user?.name)}
                  </span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {selectedConversation.user?.name || 'Unknown User'}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {selectedConversation.user?.email}
                </p>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-sm text-gray-500">Start responding to your customer&apos;s inquiry.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderType === 'STORE' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                      {message.senderType === 'USER' && (
                        selectedConversation.user?.image ? (
                          <img
                            src={selectedConversation.user.image}
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-white">
                              {getInitials(selectedConversation.user?.name)}
                            </span>
                          </div>
                        )
                      )}
                      <div className={`px-4 py-2 rounded-lg ${
                        message.senderType === 'STORE' 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.senderType === 'STORE' ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                  disabled={replyMutation.isPending}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                <button 
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || replyMutation.isPending}
                  className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {replyMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              {replyMutation.isError && (
                <p className="text-red-500 text-xs mt-2">Failed to send reply. Please try again.</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Choose a conversation from the list to view messages and respond to your customers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}