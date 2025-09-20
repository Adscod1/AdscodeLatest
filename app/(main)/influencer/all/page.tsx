"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  MessageCircle,
  Share2,
  Heart,
  BookmarkIcon,
} from "lucide-react";
import Link from "next/link";
import { Influencer, influencers } from "@/data";

const Filter = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm">{title}</h3>
        <ChevronDown className="w-4 h-4" />
      </div>
      {children}
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
    <div className="border rounded-lg overflow-hidden relative bg-white">
      <div className="absolute top-2 right-2 z-10">
        <Checkbox className="h-4 w-4 rounded-sm bg-white" />
      </div>

      <div className="p-4">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
            <Image
              src={influencer.image}
              alt={influencer.name}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>

          <Link href={`/influencer/martha`}>
            <h3 className="font-semibold text-center">{influencer.name}</h3>
          </Link>
          <p className="text-xs text-gray-500 text-center">
            {influencer.description}
          </p>

          <div className="grid grid-cols-3 w-full mt-4 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-1">
                <BookmarkIcon className="h-3 w-3 mr-1" />
                <span className="text-[10px]">Following</span>
              </div>
              <div className="flex justify-center">
                <span className="mr-1">👍</span>
                <span className="mr-1">👎</span>
                <span>💬</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-1">
                <Heart className="h-3 w-3 mr-1" />
                <span className="text-[10px]">Followers</span>
              </div>
              <div className="font-semibold text-sm">
                {influencer.followers}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-1">
                <Share2 className="h-3 w-3 mr-1" />
                <span className="text-[10px]">Engagement</span>
              </div>
              <div className="font-semibold text-sm">
                {influencer.engagement}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs mt-4">
          <div className="text-xs text-gray-500">Sponsored range</div>
          <div className="text-xs text-gray-500">Platform type</div>
        </div>

        <div className="flex justify-between text-xs">
          <div className="font-medium">{influencer.price}</div>
          <div className="font-medium">{influencer.contentType}</div>
        </div>

        <div className="mt-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
            {influencer.category}
          </span>
        </div>

        <div className="flex space-x-2 mt-3">
          <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm h-8">
            Add
          </Button>
          <Link href="/influencer/martha/message">
            <Button variant="outline" className="flex-1 text-sm h-8">
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
          </Link>
          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-r-0 rounded-r-none"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
            >
              <BookmarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllInfluencersPage = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 200]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Find Influencers</h1>
        <div className="flex items-center">
          <span className="mr-2 text-sm">Sort by</span>
          <select className="border rounded p-1 text-sm">
            <option>Population</option>
            <option>Rating</option>
            <option>Price</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Filters</h2>
              <button className="text-blue-500 text-sm">Clear all</button>
            </div>

            <Filter title="Category">
              <CheckboxItem label="Banking" />
              <CheckboxItem label="Fashion" />
              <CheckboxItem label="Technology" />
              <button className="text-blue-500 text-xs">See more</button>
            </Filter>

            <Filter title="Followers">
              <CheckboxItem label="1K - 10K" />
              <CheckboxItem label="10K - 100K" />
              <CheckboxItem label="100K - 1M" />
              <button className="text-blue-500 text-xs">See more</button>
            </Filter>

            <Filter title="Age Criteria">
              <CheckboxItem label="13 - 17 years" />
              <CheckboxItem label="18 - 25 years" />
              <CheckboxItem label="26 - 40 years" />
              <CheckboxItem label="40+ years" />
            </Filter>

            <Filter title="Ad Price ($)">
              <div className="px-2">
                <div className="flex justify-between mb-2">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-16 h-8 text-sm"
                  />
                  <span className="text-sm self-center">to</span>
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
                  className="my-6"
                />
              </div>
            </Filter>

            <Filter title="Gender">
              <CheckboxItem label="Male" />
              <CheckboxItem label="Female" />
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
                    <label htmlFor={`rating-${rating}`} className="flex">
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

            <Filter title="Type of Account">
              <CheckboxItem label="Verified Account" value="6" />
              <CheckboxItem label="Non verified Account" />
              <CheckboxItem label="Both" />
            </Filter>

            <Filter title="Campaign Milestones">
              <CheckboxItem label="2 +" />
              <CheckboxItem label="5 +" />
              <CheckboxItem label="10 +" />
            </Filter>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1">
                Reset
              </Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
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
  );
};

export default AllInfluencersPage;
