"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Share2, 
  Instagram, 
  Twitter, 
  Facebook,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Youtube,
  Globe
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { influencersApi } from "@/lib/api-client";
import { toast } from "sonner";

const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram className="w-4 h-4" />;
    case 'twitter':
    case 'x':
      return <Twitter className="w-4 h-4" />;
    case 'facebook':
      return <Facebook className="w-4 h-4" />;
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    case 'tiktok':
      return <span className="text-sm font-bold">TT</span>;
    default:
      return <Globe className="w-4 h-4" />;
  }
};

export default function InfluencerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: influencer, isLoading, error } = useQuery({
    queryKey: ['influencer', id],
    queryFn: () => influencersApi.getById(id),
    enabled: !!id,
  });

  const handleMessage = () => {
    // Navigate to the messages page with the influencers tab and influencer ID
    if (influencer) {
      router.push(`/messages?tab=influencers&influencer=${influencer.id}`);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Influencer not found</h1>
          <p className="text-gray-600 mb-6">The influencer you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/influencer/all">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Influencers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${influencer.firstName} ${influencer.lastName}`;
  const username = `@${influencer.firstName.toLowerCase()}${influencer.lastName.toLowerCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Link href="/influencer/all" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Influencers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={influencer.profilePicture || undefined} alt={fullName} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {influencer.firstName.charAt(0)}{influencer.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">{fullName}</h1>
                        {influencer.status === 'APPROVED' && (
                          <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-1">{username}</p>
                      <p className="text-gray-700">{influencer.primaryNiche || 'Content Creator'}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatFollowers(influencer.totalFollowers)}</p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{influencer.engagementRate}%</p>
                      <p className="text-sm text-gray-600">Engagement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{influencer.socialAccounts.length}</p>
                      <p className="text-sm text-gray-600">Platforms</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {influencer.primaryNiche && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {influencer.primaryNiche}
                      </span>
                    )}
                    {influencer.status === 'APPROVED' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                        Verified
                      </span>
                    )}
                    {influencer.totalFollowers >= 100000 && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full">
                        Top Creator
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={handleMessage}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline">
                      Follow
                    </Button>
                    {/* Social Links */}
                    {influencer.socialAccounts.map((account) => (
                      <Button 
                        key={account.platform} 
                        variant="outline" 
                        size="icon"
                        asChild={!!account.profileUrl}
                      >
                        {account.profileUrl ? (
                          <a href={account.profileUrl} target="_blank" rel="noopener noreferrer">
                            {getSocialIcon(account.platform)}
                          </a>
                        ) : (
                          getSocialIcon(account.platform)
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {influencer.bio || `${fullName} is a content creator specializing in ${influencer.primaryNiche || 'various topics'}. Connect with them for collaboration opportunities.`}
              </p>
            </Card>

            {/* Social Accounts Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Social Platforms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {influencer.socialAccounts.map((account) => (
                  <div 
                    key={account.platform}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getSocialIcon(account.platform)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{account.platform}</p>
                      <p className="text-sm text-gray-600">@{account.handle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatFollowers(account.followerCount)}</p>
                      <p className="text-xs text-gray-500">followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Information Card */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                {influencer.location && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{influencer.location}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{formatFollowers(influencer.totalFollowers)} followers</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{influencer.engagementRate}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">
                      {new Date(influencer.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Connect Card */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Work with {influencer.firstName}</h3>
              <p className="text-gray-600 text-sm mb-4">
                Interested in collaborating? Send a message to discuss campaign opportunities.
              </p>
              
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={handleMessage}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
