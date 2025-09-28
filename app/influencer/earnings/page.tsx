"use client";

import React, { useState } from 'react';

import InfluencerSidebar from '@/components/ui/influencersidebar';
import { 
  Home,
  TrendingUp,
  Clock,
  Wallet,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Building2,
  Bitcoin,
  AlertTriangle
} from 'lucide-react';

interface EarningStats {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  color: string;
}

interface EarningOpportunity {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: 'available' | 'locked' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface WithdrawalMethod {
  id: string;
  name: string;
  provider: string;
  fee: string;
  processing: string;
  minAmount: string;
  icon: React.ComponentType<any>;
  status: 'available' | 'coming_soon';
}

interface EarningTip {
  id: string;
  title: string;
  description: string;
  amount: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface InfluencerData {
  id: string;
  firstName: string;
  lastName: string;
  primaryNiche: string;
  secondaryNiches: string[];
  bio: string | null;
  status: string;
  socialAccounts: any[];
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
}

// For page routes, we can't rely on props being passed
// so we'll use default values for the sidebar
const Earnings = () => {
  // Default values for the sidebar until we implement data fetching
  const defaultInfluencer = {
    firstName: "Alex",
    lastName: "Chen",
    status: "PENDING"
  };
  const [activeTab, setActiveTab] = useState<'opportunities' | 'history' | 'withdraw' | 'tips'>('opportunities');
  
  const earningStats: EarningStats[] = [
    {
      icon: DollarSign,
      label: 'Total Earned (UGX)',
      value: '0',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      label: 'Pending (UGX)',
      value: '0',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'This Month (UGX)',
      value: '0',
      color: 'text-purple-600'
    },
    {
      icon: Wallet,
      label: 'Available (UGX)',
      value: '0',
      color: 'text-orange-600'
    }
  ];

  const earningOpportunities: EarningOpportunity[] = [
    {
      id: '1',
      title: 'Complete Training Modules',
      description: 'Upon completion',
      amount: '5,000 UGX',
      status: 'available',
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'First Campaign Completion',
      description: 'After first campaign',
      amount: '15,000 UGX',
      status: 'locked',
      difficulty: 'medium'
    }
  ];

  const withdrawalMethods: WithdrawalMethod[] = [
    {
      id: 'mobile',
      name: 'Mobile Money',
      provider: 'MTN/Airtel',
      fee: '2%',
      processing: 'instant',
      minAmount: '10,000 UGX',
      icon: Smartphone,
      status: 'available'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      provider: 'Local Banks',
      fee: '5,000 UGX',
      processing: '1-3 business days',
      minAmount: '50,000 UGX',
      icon: Building2,
      status: 'available'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      provider: 'USDT/USDC',
      fee: '1%',
      processing: '10-30 minutes',
      minAmount: '20,000 UGX',
      icon: Bitcoin,
      status: 'coming_soon'
    }
  ];

  const earningTips: EarningTip[] = [
    {
      id: '1',
      title: 'Complete Your Training',
      description: 'Finish all academy modules to unlock earning opportunities',
      amount: '5,000 UGX',
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Write Quality Reviews',
      description: 'Each approved review earns you bonus points and money',
      amount: '2,000 UGX per review',
      difficulty: 'Easy'
    },
    {
      id: '3',
      title: 'Apply to Entry Campaigns',
      description: 'Complete your first brand campaign successfully',
      amount: '15,000 - 50,000 UGX',
      difficulty: 'Medium'
    },
    {
      id: '4',
      title: 'Become Verified Influencer',
      description: 'Reach verified status to access premium campaigns',
      amount: '100,000+ UGX per campaign',
      difficulty: 'Hard'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <InfluencerSidebar 
        firstName={defaultInfluencer.firstName}
        lastName={defaultInfluencer.lastName}
        status={defaultInfluencer.status}
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
              <span className="text-gray-900">Earnings</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
            <p className="text-gray-600">Track your campaign earnings and manage payouts</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {earningStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                <div className="flex justify-center mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stat.color === 'text-green-600' ? 'bg-green-100' :
                    stat.color === 'text-blue-600' ? 'bg-blue-100' :
                    stat.color === 'text-purple-600' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit m-auto">
            {[
              { key: 'opportunities', label: 'Earning Opportunities' },
              { key: 'history', label: 'Payment History' },
              { key: 'withdraw', label: 'Withdraw' },
              { key: 'tips', label: 'Earning Tips' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'opportunities' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Earning Opportunities</h2>
              <div className="space-y-4">
                {earningOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white rounded-lg p-6 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {opportunity.status === 'available' ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                        <p className="text-sm text-gray-600">{opportunity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{opportunity.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(opportunity.status)}`}>
                          {opportunity.status === 'available' ? 'Available' : 'Locked'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Payment History</h2>
              <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment History Yet</h3>
                <p className="text-gray-600 mb-6">Your completed campaign payments will appear here</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Start First Campaign
                </button>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Withdrawal Methods</h2>
              <div className="space-y-6">
                {withdrawalMethods.map((method) => (
                  <div key={method.id} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <method.icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.provider}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        method.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {method.status === 'available' ? 'Available' : 'Coming Soon'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Fee: </span>
                        <span className="font-medium">{method.fee}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Processing: </span>
                        <span className="font-medium">{method.processing}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Min Amount: </span>
                        <span className="font-medium">{method.minAmount}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Withdrawal Requirements */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Withdrawal Requirements</h4>
                    <p className="text-sm text-yellow-700">Complete at least one campaign and reach the minimum withdrawal amount to access payout options.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">How to Maximize Your Earnings</h2>
              <div className="space-y-6">
                {earningTips.map((tip) => (
                  <div key={tip.id} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                            {tip.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
                        <p className="text-green-600 font-semibold">{tip.amount}</p>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 ml-4">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;