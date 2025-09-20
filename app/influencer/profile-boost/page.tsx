"use client";

import React, { useState } from 'react';
import InfluencerSidebar from '@/components/ui/influencersidebar';
import { 
  Home,
  TrendingUp,
  Crown,
  Rocket,
  Search,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface BoostOption {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
  popular?: boolean;
}

interface OptimizationTip {
  id: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact';
  completed: boolean;
}

const ProfileBoost = () => {
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null);
  
  const stats = [
    {
      label: 'Total Profile Views',
      value: '1,250',
      change: '+16%',
      positive: true
    },
    {
      label: 'Campaign Applications',
      value: '3',
      change: '+50%',
      positive: true
    },
    {
      label: 'Brand Interactions',
      value: '8',
      change: '+25%',
      positive: true
    },
    {
      label: 'Profile Completeness',
      value: '85%',
      change: '+5%',
      positive: true
    }
  ];

  const boostOptions: BoostOption[] = [
    {
      id: 'spotlight',
      name: 'Profile Spotlight',
      description: 'Get featured in search results and increase your profile visibility',
      price: '25,000 UGX',
      duration: 'for 7 days',
      features: [
        '2x profile views',
        'Priority in search results',
        'Featured badge on profile',
        'Higher application response rate'
      ],
      icon: Search,
      color: 'blue'
    },
    {
      id: 'super',
      name: 'Super Boost',
      description: 'Maximum visibility with premium placement and analytics',
      price: '45,000 UGX',
      duration: 'for 14 days',
      features: [
        '5x profile views',
        'Top search placement',
        'Premium featured badge',
        'Advanced analytics',
        'Priority brand matching',
        'Campaign recommendation priority'
      ],
      icon: Crown,
      color: 'purple',
      popular: true
    },
    {
      id: 'campaign',
      name: 'Campaign Rush',
      description: 'Quick boost for applying to time-sensitive campaigns',
      price: '15,000 UGX',
      duration: 'for 3 days',
      features: [
        'Campaign application priority',
        'Fast-track review process',
        'Rush badge on applications',
        'Higher response rate'
      ],
      icon: Rocket,
      color: 'orange'
    }
  ];

  const optimizationTips: OptimizationTip[] = [
    {
      id: '1',
      title: 'Complete Your Profile',
      description: 'Add a professional photo and complete all profile sections',
      impact: 'High Impact',
      completed: false
    },
    {
      id: '2',
      title: 'Write Quality Reviews',
      description: 'Focus on detailed, helpful reviews that brands value',
      impact: 'High Impact',
      completed: false
    },
    {
      id: '3',
      title: 'Engage with Community',
      description: 'Participate in discussions and help other influencers',
      impact: 'Medium Impact',
      completed: false
    },
    {
      id: '4',
      title: 'Update Social Links',
      description: 'Keep your social media links current and active',
      impact: 'Medium Impact',
      completed: false
    }
  ];

  const worksBenefits = [
    {
      title: 'Increased Visibility',
      description: 'Your profile appears higher in brand searches and gets priority placement in campaign matches.'
    },
    {
      title: 'Better Response Rates',
      description: 'Brands are more likely to view and respond to boosted profiles, increasing your campaign opportunities.'
    },
    {
      title: 'Analytics Insights',
      description: 'Track your boost performance with detailed analytics on views, applications, and brand interactions.'
    }
  ];

  const getBoostColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
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
      <div className="flex-1 p-8 w-full">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
              <span>/</span>
              <span className="text-gray-900">Profile Boost</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Boost</h1>
            <p className="text-gray-600">Increase your visibility and get more campaign opportunities</p>
          </div>

          {/* No Active Boost Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">No Active Boost</h2>
                  <p className="text-gray-600">Boost your profile to get more visibility</p>
                </div>
              </div>
              <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Get Started
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Boost Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Boost Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {boostOptions.map((option) => (
                <div key={option.id} className="relative bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${getBoostColor(option.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{option.price}</div>
                      <div className="text-sm text-gray-500">{option.duration}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      option.popular 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {option.id === 'super' ? 'Choose Super Boost' : `Choose ${option.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Free Optimization Tips */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Free Optimization Tips</h2>
            </div>
            <div className="space-y-4">
              {optimizationTips.map((tip) => (
                <div key={tip.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {tip.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{tip.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tip.impact === 'High Impact' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tip.impact}
                      </span>
                      {!tip.completed && (
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                          Complete This
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How Profile Boost Works */}
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How Profile Boost Works</h2>
            <div className="space-y-6">
              {worksBenefits.map((benefit, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBoost;