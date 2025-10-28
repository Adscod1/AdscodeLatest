"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
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

// API campaign shape (subset)
interface ApiCampaign {
  id: string;
  brandId: string;
  title: string;
  description?: string | null;
  budget: number;
  currency: string;
  duration: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  targets?: any;
  platforms?: any;
  createdAt: string;
  updatedAt: string;
  _count?: { applicants: number };
  brand?: { id: string; name: string; logo?: string | null };
}

// UI campaign row (normalized for display)
interface UICampaignRow {
  id: string;
  title: string;
  type?: string;
  target?: string;
  budget: number;
  currency: string;
  impressions?: number | null;
  clicks?: number | null;
  conversions?: number | null;
  ctr?: string | null;
  cr?: string | null;
  durationLabel: string;
  status: string;
}

const MarketingCampaigns: React.FC = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [apiCampaigns, setApiCampaigns] = useState<ApiCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noStore, setNoStore] = useState(false);

  // Fetch real campaigns for the authenticated brand
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/campaigns', { cache: 'no-store' });
        if (!res.ok) {
          // Handle missing store with a friendlier UI
          if (res.status === 404) {
            try {
              const j = await res.json();
              if (j?.error && String(j.error).toLowerCase().includes('store not found')) {
                if (active) {
                  setNoStore(true);
                  setApiCampaigns([]);
                  setError(null);
                }
                return;
              }
            } catch {}
          }
          const txt = await res.text();
          throw new Error(`Failed to fetch campaigns (${res.status}): ${txt}`);
        }
        const data = await res.json();
        const campaigns: ApiCampaign[] = data?.campaigns ?? data?.data ?? [];
        if (active) setApiCampaigns(Array.isArray(campaigns) ? campaigns : []);
      } catch (e: any) {
        console.error('Error loading campaigns:', e);
        if (active) setError(e?.message || 'Failed to load campaigns');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false };
  }, []);

  // Normalize API data into UI rows and filter by current store when possible
  const campaigns: UICampaignRow[] = useMemo(() => {
    const rows = apiCampaigns.map((c) => {
      // Try to derive impressions from targets (Reach) if present
      let impressions: number | null = null;
      try {
        const t = Array.isArray(c.targets) ? c.targets : [];
        const reach = t.find((x: any) => (x?.metric || '').toLowerCase() === 'reach');
        if (reach && reach.value) {
          const n = parseInt(String(reach.value).replace(/[^0-9]/g, ''));
          if (!isNaN(n)) impressions = n;
        }
      } catch {}

      const durationLabel = c.duration != null ? `${c.duration} days` : '-';
      // Map statuses to labels used in UI (keep API ones too)
      const statusMap: Record<string, string> = {
        PUBLISHED: 'Active',
        ACTIVE: 'Active',
        COMPLETED: 'Completed',
        PAUSED: 'Paused',
        CANCELLED: 'Cancelled',
        DRAFT: 'Draft',
      };
      const status = statusMap[c.status] || c.status;

      return {
        id: c.id,
        title: c.title,
        type: (Array.isArray(c.platforms) && c.platforms[0]) || 'Campaign',
        target: undefined,
        budget: c.budget,
        currency: c.currency,
        impressions,
        clicks: null,
        conversions: (c as any).conversions ?? null,
        ctr: null,
        cr: null,
        durationLabel,
        status,
      } as UICampaignRow;
    });

    // Filter by current store if any row matches; otherwise show all
    const forStore = apiCampaigns.filter(c => c.brandId === storeId);
    if (forStore.length > 0) {
      const setIds = new Set(forStore.map(c => c.id));
      return rows.filter(r => setIds.has(r.id));
    }
    return rows;
  }, [apiCampaigns, storeId]);

  const stats = {
    totalBudget: 18500,
    budgetSpent: 12500,
    activeCampaigns: 2,
    totalConversions: 945,
    conversionIncrease: 16,
    avgRoas: 3.2
  };

  const budgetAllocation = [
    { type: 'Email', amount: 5500, color: 'bg-blue-500' },
    { type: 'Social', amount: 8000, color: 'bg-green-500' },
    { type: 'Search', amount: 3000, color: 'bg-yellow-500' },
    { type: 'Display', amount: 2000, color: 'bg-purple-500' }
  ];

  const topPerforming = [
    { name: 'Nike Air Max Promotion', conversions: 420, cr: '8.08%' },
    { name: 'Summer Sneaker Sale', conversions: 285, cr: '8.14%' },
    { name: 'Holiday Collection', conversions: 145, cr: '6.90%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency?: string) => {
    const code = (currency || 'USD').split(' ')[0].replace(/[^A-Z]/g, '') || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code as any,
        minimumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency || 'USD'} ${formatNumber(amount)}`;
    }
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
          {noStore ? (
            <Link href="/new" className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">Create Store</span>
            </Link>
          ) : (
            <Link href={`/${storeId}/createCampaign`} className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">Create Campaign</span>
            </Link>
          )}
        </div>

        {noStore && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 mb-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <StoreIcon />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">You don’t have a store yet</h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600">Create your store to start publishing campaigns, tracking performance, and collaborating with creators.</p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/new" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" /> Create Store
                </Link>
                <Link href="/" className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Total Budget</span>
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</div>
            <div className="text-xs sm:text-sm text-gray-500">{formatCurrency(stats.budgetSpent)} spent (68%)</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Active Campaigns</span>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeCampaigns}</div>
            <div className="text-xs sm:text-sm text-gray-500">2 running campaigns</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Total Conversions</span>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{formatNumber(stats.totalConversions)}</div>
            <div className="text-xs sm:text-sm text-green-600">+{stats.conversionIncrease}% from last month</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Avg. ROAS</span>
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.avgRoas}x</div>
            <div className="text-xs sm:text-sm text-gray-500">Return on ad spend</div>
          </div>
        </div>

  {/* Dashboard Cards */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Campaign Performance */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Campaign Performance</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">This Week</span>
                <span className="font-semibold text-sm sm:text-base">72 conversions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Revenue</span>
                <span className="font-semibold text-sm sm:text-base">{formatCurrency(8640)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Spend</span>
                <span className="font-semibold text-sm sm:text-base">{formatCurrency(2500)}</span>
              </div>
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Budget Allocation</h3>
            <div className="space-y-3">
              {budgetAllocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.color}`}></div>
                    <span className="text-gray-700 text-sm sm:text-base truncate">{item.type}</span>
                  </div>
                  <span className="font-semibold text-sm sm:text-base flex-shrink-0 ml-2">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Top Performing</h3>
            <div className="space-y-3">
              {topPerforming.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="font-medium text-xs sm:text-sm truncate">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.conversions} conversions • {item.cr} CR</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          {error && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}
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
                <option>Completed</option>
                <option>Paused</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
              >
                <option>All Types</option>
                <option>Email</option>
                <option>Social</option>
                <option>Search</option>
                <option>Display</option>
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
                  <tr className="border-b border-gray-100">
                    <td className="py-6 px-4 text-sm text-gray-500" colSpan={8}>Loading campaigns…</td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr className="border-b border-gray-100">
                    <td className="py-6 px-4 text-sm text-gray-500" colSpan={8}>No campaigns found.</td>
                  </tr>
                ) : campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{campaign.title}</div>
                        <div className="text-sm text-gray-500">{campaign.type || 'Campaign'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{formatCurrency(campaign.budget, campaign.currency)}</div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{campaign.impressions != null ? formatNumber(campaign.impressions) : '-'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{campaign.clicks != null ? formatNumber(campaign.clicks) : '-'}</div>
                      <div className="text-sm text-gray-500">{campaign.ctr ?? '-'}{campaign.ctr ? ' CTR' : ''}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{campaign.conversions != null ? campaign.conversions : '-'}</div>
                      <div className="text-sm text-gray-500">{campaign.cr ?? '-'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">{campaign.durationLabel}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
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
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm text-gray-500">Loading campaigns…</div>
            ) : campaigns.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm text-gray-500">No campaigns found.</div>
            ) : campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">{campaign.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{campaign.type || 'Campaign'}</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
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
                    <p className="font-semibold text-sm">{formatCurrency(campaign.budget, campaign.currency)}</p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                      <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conversions</p>
                    <p className="font-semibold text-sm">{campaign.conversions != null ? campaign.conversions : '-'}</p>
                    <p className="text-xs text-gray-500">{campaign.cr ?? '-'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Impressions</p>
                    <p className="font-semibold text-sm">{campaign.impressions != null ? formatNumber(campaign.impressions) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Clicks</p>
                    <p className="font-semibold text-sm">{campaign.clicks != null ? formatNumber(campaign.clicks) : '-'}</p>
                    <p className="text-xs text-gray-500">{campaign.ctr ?? '-'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-xs sm:text-sm text-gray-700">{campaign.durationLabel}</p>
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

// Simple store icon to avoid extra imports
const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-600">
    <path d="M4 7l2-3h12l2 3M4 7h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);