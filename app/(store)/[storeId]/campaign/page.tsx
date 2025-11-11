"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  MessageSquare,
  Eye,
  MousePointer,
  Calendar,
  Edit,
  Pause,
  PlayCircle,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { getCampaigns } from '@/actions/campaign';

interface Campaign {
  id: string;
  title: string;
  type: string;
  budget: number;
  duration?: number;
  status: string;
  createdAt: Date;
  _count?: {
    applicants: number;
  };
}

const MarketingCampaigns: React.FC = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const result = await getCampaigns();
        if (result.success && result.campaigns) {
          // Deduplicate campaigns by ID
          const uniqueCampaigns = Array.from(
            new Map(result.campaigns.map(c => [c.id, c])).values()
          );
          setCampaigns(uniqueCampaigns);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Calculate stats from real campaigns
  const stats = {
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    budgetSpent: 0, // TODO: Calculate from campaign analytics
    activeCampaigns: campaigns.filter(c => c.status === 'PUBLISHED').length,
    totalConversions: 0, // TODO: Calculate from campaign analytics
    conversionIncrease: 0,
    avgRoas: 0
  };

  // Filter campaigns based on search and filters
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || 
      (statusFilter === 'Active' && campaign.status === 'PUBLISHED') ||
      (statusFilter === 'Paused' && campaign.status === 'DRAFT') ||
      campaign.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || campaign.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAUSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Active';
      case 'DRAFT':
        return 'Draft';
      case 'COMPLETED':
        return 'Completed';
      case 'PAUSED':
        return 'Paused';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
     

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">Marketing Campaigns</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage your marketing campaigns</p>
          </div>
          <Link href={`/${storeId}/createCampaign`} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 hover:text-gray-800 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Create Campaign</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Total Budget</span>
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</div>
            <div className="text-xs sm:text-sm text-gray-500">Across {campaigns.length} campaigns</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Active Campaigns</span>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeCampaigns}</div>
            <div className="text-xs sm:text-sm text-gray-500">{stats.activeCampaigns} published</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Draft Campaigns</span>
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'DRAFT').length}</div>
            <div className="text-xs sm:text-sm text-gray-500">Ready to publish</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Total Applicants</span>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {campaigns.reduce((sum, c) => sum + (c._count?.applicants || 0), 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Influencer applications</div>
          </div>
        </div>

        {/* Dashboard Cards - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Campaign Types Breakdown */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Campaign Types</h3>
            <div className="space-y-3">
              {['PRODUCT', 'COUPON', 'VIDEO', 'PROFILE'].map((type) => {
                const count = campaigns.filter(c => c.type === type).length;
                const totalBudget = campaigns
                  .filter(c => c.type === type)
                  .reduce((sum, c) => sum + c.budget, 0);
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        type === 'PRODUCT' ? 'bg-blue-500' :
                        type === 'COUPON' ? 'bg-green-500' :
                        type === 'VIDEO' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}></div>
                      <span className="text-gray-700 text-sm sm:text-base truncate">{type}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-semibold text-sm sm:text-base">{count}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(totalBudget)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Campaigns</h3>
            <div className="space-y-3">
              {campaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="font-medium text-xs sm:text-sm truncate">{campaign.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{campaign.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No campaigns yet. Create your first campaign!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-64 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Completed</option>
                <option>Paused</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
              >
                <option>All Types</option>
                <option>PRODUCT</option>
                <option>COUPON</option>
                <option>VIDEO</option>
                <option>PROFILE</option>
              </select>
            </div>
          </div>

          {/* Campaigns Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Budget</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Impressions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Clicks</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Conversions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Loading campaigns...
                    </td>
                  </tr>
                ) : filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No campaigns found. Create your first campaign!
                    </td>
                  </tr>
                ) : filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{campaign.title}</div>
                        <div className="text-sm text-gray-500">{campaign.type}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{formatCurrency(campaign.budget)}</div>
                      <div className="text-xs text-gray-500 mt-1">{campaign._count?.applicants || 0} applicants</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">-</div>
                      <div className="text-xs text-gray-500">Not tracked</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">-</div>
                      <div className="text-xs text-gray-500">Not tracked</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">-</div>
                      <div className="text-xs text-gray-500">Not tracked</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">{campaign.duration ? `${campaign.duration} days` : 'Ongoing'}</div>
                      <div className="text-xs text-gray-500">{new Date(campaign.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === campaign.id ? null : campaign.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {openDropdown === campaign.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <Link
                                href={`/${storeId}/campaign/${campaign.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <Eye className="w-4 h-4 text-purple-500" />
                                View Details
                              </Link>
                              <Link
                                href={`/${storeId}/campaign/${campaign.id}/influencers/performance`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <UserCheck className="w-4 h-4 text-indigo-500" />
                                Influencer Performance
                              </Link>
                              <Link
                                href={`/${storeId}/campaign/${campaign.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <Edit className="w-4 h-4 text-blue-500" />
                                Edit
                              </Link>
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {campaign.status === 'Active' ? (
                                  <>
                                    <Pause className="w-4 h-4 text-yellow-500" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="w-4 h-4 text-green-500" />
                                    Activate
                                  </>
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Campaigns Cards - Mobile */}
          <div className="lg:hidden space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading campaigns...
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No campaigns found. Create your first campaign!
              </div>
            ) : filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">{campaign.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{campaign.type}</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusLabel(campaign.status)}
                    </span>
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === `mobile-${campaign.id}` ? null : `mobile-${campaign.id}`)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {openDropdown === `mobile-${campaign.id}` && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenDropdown(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <Link
                              href={`/${storeId}/campaign/${campaign.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Eye className="w-4 h-4 text-purple-500" />
                              View Details
                            </Link>
                            <Link
                              href={`/${storeId}/campaign/${campaign.id}/influencers/performance`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <UserCheck className="w-4 h-4 text-indigo-500" />
                              Influencer Performance
                            </Link>
                            <Link
                              href={`/${storeId}/campaign/${campaign.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Edit className="w-4 h-4 text-blue-500" />
                              Edit
                            </Link>
                            <button
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {campaign.status === 'Active' ? (
                                <>
                                  <Pause className="w-4 h-4 text-yellow-500" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-4 h-4 text-green-500" />
                                  Activate
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-semibold text-sm">{formatCurrency(campaign.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Applicants</p>
                    <p className="font-semibold text-sm">{campaign._count?.applicants || 0}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-sm">{campaign.duration ? `${campaign.duration} days` : 'Ongoing'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-semibold text-sm">{new Date(campaign.createdAt).toLocaleDateString()}</p>
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

export default MarketingCampaigns;