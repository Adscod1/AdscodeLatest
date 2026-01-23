"use client";

import React, { useState } from 'react';
import { 
  Home,
  Send,
  Paperclip,
  ArrowLeft,
  Store,
  Search,
  MessageCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api-client";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'business';
}

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

  // Get current user from database
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
    queryKey: [`/api/stores/${businessId}`],
    queryFn: () => api.stores.getById(businessId),
  });

  const businessName = storeData?.store?.name || "Business";

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

  // Sample messages - In production, fetch from API
  const messages: Message[] = [
    {
      id: '1',
      text: 'Hi! I saw your products and I\'m interested in learning more.',
      timestamp: '2:30 PM',
      sender: 'user'
    },
    {
      id: '2',
      text: 'Hello! Thank you for your interest. I\'d be happy to help you with any questions you have.',
      timestamp: '2:35 PM',
      sender: 'business'
    },
    {
      id: '3',
      text: 'Great! Do you have any special offers running right now?',
      timestamp: '2:40 PM',
      sender: 'user'
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Here you would typically send the message to your backend
      setMessageText('');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Container */}
      <div className="max-w-8xl mx-auto px-2 sm:px-4 py-3 sm:py-6 flex flex-col gap-3 sm:gap-6">
        {/* Header Card - Full Width */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href={`/business/${businessId}`}>
              <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
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
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
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
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-start space-x-1.5 sm:space-x-2 max-w-[85%] sm:max-w-xs lg:max-w-md">
                      {message.sender === 'business' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-semibold flex-shrink-0">
                          {getBusinessInitials()}
                        </div>
                      )}
                      <div className={`px-3 py-2 sm:px-4 sm:py-2 rounded ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      }`}>
                        <p className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{message.sender === 'user' ? currentUserName : businessName}</p>
                        <p className="text-xs sm:text-sm">{message.text}</p>
                        <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-semibold flex-shrink-0">
                          {getUserInitials()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
                      className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-200 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    className="p-1.5 sm:p-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInbox;
