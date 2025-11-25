"use client";
import React from 'react';
import { Search, TrendingUp, TrendingDown, Eye, AlertCircle, Users, DollarSign, Star, Activity } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  code: string;
  marketShare: number;
  traffic: string;
  rating: number;
  revenue: string;
  growth: string;
  threat: 'high' | 'medium' | 'low';
}

interface PriceComparison {
  category: string;
  yourPrice: string;
  avgCompetitor: string;
  difference: string;
  status: 'good' | 'average' | 'expensive';
}

interface MarketTrend {
  category: string;
  growth: string;
  adoption: string;
  opportunity: 'high' | 'medium' | 'low';
}

interface CompetitiveInsight {
  company: string;
  insight: string;
  impact: 'high' | 'medium' | 'low';
  action: string;
  description: string;
}

const CompetitorAnalysisDashboard = () => {
  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'SportMax Pro',
      code: 'SM',
      marketShare: 16.5,
      traffic: '2.3M',
      rating: 4.2,
      revenue: '$156.99',
      growth: '+12%',
      threat: 'medium'
    },
    {
      id: '2',
      name: 'FitGear Elite',
      code: 'FG',
      marketShare: 15.2,
      traffic: '1.8M',
      rating: 4.1,
      revenue: '$189.99',
      growth: '+8%',
      threat: 'low'
    },
    {
      id: '3',
      name: 'ActiveWear Plus',
      code: 'AW',
      marketShare: 23.6,
      traffic: '3.1M',
      rating: 4.5,
      revenue: '$142.5',
      growth: '+15%',
      threat: 'high'
    },
    {
      id: '4',
      name: 'Peak Performance',
      code: 'PP',
      marketShare: 9.3,
      traffic: '1.2M',
      rating: 4.0,
      revenue: '$201.99',
      growth: '-3%',
      threat: 'low'
    },
    {
      id: '5',
      name: 'Urban Athletes',
      code: 'UA',
      marketShare: 11.2,
      traffic: '1.6M',
      rating: 4.1,
      revenue: '$134.99',
      growth: '+7%',
      threat: 'medium'
    }
  ];

  const priceComparisons: PriceComparison[] = [
    {
      category: 'Running Shoes',
      yourPrice: '$142.99',
      avgCompetitor: '$173.47',
      difference: '-$2.50',
      status: 'good'
    },
    {
      category: 'Wireless Headphones',
      yourPrice: '$89.99',
      avgCompetitor: '$129.24',
      difference: '+$11.25',
      status: 'good'
    },
    {
      category: 'Yoga Mats',
      yourPrice: '$75.99',
      avgCompetitor: '$69.74',
      difference: '+$6.25',
      status: 'average'
    },
    {
      category: 'Water Bottles',
      yourPrice: '$35.99',
      avgCompetitor: '$48.37',
      difference: '-$7.62',
      status: 'expensive'
    },
    {
      category: 'Coffee Beans',
      yourPrice: '$24.99',
      avgCompetitor: '$23.12',
      difference: '+$1.87',
      status: 'good'
    }
  ];

  const marketTrends: MarketTrend[] = [
    {
      category: 'Sustainable Products',
      growth: '+38%',
      adoption: '67%',
      opportunity: 'high'
    },
    {
      category: 'Smart Fitness Tech',
      growth: '+28%',
      adoption: '54%',
      opportunity: 'high'
    },
    {
      category: 'Subscription Models',
      growth: '+15%',
      adoption: '43%',
      opportunity: 'medium'
    },
    {
      category: 'Mobile Shopping',
      growth: '+22%',
      adoption: '78%',
      opportunity: 'medium'
    },
    {
      category: 'Social Commerce',
      growth: '+31%',
      adoption: '35%',
      opportunity: 'high'
    },
    {
      category: 'Personalization',
      growth: '+19%',
      adoption: '62%',
      opportunity: 'medium'
    }
  ];

  const competitiveInsights: CompetitiveInsight[] = [
    {
      company: 'ActiveWear Plus',
      insight: 'Launching aggressive social media campaign with 25% discount',
      impact: 'high',
      action: 'Monitor pricing and consider counter-campaign',
      description: 'Recommended Action'
    },
    {
      company: 'SportMax Pro',
      insight: 'Expanding into yoga and meditation products',
      impact: 'medium',
      action: 'Evaluate our yoga product line competitiveness',
      description: 'Recommended Action'
    },
    {
      company: 'Urban Athletes',
      insight: 'Strong customer retention with loyalty program',
      impact: 'medium',
      action: 'Review and enhance our loyalty program',
      description: 'Recommended Action'
    },
    {
      company: 'FitGear Elite',
      insight: 'Struggling with supply chain delays',
      impact: 'low',
      action: 'Capitalize on inventory availability',
      description: 'Recommended Action'
    }
  ];

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'average': return 'text-yellow-600';
      case 'expensive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return 'bg-green-900 text-white';
      case 'medium': return 'bg-yellow-700 text-white';
      case 'low': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Competitor Analysis</h1>
            <p className="text-sm sm:text-base text-gray-600">Stay ahead with comprehensive market intelligence</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <select className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 sm:px-4 py-2 text-sm">
              <option>Last 30 days</option>
            </select>
            <button className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2 border border-gray-200 rounded-lg px-3 sm:px-4 py-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Alerts</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Tracked Competitors</p>
                <p className="text-xl sm:text-2xl font-bold">12</p>
                <p className="text-green-600 text-xs sm:text-sm">+2 this month</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Market Share</p>
                <p className="text-xl sm:text-2xl font-bold">23.4%</p>
                <p className="text-green-600 text-xs sm:text-sm">+1.8% vs competitors</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Price Advantage</p>
                <p className="text-xl sm:text-2xl font-bold">8.2%</p>
                <p className="text-red-600 text-xs sm:text-sm">-2.1% lower avg</p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Review Score Gap</p>
                <p className="text-xl sm:text-2xl font-bold">+0.3</p>
                <p className="text-green-600 text-xs sm:text-sm">+0.1 vs average</p>
              </div>
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Competitor Overview - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-base sm:text-lg font-semibold">Competitor Overview</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b last:border-b-0 gap-3">
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium shrink-0">
                      {competitor.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">{competitor.name}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                        <span>Share: {competitor.marketShare}%</span>
                        <span>Traffic: {competitor.traffic}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{competitor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ml-11 sm:ml-0">
                    <div className="flex items-center justify-between sm:block sm:text-right">
                      <span className="text-xs sm:hidden text-gray-500">Revenue:</span>
                      <p className="font-medium text-sm sm:text-base">{competitor.revenue}</p>
                      <p className={`text-xs sm:text-sm ${competitor.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {competitor.growth}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getThreatColor(competitor.threat)}`}>
                        {competitor.threat} threat
                      </span>
                      <button className="text-blue-600 text-xs sm:text-sm hover:underline whitespace-nowrap">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Comparison and Market Trends - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Price Comparison */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-base sm:text-lg font-semibold">Price Comparison</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {priceComparisons.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">{item.category}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 gap-1 sm:gap-0">
                        <span>Your Price: {item.yourPrice}</span>
                        <span>Avg Competitor: {item.avgCompetitor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${item.status === 'good' ? 'bg-green-100 text-green-800' : item.status === 'average' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {item.status}
                      </span>
                      <p className={`text-xs sm:text-sm ${getStatusColor(item.status)}`}>
                        {item.difference}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-base sm:text-lg font-semibold">Market Trends</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="py-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <p className="font-medium text-sm sm:text-base">{trend.category}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium self-start ${getOpportunityColor(trend.opportunity)}`}>
                        {trend.opportunity} opportunity
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <div>
                          <span>Growth: </span>
                          <span className="text-green-600 font-medium">{trend.growth}</span>
                        </div>
                        <span>Market Adoption: {trend.adoption}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Competitive Insights - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-base sm:text-lg font-semibold">Latest Competitive Insights</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {competitiveInsights.map((insight, index) => (
                <div key={index} className={`border-l-4 p-3 sm:p-4 rounded-r-lg ${getImpactColor(insight.impact)}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-medium text-sm sm:text-base">{insight.company}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${insight.impact === 'high' ? 'bg-red-100 text-red-800' : insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2">{insight.insight}</p>
                      <div className="text-xs sm:text-sm">
                        <span className="font-medium text-blue-600">{insight.description}:</span>
                        <p className="text-gray-600 mt-1">{insight.action}</p>
                      </div>
                    </div>
                    <button className="self-start sm:ml-4 text-blue-600 text-xs sm:text-sm hover:underline whitespace-nowrap">
                      Take Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorAnalysisDashboard;