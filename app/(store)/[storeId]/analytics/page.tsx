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
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

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
  <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-xs sm:text-sm font-medium truncate pr-2">{title}</span>
      <div className="text-gray-400 flex-shrink-0">{icon}</div>
    </div>
    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className={`text-xs sm:text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />}
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
  // Revenue data for line chart
  const revenueData = [
    { month: 'Jan', revenue: 32000, target: 30000 },
    { month: 'Feb', revenue: 35000, target: 33000 },
    { month: 'Mar', revenue: 38000, target: 36000 },
    { month: 'Apr', revenue: 41000, target: 39000 },
    { month: 'May', revenue: 43000, target: 42000 },
    { month: 'Jun', revenue: 45231, target: 45000 },
  ];

  const revenueChartConfig = {
    revenue: {
      label: "Actual Revenue",
      color: "#111827",
    },
    target: {
      label: "Target",
      color: "#3B82F6",
    },
  } satisfies ChartConfig;

  // Traffic sources data for pie chart
  const trafficData = [
    { name: 'Organic Search', value: 45, visitors: 1058, fill: '#111827' },
    { name: 'Direct', value: 30, visitors: 705, fill: '#3B82F6' },
    { name: 'Social Media', value: 15, visitors: 353, fill: '#10B981' },
    { name: 'Email', value: 10, visitors: 235, fill: '#F59E0B' },
  ];

  const trafficChartConfig = {
    visitors: {
      label: "Visitors",
    },
    "Organic Search": {
      label: "Organic Search",
      color: "#111827",
    },
    Direct: {
      label: "Direct",
      color: "#3B82F6",
    },
    "Social Media": {
      label: "Social Media",
      color: "#10B981",
    },
    Email: {
      label: "Email",
      color: "#F59E0B",
    },
  } satisfies ChartConfig;

  // Device breakdown data for pie chart
  const deviceData = [
    { name: 'Desktop', value: 65, fill: '#111827' },
    { name: 'Mobile', value: 30, fill: '#3B82F6' },
    { name: 'Tablet', value: 5, fill: '#10B981' },
  ];

  const deviceChartConfig = {
    Desktop: {
      label: "Desktop",
      color: "#111827",
    },
    Mobile: {
      label: "Mobile",
      color: "#3B82F6",
    },
    Tablet: {
      label: "Tablet",
      color: "#10B981",
    },
  } satisfies ChartConfig;

  // Customer demographics bar chart
  const customerTypeData = [
    { type: 'New', percentage: 35, count: 1250 },
    { type: 'Returning', percentage: 51, count: 1820 },
    { type: 'VIP', percentage: 8, count: 135 },
    { type: 'At-Risk', percentage: 6, count: 205 },
  ];

  const customerChartConfig = {
    percentage: {
      label: "Percentage (%)",
      color: "#111827",
    },
  } satisfies ChartConfig;

  // Geographic distribution data
  const geoData = [
    { region: 'N. America', percentage: 43, count: 1540 },
    { region: 'Europe', percentage: 35, count: 1258 },
    { region: 'Asia Pacific', percentage: 16, count: 580 },
    { region: 'Other', percentage: 6, count: 220 },
  ];

  const geoChartConfig = {
    percentage: {
      label: "Percentage (%)",
      color: "#3B82F6",
    },
  } satisfies ChartConfig;

  // Hourly activity data for line chart
  const hourlyData = [
    { time: '9 AM', visitors: 120, revenue: 580 },
    { time: '10 AM', visitors: 185, revenue: 920 },
    { time: '11 AM', visitors: 210, revenue: 1050 },
    { time: '12 PM', visitors: 248, revenue: 1250 },
    { time: '1 PM', visitors: 320, revenue: 1680 },
    { time: '2 PM', visitors: 185, revenue: 980 },
    { time: '3 PM', visitors: 275, revenue: 1420 },
    { time: '4 PM', visitors: 190, revenue: 890 },
    { time: '5 PM', visitors: 145, revenue: 720 },
  ];

  const hourlyChartConfig = {
    visitors: {
      label: "Visitors",
      color: "#3B82F6",
    },
    revenue: {
      label: "Revenue ($)",
      color: "#10B981",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex min-h-screen bg-gray-50">
     
      
      <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 md:mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base">Track your store's performance and insights</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <select className="border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm w-full sm:w-auto">
              <option>Last 30 days</option>
            </select>
            <button className="bg-gray-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium w-full sm:w-auto">
              Export
            </button>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
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

        {/* Revenue Trend Chart */}
        <Card className="mb-4 sm:mb-6 md:mb-8">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg md:text-xl">Revenue Trend</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Actual revenue vs target over 6 months</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                  <span className="text-gray-600">Actual: $45,231</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <span className="text-gray-600">Target: $45,000</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={revenueChartConfig} className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="50%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7}/>
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  className="text-xs sm:text-sm"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  className="text-xs sm:text-sm"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                    className="bg-white/95 backdrop-blur-sm shadow-lg border-gray-200"
                  />} 
                />
                <ChartLegend content={<ChartLegendContent className="text-xs sm:text-sm" />} />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTarget)"
                  strokeDasharray="5 5"
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Hourly Activity Line Chart */}
        <Card className="mb-4 sm:mb-6 md:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">Hourly Activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Visitors and revenue throughout the day</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={hourlyChartConfig} className="h-[200px] sm:h-[250px] md:h-[300px]">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources and Device Breakdown - Pie Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">Traffic Sources</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Distribution of traffic by source</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer config={trafficChartConfig} className="h-[200px] sm:h-[230px] md:h-[260px]">
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {trafficData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.visitors} visitors</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">Device Breakdown</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Distribution of traffic by device type</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer config={deviceChartConfig} className="h-[200px] sm:h-[230px] md:h-[260px]">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {deviceData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Type and Geographic Distribution - Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">Customer Type Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Breakdown of customer types</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer config={customerChartConfig} className="h-[200px] sm:h-[230px] md:h-[260px]">
                <BarChart data={customerTypeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="type"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="percentage" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg md:text-xl">Geographic Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Traffic by region</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer config={geoChartConfig} className="h-[200px] sm:h-[230px] md:h-[260px]">
                <BarChart data={geoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis 
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis 
                    dataKey="region" 
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="percentage" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Engagement and Revenue Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Revenue Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
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
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="mb-4 sm:mb-6 md:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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
          </CardContent>
        </Card>

        {/* Customer Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base md:text-lg">Customer Type</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base md:text-lg">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base md:text-lg">Gender Demographics</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base md:text-lg">Account Quality</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Customer Journey Funnel */}
        <Card className="mb-4 sm:mb-6 md:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Customer Journey Funnel</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Sales Performance and Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="mb-4 sm:mb-6 md:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* User Behavior Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">User Behavior Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}