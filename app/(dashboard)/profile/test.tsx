"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile, Role } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUp,
  Bell,
  Box,
  Filter,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  Share,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserEngagement from "./components/user-engagement";
import UserLocation from "./components/user-location";
import { useState } from "react";
import { ProfileEditForm } from "./components/profile-edit-form";
import { getCurrentProfile } from "@/actions/profile";
import AllStoresCards from "./components/all-stores-cards";

const fetchUserStats = async () => {
  // This would be your API call to fetch user stats
  return {
    followers: "11.5K",
    engagement: "5.34",
    categories: ["Fashion", "Shopping", "Beauty"],
    location: "Kampala, Uganda",
    role: "Product Reviewer",
    bio: "Eu aliquam fugiat magna reprehenderit reprehenderit tempor aliqua nisi officia irure qui sit. Labore pariatur ex ut aliqua ad deserunt sint duis non eiusmod deserunt eu lab labore mollit consectetur in quis. Adipisicing magna 🔥🔥🔥",
  };
};

const ProfileContent = ({ user }: { user: Profile }) => {
  const queryClient = useQueryClient();
  const { data: userStats } = useQuery({
    queryKey: ["userStats", user.id],
    queryFn: fetchUserStats,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: getCurrentProfile,
    initialData: user,
  });

  const avatarUrl =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.name || "User"
    )}&background=DC143C&color=fff&size=150`;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with cover image */}
      <div className="relative w-full h-60">
        <Image
          src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Cover"
          fill
          className="object-cover"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 -mt-20">
        <div className="flex gap-6">
          {/* Left sidebar */}
          <div className="w-72 bg-white rounded-lg shadow-sm pb-4 relative -mt-12">
            {/* Profile Info */}
            <div className="flex flex-col items-center p-4 border-b">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                  <Image
                    src={avatarUrl}
                    alt={profile?.name || "Profile"}
                    width={150}
                    height={150}
                  />
                </div>
              </div>
              {isEditing ? (
                <div className="w-full">
                  <ProfileEditForm
                    profile={profile!}
                    onSuccess={() => {
                      setIsEditing(false);
                      queryClient.invalidateQueries({
                        queryKey: ["profile", user.id],
                      });
                    }}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-semibold flex items-center gap-2">
                    {profile?.name || "Anonymous User"}
                    <button
                      className="text-blue-500 text-xs"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </h1>

                  {profile?.role === Role.INFLUENCER && <UserEngagement />}

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mt-4 mb-2 justify-center">
                    {userStats?.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-2 flex items-center gap-1 text-xs w-full"
                    size="sm"
                  >
                    <Plus size={14} /> Add Category
                  </Button>

                  <UserLocation
                    location={profile?.location}
                    role={profile?.role}
                  />
                </>
              )}
            </div>

            {/* Bio */}
            {!isEditing && (
              <div className="px-4 py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-medium">Bio</h2>
                  <button
                    className="text-blue-500 text-xs"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {profile?.bio}
                </p>
              </div>
            )}

            {/* Sidebar Navigation */}
            <div className="py-4 border-b">
              <ul className="space-y-2">
                <li className="px-4 py-2 hover:bg-gray-50">
                  <a href="#" className="flex items-center gap-3 text-sm">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>Forums</span>
                  </a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50">
                  <a href="#" className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <MessageSquare className="w-5 h-5 text-gray-500" />
                      <span>Messages</span>
                    </div>
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md">
                      5
                    </span>
                  </a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50">
                  <a href="#" className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <span>Notifications</span>
                    </div>
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md">
                      3
                    </span>
                  </a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50">
                  <a href="#" className="flex items-center gap-3 text-sm">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Setting</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="px-4 py-4 space-y-3 gap-4">
              <Link href="/campaign/new">
                <Button
                  variant="default"
                  className="w-full justify-start gap-2 bg-white text-black hover:bg-blue-500 border border-gray-200 h-12 rounded-xl hover:text-white"
                  size="sm"
                >
                  <Box className="h-4 w-4" /> Become an Influencer
                </Button>
              </Link>
              <Link href="/new">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 my-3 h-12 rounded-xl hover:bg-blue-500 hover:text-white"
                  size="sm"
                >
                  <Box className="h-4 w-4" /> Create Store
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12 rounded-xl hover:bg-blue-500 hover:text-white"
                size="sm"
              >
                <HelpCircle className="h-4 w-4" /> Help Center
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 pt-6">
            {/* Tabs */}
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="w-full border-b flex justify-between rounded-none bg-transparent h-auto p-0">
                <div className="flex">
                  <TabsTrigger
                    value="analytics"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="campaigns"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Campaigns
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenue"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Revenue
                  </TabsTrigger>
                  <TabsTrigger
                    value="brands"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Brands
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentions"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Mentions
                  </TabsTrigger>
                  <TabsTrigger
                    value="content"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Content
                  </TabsTrigger>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded text-sm">
                    <span>Last 7 days</span>
                    <span className="p-1 bg-white rounded shadow-sm">
                      <Filter size={14} />
                    </span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Share size={16} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </TabsList>

              <TabsContent value="analytics" className="mt-6">
                {/* Overview Section */}
                <div>
                  <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Box size={18} />
                    Overview
                  </h2>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Total Views */}
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm text-gray-500">Total Views</h3>
                        <div className="w-8 h-8 flex items-center justify-center bg-pink-500 rounded-lg">
                          <Box className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-semibold mb-3">92,405</div>
                      <div className="h-16 flex items-end gap-1">
                        {[4, 6, 3, 5, 4, 7, 3].map((h, i) => (
                          <div
                            key={i}
                            className="bg-pink-400 w-full"
                            style={{ height: `${h * 12}px` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-green-600">
                        + 5.38% from last month
                      </div>
                    </div>

                    {/* Total Likes */}
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm text-gray-500">Total Likes</h3>
                        <div className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-lg">
                          <Box className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-semibold mb-3">32,218</div>
                      <div className="h-16 flex items-end gap-1">
                        {[2, 3, 4, 5, 7, 6, 8].map((h, i) => (
                          <div
                            key={i}
                            className="bg-teal-400 w-full"
                            style={{ height: `${h * 10}px` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-green-600">
                        + 5.38% from last month
                      </div>
                    </div>

                    {/* New Comments */}
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm text-gray-500">New Comments</h3>
                        <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 rounded-lg">
                          <Box className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-semibold mb-3">2968</div>
                      <div className="h-16 flex items-end gap-1">
                        {[5, 3, 7, 2, 6, 4, 8].map((h, i) => (
                          <div
                            key={i}
                            className="bg-indigo-400 w-full"
                            style={{ height: `${h * 10}px` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-green-600">
                        + 6.84% from last month
                      </div>
                    </div>
                  </div>

                  {/* Second Row Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Total Shares */}
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm text-gray-500">Total Shares</h3>
                        <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 rounded-lg">
                          <Share className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-semibold mb-3">92,405</div>
                      <div className="h-16 flex items-end gap-1">
                        {[5, 4, 7, 6, 3, 5, 4].map((h, i) => (
                          <div
                            key={i}
                            className="bg-indigo-400 w-full"
                            style={{ height: `${h * 12}px` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-green-600">
                        + 5.38% from last month
                      </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm text-gray-500">Total Revenue</h3>
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-lg">
                          <Box className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-semibold mb-3">32,218</div>
                      <div className="h-16 flex items-end gap-1">
                        {[3, 2, 5, 3, 6, 7, 8].map((h, i) => (
                          <div
                            key={i}
                            className="bg-blue-400 w-full"
                            style={{ height: `${h * 10}px` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-green-600">
                        + 5.38% from last month
                      </div>
                    </div>

                    {/* Engagement Rate */}
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm text-gray-500">
                          Engagement Rate
                        </h3>
                        <div className="w-8 h-8 flex items-center justify-center bg-pink-500 rounded-lg">
                          <ArrowUp className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-semibold mb-3">87%</div>
                      <div className="h-16 flex items-end gap-1">
                        {[6, 4, 7, 5, 8, 3, 7].map((h, i) => (
                          <div
                            key={i}
                            className="bg-pink-400 w-full"
                            style={{ height: `${h * 10}px` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-green-600">
                        + 6.84% from last month
                      </div>
                    </div>
                  </div>

                  {/* Bottom Sections */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Top Voices */}
                    <AllStoresCards />

                    {/* Follower Interest */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Follower Interest</h3>
                        <a href="#" className="text-blue-500 text-xs">
                          View details
                        </a>
                      </div>
                      {/* Pie Chart Mockup */}
                      <div className="flex justify-center items-center my-2">
                        <div className="relative w-40 h-40">
                          <div
                            className="absolute inset-0 rounded-full border-8 border-blue-300"
                            style={{
                              clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 30%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-red-300"
                            style={{
                              clipPath:
                                "polygon(0 30%, 100% 30%, 100% 55%, 0 55%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-purple-300"
                            style={{
                              clipPath:
                                "polygon(0 55%, 100% 55%, 100% 80%, 0 80%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-green-300"
                            style={{
                              clipPath:
                                "polygon(0 80%, 100% 80%, 100% 100%, 0 100%)",
                            }}
                          ></div>
                        </div>
                      </div>
                      {/* Legend */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-xs gap-2">
                          <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                          <span>Fashion: 30%</span>
                        </div>
                        <div className="flex items-center text-xs gap-2">
                          <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                          <span>Beauty: 25%</span>
                        </div>
                        <div className="flex items-center text-xs gap-2">
                          <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
                          <span>Shopping: 35%</span>
                        </div>
                        <div className="flex items-center text-xs gap-2">
                          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                          <span>Travel: 10%</span>
                        </div>
                      </div>
                    </div>

                    {/* Audience */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Audience</h3>
                        <a href="#" className="text-blue-500 text-xs">
                          View details
                        </a>
                      </div>
                      {/* Pie Chart Mockup */}
                      <div className="flex justify-center items-center my-4">
                        <div className="relative w-40 h-40">
                          <div
                            className="absolute inset-0 rounded-full border-8 border-blue-300"
                            style={{
                              clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 70%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-pink-300"
                            style={{
                              clipPath:
                                "polygon(0 70%, 100% 70%, 100% 100%, 0 100%)",
                            }}
                          ></div>
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span>Male</span>
                            </div>
                            <span className="font-medium">70%</span>
                          </div>
                          <div className="mt-1 text-xs">$20/k</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                              <span>Female</span>
                            </div>
                            <span className="font-medium">30%</span>
                          </div>
                          <div className="mt-1 text-xs">$48/k</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Locations Section */}
                  <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Locations</h3>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>

                    {/* Pie Chart */}
                    <div className="flex justify-center mb-6">
                      <div className="relative w-40 h-40">
                        <div
                          className="absolute inset-0 rounded-full border-8 border-blue-300"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 25%, 0 25%)",
                          }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-purple-300"
                          style={{
                            clipPath:
                              "polygon(0 25%, 100% 25%, 100% 50%, 0 50%)",
                          }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-green-300"
                          style={{
                            clipPath:
                              "polygon(0 50%, 100% 50%, 100% 75%, 0 75%)",
                          }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-red-300"
                          style={{
                            clipPath:
                              "polygon(0 75%, 100% 75%, 100% 100%, 0 100%)",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center text-xs gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Kenya</span>
                      </div>
                      <div className="flex items-center text-xs gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Uganda</span>
                      </div>
                      <div className="flex items-center text-xs gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Tanzania</span>
                      </div>
                      <div className="flex items-center text-xs gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Nigeria</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <div className="text-xs text-gray-500">Last week</div>
                        <div className="font-medium">32M</div>
                        <div className="text-xs text-gray-500">pages views</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">This week</div>
                        <div className="font-medium">14.8M</div>
                        <div className="text-xs text-gray-500">pages views</div>
                      </div>
                    </div>
                  </div>

                  {/* Channels & Trending Campaigns */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <h3 className="font-medium mb-4">Channels</h3>
                      <div>
                        <div className="flex items-center text-xs text-gray-500 justify-between mb-3">
                          <div className="w-20">App</div>
                          <div className="flex-1 grid grid-cols-6 gap-1">
                            <div>Under 1K</div>
                            <div>1K - 5K</div>
                            <div>5K - 20K</div>
                            <div>20K - 50K</div>
                            <div>50K</div>
                            <div>100K+</div>
                          </div>
                        </div>

                        {/* Channel rows */}
                        {["Android", "Twitter", "Facebook", "TikTok"].map(
                          (channel, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between mb-2"
                            >
                              <div className="w-20 text-sm">{channel}</div>
                              <div className="flex-1 grid grid-cols-6 gap-1">
                                {Array.from({ length: 6 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`h-8 rounded ${
                                      i === Math.floor(Math.random() * 6)
                                        ? "bg-blue-500"
                                        : "bg-gray-100"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        )}

                        {/* Months */}
                        <div className="flex items-center text-xs text-gray-500 justify-between mt-4 pl-20">
                          <div className="flex-1 grid grid-cols-6 gap-1">
                            <div>July</div>
                            <div>Aug</div>
                            <div>Sep</div>
                            <div>Oct</div>
                            <div>Nov</div>
                            <div>Dec</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <h3 className="font-medium mb-4">Trending Campaigns</h3>
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div key={idx} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-1 text-sm font-medium">
                                  {idx < 2 ? (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-500 rounded text-xs">
                                      In Progress
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-500 rounded text-xs">
                                      External
                                    </span>
                                  )}
                                  <h4 className="ml-1">
                                    {idx < 2
                                      ? "Internal Preparation Meeting"
                                      : "External Meeting - Negotiation"}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Users size={12} /> 25
                                  </span>
                                  <span className="mx-1">•</span>
                                  <span>16h - 20h</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </div>
                            <div className="flex mt-2">
                              <div className="flex -space-x-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded-full border-2 border-white bg-gray-300"
                                  ></div>
                                ))}
                                {idx === 2 && (
                                  <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-xs">
                                    +
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Other tabs would go here */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
