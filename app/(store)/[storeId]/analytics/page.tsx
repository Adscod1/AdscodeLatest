"use client";
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Eye,
  Clock,
  Zap,
  DollarSign,
  Target,
  UserCheck,
  Share2,
  Mail,
  Search,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Calendar,
  Activity
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

interface ProgressBarProps {
  label: string;
  percentage: number;
  value: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, icon }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-xs sm:text-sm font-medium">{title}</span>
      <div className="text-gray-400">{icon}</div>
    </div>
    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className={`text-xs sm:text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
      <span className="truncate">{change}</span>
    </div>
  </div>
);

const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage, value, color = 'bg-gray-900' }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-900">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    <div className="text-xs text-gray-500 mt-1">{value}</div>
  </div>
);



export default function AnalyticsDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
     
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your store's performance and insights</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto">
              <option>Last 30 days</option>
            </select>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto">
              Export
            </button>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            title="Revenue"
            value="$45,231"
            change="+20.1% vs last month"
            isPositive={true}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            title="Visitors"
            value="2,350"
            change="+2.5% this month"
            isPositive={true}
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            title="Conversion Rate"
            value="3.2%"
            change="+0.4% vs last month"
            isPositive={true}
            icon={<Target className="w-5 h-5" />}
          />
          <MetricCard
            title="Avg. Order Value"
            value="$127"
            change="-2.1% vs last month"
            isPositive={false}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            title="Page Views"
            value="18,420"
            change="+15.3% this month"
            isPositive={true}
            icon={<Eye className="w-5 h-5" />}
          />
          <MetricCard
            title="Session Duration"
            value="4m 32s"
            change="+8.7% avg per session"
            isPositive={true}
            icon={<Clock className="w-5 h-5" />}
          />
          <MetricCard
            title="Bounce Rate"
            value="32.4%"
            change="-5.2% vs last month"
            isPositive={true}
            icon={<Zap className="w-5 h-5" />}
          />
          <MetricCard
            title="Customer Lifetime Value"
            value="$342"
            change="+19.9% average"
            isPositive={true}
            icon={<UserCheck className="w-5 h-5" />}
          />
        </div>

        {/* Engagement and Revenue Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">8,420</div>
                <div className="text-xs sm:text-sm text-gray-600">Likes</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1">+12.5%</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">1,250</div>
                <div className="text-xs sm:text-sm text-gray-600">Shares</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1">+8.3%</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">432</div>
                <div className="text-xs sm:text-sm text-gray-600">Comments</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1">+16.7%</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">2.8%</div>
                <div className="text-xs sm:text-sm text-gray-600">Click-through Rate</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1">+9.5%</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Revenue Metrics</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">$28,450</div>
                <div className="text-xs sm:text-sm text-gray-600">Monthly Recurring Revenue</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1">+22.1%</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">$341,400</div>
                <div className="text-xs sm:text-sm text-gray-600">Annual Recurring Revenue</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1">+19.8%</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">$45</div>
                <div className="text-xs sm:text-sm text-gray-600">Customer Acquisition Cost</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1">-8.3%</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">3.2%</div>
                <div className="text-xs sm:text-sm text-gray-600">Churn Rate</div>
                <div className="text-xs sm:text-sm text-red-600 mt-1">-1.1%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">2s</div>
              <div className="text-xs sm:text-sm text-gray-600">Load Time</div>
              <div className="text-xs text-green-600 mt-1">-0.5s</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">99.98%</div>
              <div className="text-xs sm:text-sm text-gray-600">Uptime</div>
              <div className="text-xs text-green-600 mt-1">+0.05%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">0.02%</div>
              <div className="text-xs sm:text-sm text-gray-600">Error Rate</div>
              <div className="text-xs text-green-600 mt-1">-0.01%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">245ms</div>
              <div className="text-xs sm:text-sm text-gray-600">API Response Time</div>
              <div className="text-xs text-green-600 mt-1">-5ms</div>
            </div>
          </div>
        </div>

        {/* Traffic Sources and Device Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Traffic Sources</h3>
            <div className="space-y-4">
              <ProgressBar label="Organic Search" percentage={45} value="1,058 visitors" />
              <ProgressBar label="Direct" percentage={30} value="705 visitors" />
              <ProgressBar label="Social Media" percentage={15} value="353 visitors" />
              <ProgressBar label="Email" percentage={10} value="235 visitors" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Device Breakdown</h3>
            <div className="space-y-4">
              <ProgressBar label="Desktop" percentage={65} value="" />
              <ProgressBar label="Mobile" percentage={30} value="" />
              <ProgressBar label="Tablet" percentage={5} value="" />
            </div>
          </div>
        </div>

        {/* Customer Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Customer Type</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">New Customers</span>
                <span className="text-sm font-bold">35%</span>
              </div>
              <div className="text-xs text-gray-500">1,250 <span className="text-green-600">+43%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Returning Customers</span>
                <span className="text-sm font-bold">51%</span>
              </div>
              <div className="text-xs text-gray-500">1,820 <span className="text-green-600">+8%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">VIP Customers</span>
                <span className="text-sm font-bold">8%</span>
              </div>
              <div className="text-xs text-gray-500">135 <span className="text-green-600">+12%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">At-Risk Customers</span>
                <span className="text-sm font-bold">6%</span>
              </div>
              <div className="text-xs text-gray-500">205 <span className="text-red-600">-5%</span></div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Geographic Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">North America</span>
                <span className="text-sm font-bold">43%</span>
              </div>
              <div className="text-xs text-gray-500">1,540 <span className="text-green-600">+8%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Europe</span>
                <span className="text-sm font-bold">35%</span>
              </div>
              <div className="text-xs text-gray-500">1,258 <span className="text-green-600">+5%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Asia Pacific</span>
                <span className="text-sm font-bold">16%</span>
              </div>
              <div className="text-xs text-gray-500">580 <span className="text-green-600">+22%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Other Regions</span>
                <span className="text-sm font-bold">6%</span>
              </div>
              <div className="text-xs text-gray-500">220 <span className="text-green-600">+5%</span></div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Gender Demographics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Female</span>
                <span className="text-sm font-bold">61%</span>
              </div>
              <div className="text-xs text-gray-500">2,180 <span className="text-green-600">+10%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Male</span>
                <span className="text-sm font-bold">37%</span>
              </div>
              <div className="text-xs text-gray-500">1,325 <span className="text-green-600">+5%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Other/Undisclosed</span>
                <span className="text-sm font-bold">2%</span>
              </div>
              <div className="text-xs text-gray-500">68 <span className="text-green-600">+8%</span></div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Account Quality</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Verified Accounts</span>
                <span className="text-sm font-bold">89%</span>
              </div>
              <div className="text-xs text-gray-500">3,200 <span className="text-green-600">+6%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Mass Followers</span>
                <span className="text-sm font-bold">5%</span>
              </div>
              <div className="text-xs text-gray-500">180 <span className="text-red-600">-8%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Suspicious Activity</span>
                <span className="text-sm font-bold">4%</span>
              </div>
              <div className="text-xs text-gray-500">145 <span className="text-green-600">+2%</span></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Bot Accounts</span>
                <span className="text-sm font-bold">2%</span>
              </div>
              <div className="text-xs text-gray-500">70 <span className="text-red-600">-3%</span></div>
            </div>
          </div>
        </div>

        {/* Customer Journey Funnel */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Customer Journey Funnel</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Awareness</div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-gray-900 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{width: '100%'}}>
                    10,000
                  </div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">25% conversion</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Interest</div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-gray-900 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{width: '70%'}}>
                    2,500
                  </div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">40% conversion</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Consideration</div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-gray-900 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{width: '45%'}}>
                    1,000
                  </div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">60% conversion</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Purchase</div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-gray-900 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{width: '30%'}}>
                    600
                  </div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">85% conversion</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Retention</div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-gray-900 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{width: '25%'}}>
                    510
                  </div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">75% conversion</div>
            </div>
          </div>
        </div>

        {/* Sales Performance and Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Sales Performance</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Sales Target</span>
                  <span className="text-sm font-bold">$50,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{width: '90%'}}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">$45,231 of $50,000 target reached</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Customer Acquisition</span>
                  <span className="text-sm font-bold">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{width: '88%'}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Customer Retention</span>
                  <span className="text-sm font-bold">76%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{width: '76%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-900 mb-1">Revenue Growth</div>
                <div className="text-xs text-green-700">20% increase compared to last month</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">Top Product Category</div>
                <div className="text-xs text-blue-700">Running shoes account for 35% of sales</div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-900 mb-1">Mobile Traffic</div>
                <div className="text-xs text-orange-700">70% of traffic uses mobile devices</div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-900 mb-1">Customer Satisfaction</div>
                <div className="text-xs text-purple-700">Average rating improved to 4.8/5 stars</div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-900 mb-1">Peak Performance</div>
                <div className="text-xs text-yellow-700">Best traffic volume occurred at 2PM weekdays</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Activity and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Hourly Activity</h3>
            <div className="space-y-3">
              {[
                { time: '12:00 PM', visitors: '248 visitors', revenue: '$1,250' },
                { time: '1:00 PM', visitors: '320 visitors', revenue: '$1,680' },
                { time: '2:00 PM', visitors: '185 visitors', revenue: '$980' },
                { time: '3:00 PM', visitors: '275 visitors', revenue: '$1,420' },
                { time: '4:00 PM', visitors: '190 visitors', revenue: '$890' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.time}</div>
                    <div className="text-xs text-gray-500">{item.visitors}</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">{item.revenue}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Top Products</h3>
            <div className="space-y-4">
              {[
                { name: 'Premium Plan', sales: '34 sales', revenue: '$14,500', change: '+12%' },
                { name: 'Basic Plan', sales: '89 sales', revenue: '$4,450', change: '+8%' },
                { name: 'Enterprise Plan', sales: '14 sales', revenue: '$17,000', change: '+25%' },
                { name: 'Starter Plan', sales: '67 sales', revenue: '$1,675', change: '+5%' },
                { name: 'Pro Plan', sales: '45 sales', revenue: '$8,400', change: '+18%' }
              ].map((product, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.sales}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{product.revenue}</div>
                    <div className="text-xs text-green-600">{product.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Behavior Analysis */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">User Behavior Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Page Engagement</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Homepage</span>
                    <span className="text-sm text-gray-500">Avg. time: 3m 45s</span>
                  </div>
                  <div className="text-xs text-gray-500">Bounce: 28%</div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Product Pages</span>
                    <span className="text-sm text-gray-500">Avg. time: 5m 32s</span>
                  </div>
                  <div className="text-xs text-gray-500">Bounce: 22%</div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Checkout</span>
                    <span className="text-sm text-gray-500">Avg. time: 2m 30s</span>
                  </div>
                  <div className="text-xs text-gray-500">Bounce: 15%</div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Blog</span>
                    <span className="text-sm text-gray-500">Avg. time: 4m 18s</span>
                  </div>
                  <div className="text-xs text-gray-500">Bounce: 35%</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Conversion Paths</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Social → Homepage → Purchase</div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">145</span>
                    <span className="text-xs text-gray-500 ml-2">Conversions</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Search → Product → Purchase</div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">89</span>
                    <span className="text-xs text-gray-500 ml-2">Conversions</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Email → Blog → Purchase</div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">67</span>
                    <span className="text-xs text-gray-500 ml-2">Conversions</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Direct → Homepage → Purchase</div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">123</span>
                    <span className="text-xs text-gray-500 ml-2">Conversions</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Real-time Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">New user registration</span>
                  <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Purchase completed</span>
                  <span className="text-xs text-gray-400 ml-auto">5 min ago</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Cart abandoned</span>
                  <span className="text-xs text-gray-400 ml-auto">8 min ago</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Support ticket created</span>
                  <span className="text-xs text-gray-400 ml-auto">12 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}