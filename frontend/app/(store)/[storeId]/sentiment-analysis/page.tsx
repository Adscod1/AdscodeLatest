"use client";
import React from 'react';
import { Search, Filter, Heart, MessageSquare, TrendingUp, AlertTriangle, Eye } from 'lucide-react';

const SentimentDashboard = () => {
  const sentimentData = [
    { type: 'Very Positive', count: 524, percentage: 42, color: 'bg-green-500' },
    { type: 'Positive', count: 448, percentage: 36, color: 'bg-green-400' },
    { type: 'Neutral', count: 187, percentage: 15, color: 'bg-gray-400' },
    { type: 'Negative', count: 62, percentage: 5, color: 'bg-orange-400' },
    { type: 'Very Negative', count: 26, percentage: 2, color: 'bg-red-500' },
  ];

  const platformData = [
    { platform: 'Twitter', mentions: '1.2K mentions', score: '76%', change: '+1%', icon: '🐦' },
    { platform: 'Facebook', mentions: '334 mentions', score: '82%', change: '+18%', icon: '📘' },
    { platform: 'Instagram', mentions: '239 mentions', score: '85%', change: '+1%', icon: '📷' },
    { platform: 'Web Reviews', mentions: '149 mentions', score: '68%', change: '-2%', icon: '🌐' },
  ];

  const trendingTopics = [
    { topic: 'Product Quality', mentions: 342, sentiment: 85, trend: 'up' },
    { topic: 'Customer Service', mentions: 289, sentiment: 78, trend: 'up' },
    { topic: 'Shipping Speed', mentions: 234, sentiment: 65, trend: 'down' },
    { topic: 'Pricing', mentions: 187, sentiment: 58, trend: 'down' },
    { topic: 'User Experience', mentions: 156, sentiment: 82, trend: 'up' },
    { topic: 'Product Design', mentions: 134, sentiment: 89, trend: 'up' },
  ];

  const recentMentions = [
    {
      user: '@sarah_jones',
      platform: 'Twitter',
      time: '3 hours ago',
      content: 'Just received my order from @yourstore and I\'m absolutely amazed by the quality! Will definitely order again. #satisfied #quality',
      sentiment: 'positive',
      score: '92% positive',
      engagements: '48 engagements'
    },
    {
      user: 'Mike Chen',
      platform: 'Facebook',
      time: '5 hours ago',
      content: 'Great customer service experience! They resolved my issue within minutes. Highly recommend this store to everyone.',
      sentiment: 'positive',
      score: '88% positive',
      engagements: '23 engagements'
    },
    {
      user: '@fitness_emma',
      platform: 'Instagram',
      time: '6 hours ago',
      content: 'Love the new yoga mat! Perfect grip and cushioning. #yoga #wellness #lifestyle',
      sentiment: 'positive',
      score: '85% positive',
      engagements: '67 engagements'
    },
    {
      user: '@tech_reviewer',
      platform: 'Twitter',
      time: '8 hours ago',
      content: 'The delivery was delayed again. Starting to question the reliability of this service. Expected better.',
      sentiment: 'negative',
      score: '25% negative',
      engagements: '12 engagements'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Sentiment Analysis</h1>
            <p className="text-sm sm:text-base text-gray-600">Monitor brand perception across all channels</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-sm text-gray-600">Last 7 days</span>
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 sm:mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Overall Sentiment</span>
              <Heart className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">78%</div>
            <div className="text-xs sm:text-sm text-green-600">+5.2% positive</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Brand Mentions</span>
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">1,247</div>
            <div className="text-xs sm:text-sm text-green-600">+231% this week</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Engagement Rate</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">4.8%</div>
            <div className="text-xs sm:text-sm text-green-600">+1.2% vs last week</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Crisis Alerts</span>
              <AlertTriangle className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">2</div>
            <div className="text-xs sm:text-sm text-red-600">-3 active</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Sentiment Breakdown */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Sentiment Breakdown</h3>
            <div className="space-y-4">
              {sentimentData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color.replace('bg-', '').replace('-500', '').replace('-400', '') === 'green' ? '#10b981' : item.color.replace('bg-', '').replace('-500', '').replace('-400', '') === 'gray' ? '#6b7280' : item.color.replace('bg-', '').replace('-500', '').replace('-400', '') === 'orange' ? '#f59e0b' : '#ef4444' }}></div>
                  <span className="text-sm text-gray-600 w-20">{item.type}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                    <div 
                      className={`${item.color} h-2 rounded-full`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{item.count}</span>
                    <span className="text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Performance */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Platform Performance</h3>
            <div className="space-y-3 sm:space-y-4">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">{platform.icon}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{platform.platform}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{platform.mentions}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-base sm:text-lg">{platform.score}</div>
                    <div className={`text-xs sm:text-sm ${platform.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {platform.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Trending Topics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm sm:text-base truncate pr-2">{topic.topic}</h4>
                  <TrendingUp className={`w-4 h-4 shrink-0 ${topic.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <div className="text-xl sm:text-2xl font-bold mb-1">{topic.mentions}</div>
                <div className="text-xs sm:text-sm text-gray-600 mb-2">Mentions</div>
                <div className={`text-xs sm:text-sm font-medium ${topic.sentiment >= 70 ? 'text-green-600' : topic.sentiment >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Sentiment: {topic.sentiment}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mentions */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Recent Mentions</h3>
          <div className="space-y-4 sm:space-y-6">
            {recentMentions.map((mention, index) => (
              <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs sm:text-sm font-medium">{mention.user.charAt(1).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-sm sm:text-base">{mention.user}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{mention.platform}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{mention.time}</span>
                  </div>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base">{mention.content}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mention.sentiment === 'positive' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {mention.sentiment === 'positive' ? 'Positive' : 'Negative'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className={`text-xs sm:text-sm font-medium ${
                        mention.sentiment === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mention.score}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">{mention.engagements}</span>
                      <button className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentDashboard;