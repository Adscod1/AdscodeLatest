"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  budget: number;
  reach: string;
  status: string;
  applicants?: number;
  campaignType?: string;
}

// Dummy campaigns data
const dummyCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Summer Fashion Collection",
    description: "Showcase new summer clothing line",
    image: "https://images.unsplash.com/photo-1490481651971-dab8dc2d4b32?w=500&h=300&fit=crop",
    budget: 5000,
    reach: "50K",
    status: "Active",
  },
  {
    id: "2",
    title: "Office Space Collaboration",
    description: "Promote co-working spaces",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    budget: 3500,
    reach: "35K",
    status: "Active",
  },
  {
    id: "3",
    title: "Creative Team Workshop",
    description: "Design thinking workshop promotion",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    budget: 2000,
    reach: "20K",
    status: "Active",
  },
  {
    id: "4",
    title: "Tech Workspace Solutions",
    description: "Modern tech workspace features",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    budget: 4500,
    reach: "45K",
    status: "Scheduled",
  },
  {
    id: "5",
    title: "Product Launch Event",
    description: "New product line announcement",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    budget: 6000,
    reach: "60K",
    status: "Active",
  },
  {
    id: "6",
    title: "Brand Awareness Drive",
    description: "Increase brand recognition",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    budget: 3000,
    reach: "30K",
    status: "Scheduled",
  },
];

const CampaignsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Filter campaigns based on search
  const filteredCampaigns = dummyCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-gray-500 text-white";
      case "scheduled":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              All Campaigns
            </h1>
            <p className="text-gray-600 mt-1">
              Browse and manage all your advertising campaigns
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between px-8">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 w-full sm:w-96 border border-gray-300 rounded-full"
            />
          </div>
          <div ref={filterRef} className="relative">
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 rounded hover:bg-blue-500 text-white flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-50">
                {/* Filters Header */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Filters</h3>
                
                {/* Suggested Section */}
                <div className="mb-6">
                  <h4 className="text-normal font-semibold text-gray-900 mb-3">Suggested</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-blue-500 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Open Now</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-blue-500 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Featured Campaigns</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-blue-500 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">High Rated (4.0+)</span>
                    </label>
                  </div>
                  <button className="text-blue-600 font-medium text-sm mt-3 hover:underline">
                    See all
                  </button>
                </div>
                
                {/* Status Section */}
                <div className="mb-6">
                  <h4 className="text-normal font-semibold text-gray-900 mb-3">Status</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-blue-500 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-blue-500 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Waiting</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-blue-500 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Scheduled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-2 border-blue-500 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Completed</span>
                    </label>
                  </div>
                </div>
                
                {/* Campaign Type Section */}
                <div>
                  <h4 className="text-normal font-semibold text-gray-900 mb-3">Campaign Type</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-1 rounded-full border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      Open Campaign
                    </button>
                    <button className="px-4 py-1 rounded-full border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      Invite Only
                    </button>
                    <button className="px-4 py-1 rounded-full border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      Featured
                    </button>
                  </div>
                  <button className="text-blue-600 font-medium text-sm mt-3 hover:underline">
                    See all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 gap-6">
            {filteredCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/business/${params.id}/campaigns/${campaign.id}`}>
                <div className="bg-white rounded overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  {/* Campaign Image */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden group">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                      {campaign.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                      {campaign.description}
                    </p>

                    {/* Budget and Stats */}
                    <div className="flex justify-between items-center text-sm border-t border-gray-200 border-gray-100 pt-3 mt-auto">
                      <div className="flex gap-4">
                        <div>
                          <span className="text-gray-600 text-xs">Budget</span>
                          <p className="font-semibold text-gray-900">${campaign.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Reach</span>
                          <p className="font-semibold text-gray-900">{campaign.reach}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Applicants</span>
                          <p className="font-semibold text-gray-900">{campaign.applicants}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-xs">Type</span>
                          <p className="font-semibold text-gray-900">{campaign.campaignType}</p>
                        </div>
                      </div>
                      <Button className="bg-blue-500 rounded-full hover:bg-blue-600 p-2 text-white text-md h-10 w-30 flex items-center gap-1">
                        See details
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 mb-6">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
