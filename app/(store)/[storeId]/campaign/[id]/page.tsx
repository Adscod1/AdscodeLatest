"use client";
import React, { useState } from 'react';
import { ArrowLeft, Play, Share2, Edit, Trash2, DollarSign, Users, Eye, MousePointer, Clock, TrendingUp, Zap } from 'lucide-react';

export default function CampaignDetailPage() {
  const [activeTab, setActiveTab] = useState('Metrics');

  const stats = [
    { label: 'Total Revenue', value: '$28,500', change: '+12.5%', icon: DollarSign, color: 'purple' },
    { label: 'Conversions', value: '285', change: '+8.4%', icon: Users, color: 'green' },
    { label: 'Impressions', value: '125,000', change: '+15.2%', icon: Eye, color: 'blue' },
    { label: 'Clicks', value: '3,500', change: '+10.1%', icon: MousePointer, color: 'orange' }
  ];

  const timelineEvents = [
    { title: 'Campaign Launched', date: '2024-01-01', icon: Play, color: 'purple' },
    { title: 'First 1000 clicks reached', date: '2024-01-05', icon: MousePointer, color: 'green' },
    { title: 'Budget increased by $1000', date: '2024-01-10', icon: DollarSign, color: 'gray' },
    { title: '100 conversions achieved', date: '2024-01-15', icon: Users, color: 'green' },
    { title: 'Ad creative refreshed', date: '2024-01-20', icon: Edit, color: 'gray' }
  ];

  const adSets = [
    { name: 'Morning Rush', conversions: 95, budget: '$980 / $1500', spent: 65, status: 'Active' },
    { name: 'Lunch Break', conversions: 120, budget: '$1320 / $2000', spent: 66, status: 'Active' },
    { name: 'Evening Wind Down', conversions: 70, budget: '$900 / $1500', spent: 60, status: 'Paused' }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Summer Sneaker Sale</h1>
              <p className="text-sm text-gray-500">Email Campaign • Target: Sports Enthusiasts</p>
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
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>2024-01-01 - 2024-01-31</span>
            </div>
            <span className="text-sm text-gray-500">Campaign ID: 1</span>
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
                    Promote our summer collection of premium sports shoes with exclusive discounts for early bird customers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Objectives</h3>
                    <ul className="space-y-1">
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        Increase brand awareness
                      </li>
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        Drive sales
                      </li>
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        Build email list
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Email</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Social Media</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Google Ads</span>
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
                  {['Metrics', 'Demographics', 'Ad Sets'].map((tab) => (
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
                        <div className="text-xs text-gray-500 mb-1">CTR (Click-Through Rate)</div>
                        <div className="text-2xl font-bold text-gray-900">2.8%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">CPC (Cost Per Click)</div>
                        <div className="text-2xl font-bold text-gray-900">$0.01</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">CPA (Cost Per Acquisition)</div>
                        <div className="text-2xl font-bold text-gray-900">$11.23</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Engagement Rate</div>
                        <div className="text-2xl font-bold text-gray-900">5.4%</div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">ROAS (Return on Ad Spend)</span>
                          <span className="text-sm font-semibold text-green-600">8.5x</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
                          <span className="text-sm font-semibold text-gray-900">32.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '32.5%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Demographics' && (
                  <div className="space-y-6">
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
                  </div>
                )}

                {activeTab === 'Ad Sets' && (
                  <div className="space-y-4">
                    {adSets.map((adSet, idx) => (
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
                    ))}
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
                  <span className="text-sm font-semibold text-gray-900">$5,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="text-sm font-semibold text-red-600">$3,200</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="text-sm font-semibold text-green-600">$1,800</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                    <span className="text-sm font-semibold text-gray-900">64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-purple-900">Pacing: On Track</div>
                      <div className="text-xs text-purple-700 mt-0.5">Your spend is aligned with campaign duration</div>
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
                    <span className="text-xs font-medium">Days Active</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">20 days</div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Reach</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">84,500</div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-medium">Engagement</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">6,750</div>
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
      </div>
    </div>
  );
}