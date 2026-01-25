"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Search,
  Loader2,
  Users,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { influencersApi, Influencer } from "@/lib/api-client";

const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const InfluencerCard = ({ influencer }: { influencer: Influencer }) => {
  const fullName = `${influencer.firstName} ${influencer.lastName}`;
  const username = `@${influencer.firstName.toLowerCase()}${influencer.lastName.toLowerCase()}`;
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100">
        {influencer.profilePicture && (
          <Image
            src={influencer.profilePicture}
            alt={fullName}
            fill
            className="object-cover opacity-50"
          />
        )}
      </div>

      {/* Avatar */}
      <div className="relative -mt-12 flex justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
          {influencer.profilePicture ? (
            <Image
              src={influencer.profilePicture}
              alt={fullName}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {influencer.firstName.charAt(0)}{influencer.lastName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-2 text-center">
        {/* Name */}
        <Link href={`/influencer/${influencer.id}`}>
          <h3 className="font-bold text-base text-gray-900 flex items-center justify-center gap-1 hover:text-blue-600 transition-colors">
            {fullName}
            {influencer.status === 'APPROVED' && (
              <span className="text-blue-500">✓</span>
            )}
          </h3>
        </Link>

        {/* Username & Description */}
        <p className="text-sm text-gray-500">{username}</p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {influencer.bio || influencer.primaryNiche || 'Content Creator'}
        </p>

        {/* Tags */}
        <div className="flex gap-2 justify-center mb-3 flex-wrap">
          {influencer.primaryNiche && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {influencer.primaryNiche}
            </span>
          )}
          {influencer.status === 'APPROVED' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              Verified
            </span>
          )}
          {influencer.totalFollowers >= 100000 && (
            <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
              Top Creator
            </span>
          )}
        </div>

        {/* Location */}
        {influencer.location && (
          <div className="flex items-center justify-center gap-1 mb-3 text-sm text-gray-500">
            <MapPin className="w-3 h-3" />
            {influencer.location}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center border-t border-b border-gray-100 py-3">
          <div>
            <div className="text-gray-400 text-xs mb-1">
              <Users className="w-4 h-4 mx-auto" />
            </div>
            <div className="font-semibold text-gray-900">{formatFollowers(influencer.totalFollowers)}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">
              <Star className="w-4 h-4 mx-auto" />
            </div>
            <div className="font-semibold text-gray-900">{influencer.engagementRate}%</div>
            <div className="text-xs text-gray-500">Engagement</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">📱</div>
            <div className="font-semibold text-gray-900">{influencer.socialAccounts.length}</div>
            <div className="text-xs text-gray-500">Platforms</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <Heart className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Link href={`/influencer/${influencer.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AllInfluencersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  const { data: influencers, isLoading, error } = useQuery({
    queryKey: ['influencers'],
    queryFn: () => influencersApi.getAll(),
  });

  // Filter influencers based on search and niche
  const filteredInfluencers = influencers?.filter((influencer) => {
    const fullName = `${influencer.firstName} ${influencer.lastName}`.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      fullName.includes(searchTerm.toLowerCase()) ||
      influencer.primaryNiche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNiche = !selectedNiche || influencer.primaryNiche === selectedNiche;
    
    return matchesSearch && matchesNiche;
  }) || [];

  // Get unique niches for filter
  const niches = [...new Set(influencers?.map(i => i.primaryNiche).filter(Boolean) || [])];

  if (error) {
    return (
      <div className="w-full bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load influencers. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Influencers</h1>
          <p className="text-gray-600">
            Connect with talented content creators for your next campaign
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, niche, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Niche Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedNiche === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedNiche(null)}
              >
                All
              </Button>
              {niches.slice(0, 5).map((niche) => (
                <Button
                  key={niche}
                  variant={selectedNiche === niche ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedNiche(niche === selectedNiche ? null : niche!)}
                >
                  {niche}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          {isLoading ? 'Loading...' : `Showing ${filteredInfluencers.length} influencers`}
        </p>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredInfluencers.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No influencers found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedNiche 
                ? "Try adjusting your search or filters" 
                : "Be the first to join as an influencer!"
              }
            </p>
          </div>
        )}

        {/* Influencer Grid */}
        {!isLoading && filteredInfluencers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInfluencers.map((influencer) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInfluencersPage;
