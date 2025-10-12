"use client";
import React, { useState } from 'react';
import { Search, Mail, Users, Clock, AlertCircle, MoreVertical, MessageSquare } from 'lucide-react';

interface Badge {
  text: string;
  color: string;
}

interface Message {
  id: number;
  sender: string;
  initials: string;
  timestamp: string;
  subject: string;
  preview: string;
  status: string;
  priority: string;
  badges: Badge[];
}

interface Stat {
  label: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MessagesPage() {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const messages: Message[] = [
    {
      id: 3468,
      sender: 'John Smith',
      initials: 'JS',
      timestamp: '2024-01-15 14:30',
      subject: 'Issue with order delivery',
      preview: 'Hi, I ordered shoes last week (Order #3468) and they haven\'t arrived yet. The tracking shows delivered but...',
      status: 'Unread',
      priority: 'High',
      badges: [
        { text: 'Unread', color: 'red' },
        { text: 'High', color: 'yellow' }
      ]
    },
    {
      id: 3445,
      sender: 'Sarah Johnson',
      initials: 'SJ',
      timestamp: '2024-01-15 13:15',
      subject: 'Product return request',
      preview: 'I\'d like to return the Adidas Ultraboost I purchased. They aren\'t fit properly despite ordering my usual si...',
      status: 'New',
      priority: 'Medium',
      badges: [
        { text: 'New', color: 'yellow' },
        { text: 'Medium', color: 'blue' }
      ]
    },
    {
      id: 3421,
      sender: 'Mike Davis',
      initials: 'MD',
      timestamp: '2024-01-14 09:45',
      subject: 'Question about product sizing',
      preview: 'I\'m interested in buying the Nike Air Max 270. Do they run small? I usually wear size 10 in most...',
      status: 'Resolved',
      priority: 'Low',
      badges: [
        { text: 'Resolved', color: 'green' },
        { text: 'Low', color: 'gray' }
      ]
    },
    {
      id: 3389,
      sender: 'Emily Wilson',
      initials: 'EW',
      timestamp: '2024-01-13 16:20',
      subject: 'Complaint about product quality',
      preview: 'The shoes I received are not as described. The material quality is much worse than the website reflects. I\'m...',
      status: 'Unread',
      priority: 'Urgent',
      badges: [
        { text: 'Unread', color: 'blue' },
        { text: 'Urgent', color: 'red' }
      ]
    }
  ];

  const stats: Stat[] = [
    { label: 'Unread Messages', value: '1', subtext: 'Require attention', icon: Mail },
    { label: 'Total Messages', value: '4', subtext: 'This month', icon: Users },
    { label: 'Urgent Messages', value: '1', subtext: 'High priority', icon: AlertCircle },
    { label: 'Avg. Response Time', value: '2.5 hours', subtext: '-15% vs last month', icon: Clock }
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
      {/* Messages List */}
      <div className={`${selectedMessage ? 'hidden lg:flex' : 'flex'} w-full lg:w-[450px] bg-white border-r border-gray-200 flex-col`}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Messages</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage customer communications and support tickets</p>
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
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Status</option>
              <option>Unread</option>
              <option>New</option>
              <option>Resolved</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Priority</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedMessage?.id === message.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-gray-600">
                    {message.initials}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {message.sender}
                      </h3>
                      <p className="text-xs text-gray-500">{message.timestamp}</p>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {message.subject}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {message.preview}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      {message.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getBadgeStyles(badge.color)}`}
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">#{message.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail / Empty State */}
      <div className={`${selectedMessage ? 'flex' : 'hidden lg:flex'} flex-1 items-center justify-center bg-white relative`}>
        {selectedMessage ? (
          <div className="max-w-2xl w-full p-4 sm:p-6 lg:p-8">
            {/* Back button for mobile */}
            <button
              onClick={() => setSelectedMessage(null)}
              className="lg:hidden mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to messages
            </button>

            <div className="mb-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm sm:text-base font-semibold text-gray-600">
                    {selectedMessage.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                    <span className="font-medium text-gray-700 truncate">{selectedMessage.sender}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">{selectedMessage.timestamp}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>#{selectedMessage.id}</span>
                  </div>
                </div>
                <div className="hidden sm:flex gap-2 flex-shrink-0">
                  {selectedMessage.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyles(badge.color)}`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile badges */}
              <div className="sm:hidden flex gap-2 mb-4 flex-wrap">
                {selectedMessage.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles(badge.color)}`}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>

              <div className="prose max-w-none">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {selectedMessage.preview}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <textarea
                placeholder="Type your response..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-4">
                <div className="flex flex-wrap gap-2">
                  <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Mark as Read
                  </button>
                  <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Archive
                  </button>
                </div>
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Select a message
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm px-4">
              Choose a message from the list to view the conversation and respond.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}