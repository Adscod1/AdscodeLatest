"use client";

import React from "react";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Eye,
  Heart,
  MousePointerClick,
  ShoppingCart,
  Share2,
  CheckCircle,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CampaignDetails = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const campaignId = params.id as string;

  const campaignData = {
    title: "Summer Sneaker Sale",
    dateRange: "June 1, 2024 - August 31, 2024",
    status: "Active",
    budget: {
      total: "$25,000",
      spent: "$18,450",
      percentage: 74,
    },
    revenue: {
      total: "$38,760",
      change: "+$01, +93%",
      positive: true,
    },
    progress: {
      percentage: 74,
      completed: "3 of 4 deliverables completed",
    },
    objective:
      "Drive sales for new summer sneaker collection with focus on Gen Z audience",
  };

  const metrics = [
    { icon: Eye, label: "Reach", value: "487K" },
    { icon: Heart, label: "Engagement", value: "94K" },
    { icon: MousePointerClick, label: "Clicks", value: "12.4K" },
    { icon: ShoppingCart, label: "Conversions", value: "892" },
    { icon: Share2, label: "Impressions", value: "1.2M" },
  ];

  const milestones = [
    {
      title: "Campaign Launch & Initial Content",
      dueDate: "Due: Jun 15",
      status: "completed",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Mid-Campaign Review & Optimization",
      dueDate: "Due: Jun 30",
      status: "completed",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Engagement Boost Phase",
      dueDate: "Due: Jul 15",
      status: "in progress",
      icon: Circle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Final Push & Campaign Wrap-up",
      dueDate: "Due: Jul 30",
      status: "pending",
      icon: Circle,
      color: "text-gray-400",
      bgColor: "bg-gray-100",
    },
  ];

  const ProgressBar = ({
    value,
    color = "bg-purple-500",
  }: {
    value: number;
    color?: string;
  }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${storeId}/campaign/${campaignId}/influencers/profile`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Profile</span>
            </Link>
          </div>
        </div>

        {/* Campaign Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {campaignData.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{campaignData.dateRange}</span>
            </div>
          </div>
          <span className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-full font-medium">
            {campaignData.status}
          </span>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Budget Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 mb-3">
              <DollarSign size={20} />
              <span className="text-sm font-medium text-gray-600">
                Campaign Budget
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {campaignData.budget.total}
            </p>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Spent</span>
                <span className="font-semibold text-gray-900">
                  {campaignData.budget.spent}
                </span>
              </div>
              <ProgressBar
                value={campaignData.budget.percentage}
                color="bg-purple-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {campaignData.budget.percentage}% of budget used
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-green-600 mb-3">
              <TrendingUp size={20} />
              <span className="text-sm font-medium text-gray-600">
                Total Revenue
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {campaignData.revenue.total}
            </p>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                {campaignData.revenue.change}
              </span>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 mb-3">
              <Target size={20} />
              <span className="text-sm font-medium text-gray-600">Progress</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {campaignData.progress.percentage}%
            </p>
            <p className="text-sm text-gray-600">
              {campaignData.progress.completed}
            </p>
          </div>
        </div>

        {/* Campaign Objective */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Campaign Objective
          </h2>
          <p className="text-gray-700">{campaignData.objective}</p>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-5 gap-6">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx}>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Icon size={16} />
                    <span>{metric.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Duplicate Performance Metrics Section (as shown in image) */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Eye size={16} />
                  <span>Reach</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">487K</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Heart size={16} />
                  <span>Engagement</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">94K</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <MousePointerClick size={16} />
                  <span>Clicks</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">12.4K</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <ShoppingCart size={16} />
                  <span>Conversions</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Share2 size={16} />
                <span>Impressions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1.2M</p>
            </div>
          </div>
        </div>

        {/* Milestones & Timeline */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Milestones & Timeline
          </h2>
          <div className="space-y-4">
            {milestones.map((milestone, idx) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${milestone.bgColor} p-2 rounded-full`}>
                      <Icon size={20} className={milestone.color} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-500">{milestone.dueDate}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      milestone.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : milestone.status === "in progress"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {milestone.status === "completed"
                      ? "Completed"
                      : milestone.status === "in progress"
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;