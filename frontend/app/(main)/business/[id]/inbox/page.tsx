"use client";

import React, { useState } from 'react';
import { 
  Home,
  Search,
  Plus,
  Send,
  Paperclip,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'contact';
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  type: 'customer' | 'influencer' | 'support' | 'inquiry';
  status: 'online' | 'offline';
  unread?: boolean;
}

interface MessageTemplate {
  id: string;
  title: string;
  description: string;
}

const BusinessInbox = () => {
  const params = useParams();
  const businessId = params.id as string;
  const [selectedConversation, setSelectedConversation] = useState<string>('customer1');
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');

  const conversations: Conversation[] = [
    {
      id: 'customer1',
      name: 'John Smith',
      avatar: 'JS',
      lastMessage: 'Thank you for the quick response! When do...',
      timestamp: '1 hour ago',
      type: 'customer',
      status: 'online'
    },
    {
      id: 'influencer1',
      name: 'Sarah Martinez',
      avatar: 'SM',
      lastMessage: 'I\'d love to collaborate with your brand...',
      timestamp: '3 hours ago',
      type: 'influencer',
      status: 'online'
    },
    {
      id: 'customer2',
      name: 'Emily Johnson',
      avatar: 'EJ',
      lastMessage: 'Is this product available in other colors?',
      timestamp: '5 hours ago',
      type: 'inquiry',
      status: 'offline'
    },
    {
      id: 'influencer2',
      name: 'Alex Chen',
      avatar: 'AC',
      lastMessage: 'I\'ve completed the review for your latest...',
      timestamp: '1 day ago',
      type: 'influencer',
      status: 'offline'
    },
    {
      id: 'support',
      name: 'Adscod Support',
      avatar: 'AS',
      lastMessage: 'Welcome to Adscod Business! Here\'s how...',
      timestamp: '2 days ago',
      type: 'support',
      status: 'offline'
    }
  ];

  const messages: Record<string, Message[]> = {
    customer1: [
      {
        id: '1',
        text: 'Hi! I saw your product and I\'m interested in learning more about the features.',
        timestamp: '2:30 PM',
        sender: 'contact'
      },
      {
        id: '2',
        text: 'Hello John! Thank you for your interest. I\'d be happy to help you with any questions you have.',
        timestamp: '2:35 PM',
        sender: 'user'
      },
      {
        id: '3',
        text: 'Thank you for the quick response! When do you expect the next shipment to arrive?',
        timestamp: '2:40 PM',
        sender: 'contact'
      }
    ],
    influencer1: [
      {
        id: '1',
        text: 'I\'d love to collaborate with your brand! I have a following of 50K+ engaged users.',
        timestamp: '11:15 AM',
        sender: 'contact'
      },
      {
        id: '2',
        text: 'Hi Sarah! We\'d love to work with you. Let\'s discuss the details of a potential campaign.',
        timestamp: '11:30 AM',
        sender: 'user'
      }
    ],
    customer2: [
      {
        id: '1',
        text: 'Is this product available in other colors?',
        timestamp: '9:20 AM',
        sender: 'contact'
      }
    ],
    influencer2: [
      {
        id: '1',
        text: 'I\'ve completed the review for your latest product. Should be live on my channel tomorrow!',
        timestamp: '4:15 PM',
        sender: 'contact'
      },
      {
        id: '2',
        text: 'Excellent! Thank you for your work. Looking forward to seeing the results.',
        timestamp: '4:20 PM',
        sender: 'user'
      }
    ],
    support: [
      {
        id: '1',
        text: 'Welcome to Adscod Business! Here\'s how to get started with your business profile.',
        timestamp: '10:00 AM',
        sender: 'contact'
      }
    ]
  };

  const messageTemplates: MessageTemplate[] = [
    {
      id: '1',
      title: 'Thank Customer',
      description: 'Thank customers for their interest'
    },
    {
      id: '2',
      title: 'Product Inquiry',
      description: 'Respond to product questions'
    },
    {
      id: '3',
      title: 'Collaboration Request',
      description: 'Respond to influencer collaboration requests'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer': return 'bg-blue-500';
      case 'influencer': return 'bg-purple-500';
      case 'inquiry': return 'bg-green-500';
      case 'support': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'customer': return 'Customer';
      case 'influencer': return 'Influencer';
      case 'inquiry': return 'Inquiry';
      case 'support': return 'Support';
      default: return '';
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Here you would typically send the message to your backend
      setMessageText('');
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex w-full">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Link href={`/business/${businessId}`}>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Home className="h-4 w-4" />
                <span>Business</span>
                <span>/</span>
                <span className="text-gray-900">Inbox</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inbox</h1>
            <p className="text-gray-600 text-sm">Manage conversations with customers and influencers</p>
          </div>

          {/* Search and Add */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 ${getTypeColor(conv.type)} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                      {conv.avatar}
                    </div>
                    {conv.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        conv.type === 'customer' ? 'bg-blue-100 text-blue-800' :
                        conv.type === 'influencer' ? 'bg-purple-100 text-purple-800' :
                        conv.type === 'inquiry' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getTypeLabel(conv.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv && (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-10 h-10 ${getTypeColor(selectedConv.type)} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                      {selectedConv.avatar}
                    </div>
                    {selectedConv.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConv.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className={`w-2 h-2 ${selectedConv.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-2`}></span>
                      {selectedConv.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      selectedConv.type === 'customer' ? 'bg-blue-100 text-blue-800' :
                      selectedConv.type === 'influencer' ? 'bg-purple-100 text-purple-800' :
                      selectedConv.type === 'inquiry' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getTypeLabel(selectedConv.type)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {currentMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Message Templates Section */}
          <div className="w-full bg-white border-t border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {messageTemplates.map((template) => (
                <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2">{template.title}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInbox;
