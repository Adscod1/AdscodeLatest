"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Share2,
  Heart,
} from "lucide-react";
import Image from "next/image";

interface CampaignDetail {
  id: string;
  title: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  rating: number;
  reviews: number;
  status: string;
  categories: string[];
  campaignType: string;
  publications: number;
  dateRange: string;
  location: string;
  compensation: string;
  applications: number;
  responseTime: string;
  aboutText: string;
  requirements: string[];
  deliverables: string[];
  benefits: string[];
}

const dummyCampaignDetail: CampaignDetail = {
  id: "1",
  title: "Back-wood Camp Sale",
  description: "Showcase outdoor camping gear and lifestyle",
  mainImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&h=600&fit=crop",
  galleryImages: [
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=300&h=200&fit=crop",
  ],
  rating: 4.2,
  reviews: 12,
  status: "Active",
  categories: ["Furniture", "Open Campaign"],
  campaignType: "Open Campaign",
  publications: 486,
  dateRange: "12.6.2025 - 30.8.2025",
  location: "United States, Canada",
  compensation: "$500 - $2,000 per publication",
  applications: 486,
  responseTime: "Usually within 48 hours",
  aboutText:
    "Join our exclusive outdoor furniture campaign and showcase premium camping gear to your audience. Perfect for lifestyle, outdoor, and adventure content creators.",
  requirements: [
    "Minimum 10,000 followers on primary platform",
    "Engagement rate above 3%",
    "Experience with outdoor or lifestyle content",
    "High-quality photo/video production capabilities",
  ],
  deliverables: [
    "2-3 Instagram posts featuring the products",
    "1 Instagram story series (minimum 5 slides)",
    "Product review blog post or video (optional)",
    "Use of branded hashtags and product tags",
  ],
  benefits: [
    "Free products worth up to $1,000",
    "Exclusive discount codes for your audience",
    "Early access to new collections",
    "Potential for long-term partnership",
  ],
};

const CampaignDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Campaigns</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative  h-[520px] w-[680px] bg-gray-100 rounded-lg overflow-hidden mb-6 bg-red-500">
              <Image
                src={dummyCampaignDetail.mainImage}
                alt={dummyCampaignDetail.title}
                fill
                className="object-cover"
              />
            </div>

            

            {/* Campaign Title and Meta */}
            <div className="bg-white w-[680px] rounded p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {dummyCampaignDetail.title}
                    </h1>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {dummyCampaignDetail.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">
                      {dummyCampaignDetail.rating}
                    </span>
                    <span className="text-gray-600">
                      ({dummyCampaignDetail.reviews} Reviews)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100  rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isSaved
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Category Tags */}
              <div className="flex gap-2 flex-wrap mb-4">
                {dummyCampaignDetail.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Campaign Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{dummyCampaignDetail.campaignType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{dummyCampaignDetail.publications} Publications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{dummyCampaignDetail.dateRange}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{dummyCampaignDetail.location}</span>
              </div>
            </div>

            {/* About this Campaign */}
            <div className="bg-white w-[680px] rounded p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Campaign</h2>
              <p className="text-gray-700 leading-relaxed">
                {dummyCampaignDetail.aboutText}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white w-[680px] rounded p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="space-y-3">
                {dummyCampaignDetail.requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white w-[680px] rounded p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deliverables</h2>
              <div className="space-y-3">
                {dummyCampaignDetail.deliverables.map((delivery, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                    <span className="text-gray-700">{delivery}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What You'll Get */}
            <div className="bg-white w-[680px] rounded p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What You'll Get</h2>
              <div className="space-y-3">
                {dummyCampaignDetail.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 px-4 w-400px">
            <div className="bg-white rounded p-6 sticky top-8">
              {/* Compensation */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Compensation</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {dummyCampaignDetail.compensation}
                </p>
              </div>

              {/* Apply Button */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-700 text-white font-medium py-3 mb-3 rounded">
                Apply Now
              </Button>

              {/* Secondary Actions */}
              <button className="w-full py-3 text-gray-700 font-medium hover:bg-gray-50 rounded transition-colors mb-2 border border-gray-200">
                Save for Later
              </button>
              <button className="w-full py-3 text-gray-700 font-medium hover:bg-gray-50 rounded transition-colors mb-6 border border-gray-200">
                Ask a Question
              </button>

              {/* Campaign Status Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Campaign Status</p>
                  <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {dummyCampaignDetail.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Applications</p>
                  <p className="font-semibold text-gray-900">
                    {dummyCampaignDetail.applications} creators applied
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Response Time</p>
                  <p className="font-semibold text-gray-900">
                    {dummyCampaignDetail.responseTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
