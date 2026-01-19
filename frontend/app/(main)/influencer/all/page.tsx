"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  Heart,
} from "lucide-react";
import Link from "next/link";

export interface Influencer {
  id: string;
  name: string;
  description: string;
  category: string;
  followers: string;
  engagement: string;
  image: string;
}

const influencers: Influencer[] = [
  {
    id: "1",
    name: "Sophia Chen",
    description: "Fashion Stylist",
    category: "Fashion",
    followers: "1.3M",
    engagement: "4.2%",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
  },
  {
    id: "2", 
    name: "Marcus Williams",
    description: "Tech Reviewer",
    category: "Tech",
    followers: "890K",
    engagement: "3.8%",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  },
  {
    id: "3",
    name: "Aria Johnson", 
    description: "Beauty Expert",
    category: "Beauty",
    followers: "2.1M",
    engagement: "5.1%",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
  }
];

const Filter = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded"
      >
        <h3 className="font-medium text-sm text-gray-900">{title}</h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <div className="px-2">{children}</div>
      </div>
    </div>
  );
};

const CheckboxItem = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Checkbox id={label.toLowerCase()} />
      <label htmlFor={label.toLowerCase()} className="text-sm">
        {label}{" "}
        {value && <span className="text-gray-500 text-xs">({value})</span>}
      </label>
    </div>
  );
};

const InfluencerCard = ({ influencer }: { influencer: Influencer }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow p-0">
      {/* Cover Image */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={influencer.image}
          alt={influencer.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Avatar */}
      <div className="relative -mt-12 flex justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
          <Image
            src={influencer.image}
            alt={influencer.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-2 text-center">
        {/* Name */}
        <Link href={`/influencer/${influencer.id}`}>
          <h3 className="font-bold text-base text-gray-900 flex items-center justify-center gap-1">
            {influencer.name}
            <span className="text-blue-500">✓</span>
          </h3>
        </Link>

        {/* Username & Description */}
        <p className="text-sm text-gray-500">@{influencer.name.toLowerCase().replace(' ', '')}</p>
        <p className="text-sm text-gray-600 mb-3">{influencer.description}</p>

        {/* Tags */}
        <div className="flex gap-2 justify-center mb-3 flex-wrap">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {influencer.category}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
            Top Influencer
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">
            Active
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-4">
          <span className="text-yellow-400 text-lg">★</span>
          <span className="font-semibold text-gray-900">4.9</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center border-t border-b border-gray-100 py-3">
          <div>
            <div className="text-gray-400 text-xs mb-1">👁️</div>
            <div className="font-semibold text-gray-900">{influencer.followers}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">💬</div>
            <div className="font-semibold text-gray-900">{influencer.engagement}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">✉️</div>
            <div className="font-semibold text-gray-900">{influencer.engagement}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <Heart className="w-4 h-4 mr-2" />
            Follow
          </Button>
          <Link href={`/influencer/${influencer.id}`} className="flex-1">
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              View Profile →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AllInfluencersPage = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 200]);

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <p className="text-gray-600 mb-6">Showing {influencers.length} influencers</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button className="text-blue-500 text-sm hover:text-blue-600 font-medium">
                Clear all
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <Filter title="Category" defaultOpen={true}>
                <CheckboxItem label="Banking" />
                <CheckboxItem label="Fashion" />
                <CheckboxItem label="Technology" />
                <button className="text-blue-500 text-xs hover:text-blue-600 mt-2">
                  See more
                </button>
              </Filter>

              <Filter title="Followers" defaultOpen={true}>
                <CheckboxItem label="1K - 10K" />
                <CheckboxItem label="10K - 100K" />
                <CheckboxItem label="100K - 1M" />
                <button className="text-blue-500 text-xs hover:text-blue-600 mt-2">
                  See more
                </button>
              </Filter>

              <Filter title="Age Criteria">
                <CheckboxItem label="13 - 17 years" />
                <CheckboxItem label="18 - 25 years" />
                <CheckboxItem label="26 - 40 years" />
                <CheckboxItem label="40+ years" />
              </Filter>

              <Filter title="Ad Price ($)">
                <div className="flex justify-between mb-2">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-16 h-8 text-sm"
                  />
                  <span className="text-sm self-center text-gray-500">to</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-16 h-8 text-sm"
                  />
                </div>
                <Slider
                  defaultValue={[20, 200]}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) =>
                    setPriceRange(value as [number, number])
                  }
                  className="my-4"
                />
              </Filter>

              <Filter title="Gender">
                <CheckboxItem label="Male" />
                <CheckboxItem label="Female" />
              </Filter>

              <Filter title="Content Style">
                <CheckboxItem label="Casual & Authentic" />
                <CheckboxItem label="Professional & Polished" />
                <CheckboxItem label="Fun & Energetic" />
                <CheckboxItem label="Educational" />
                <CheckboxItem label="Minimalist" />
              </Filter>

              <Filter title="Engagement Rate">
                <CheckboxItem label="> 60%" />
                <CheckboxItem label="> 75%" />
                <CheckboxItem label="> 85%" />
              </Filter>

              <Filter title="Rating">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${rating}`} />
                      <label htmlFor={`rating-${rating}`} className="flex cursor-pointer">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < rating ? "text-yellow-400" : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </label>
                    </div>
                  ))}
                </div>
              </Filter>

              <Filter title="Account Type">
                <CheckboxItem label="Verified Account" value="6" />
                <CheckboxItem label="Non verified Account" />
                <CheckboxItem label="Both" />
              </Filter>

              <Filter title="Campaign Milestones">
                <CheckboxItem label="2 +" />
                <CheckboxItem label="5 +" />
                <CheckboxItem label="10 +" />
              </Filter>
            </div>

            <div className="flex gap-2 p-4 border-t border-gray-100 bg-gray-50">
              <Button variant="outline" className="flex-1 hover:bg-white">
                Reset
              </Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
                Apply
              </Button>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"></path>
              </svg>
              <h2 className="font-semibold">Top Creators</h2>
            </div>
          </div>
        </div>

        {/* Main Content - Influencer Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {influencers.map((influencer, index) => (
              <InfluencerCard key={index} influencer={influencer} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" className="mx-1 px-4">
              Previous
            </Button>
            <Button
              variant="outline"
              className="mx-1 px-4 bg-blue-500 text-white"
            >
              1
            </Button>
            <Button variant="outline" className="mx-1 px-4">
              2
            </Button>
            <Button variant="outline" className="mx-1 px-4">
              3
            </Button>
            <Button variant="outline" className="mx-1 px-4">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AllInfluencersPage;
