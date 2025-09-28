"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  PlusCircle,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import {
  influencerStats,
  influencerReviews,
  influencerWorkImages,
  influencerGalleryImages,
} from "@/data";

const Star = ({ filled }: { filled: boolean }) => (
  <span className={filled ? "text-yellow-400" : "text-gray-300"}>★</span>
);

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} filled={star <= rating} />
      ))}
    </div>
  );
};

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

const Carousel = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  // Create chunks of 3 images per slide
  const slides = [];
  for (let i = 0; i < images.length; i += 3) {
    slides.push(images.slice(i, i + 3));
  }

  const next = () => setCurrent((current + 1) % slides.length);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg ">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slideImages, slideIndex) => (
          <div key={slideIndex} className="w-full flex-shrink-0">
            <div className="grid grid-cols-3 gap-4">
              {slideImages.map((src, imageIndex) => (
                <div
                  key={imageIndex}
                  className="aspect-video rounded-xl overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`Work sample ${slideIndex * 3 + imageIndex + 1}`}
                    width={300}
                    height={200}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
};

const InfluencerDetailsPage = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 200]);

  return (
    <div className="max-w-[100vw] overflow-x-hidden">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar with filters */}
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

              <Filter title="Reviews per day">
                <CheckboxItem label="1 - 10" />
                <CheckboxItem label="20 - 30" />
                <CheckboxItem label="40 - 50" />
                <CheckboxItem label="50 +" />
              </Filter>

              <Filter title="Ad Price ($)">
                <div className="px-2">
                  <div className="flex justify-between mb-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-14 h-8 text-sm border rounded px-2"
                    />
                    <span className="text-sm self-center">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-14 h-8 text-sm border rounded px-2"
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

              <Filter title="Deals & Discounts">
                <CheckboxItem label="All Discounts" />
                <CheckboxItem label="Today's Deals" />
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
                <CheckboxItem label="0 - 5" />
                <CheckboxItem label="5 - 10" />
                <CheckboxItem label="> 10" />
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
          </div>

          {/* Main Content - Influencer Profile */}
          <div className="flex-1">
            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile image and stats */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-44 h-44 rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300"
                        alt="Dr. Anna Jones"
                        width={176}
                        height={176}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>

                  <h1 className="text-xl font-bold mt-4 flex items-center gap-1">
                    Dr. Anna Jones
                    <Check className="h-4 w-4 text-blue-500" />
                  </h1>
                  <p className="text-gray-500 text-sm">Healthcare</p>

                  <div className="grid grid-cols-4 gap-4 w-full mt-4">
                    {influencerStats.map((stat, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center"
                      >
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          {React.createElement(stat.icon, {
                            className:
                              "h-4 w-4" +
                              (stat.label === "Rating"
                                ? " text-yellow-400"
                                : ""),
                          })}
                          <span>{stat.label}</span>
                        </div>
                        <p className="font-semibold">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-1 w-full mt-4">
                    <div className="bg-blue-50 p-1 text-center">
                      <p className="text-xs text-gray-500">Platform</p>
                      <p className="text-xs font-medium">TikTok</p>
                    </div>
                    <div className="bg-green-50 p-1 text-center">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-xs font-medium">$500</p>
                    </div>
                    <div className="bg-yellow-50 p-1 text-center">
                      <p className="text-xs text-gray-500">Content</p>
                      <p className="text-xs font-medium">Video</p>
                    </div>
                  </div>

                  <Link
                    href="/influencer/martha/message"
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white w-full items-center justify-center rounded-md"
                  >
                    <Button className="w-full">Invite</Button>
                  </Link>

                  <div className="flex justify-between w-full mt-3">
                    <Link
                      href="#"
                      className="text-sm text-gray-500 hover:text-blue-500"
                    >
                      $30/Post + Story
                    </Link>
                    <Link
                      href="#"
                      className="text-sm text-gray-500 hover:text-blue-500"
                    >
                      How-to-do Guides
                    </Link>
                  </div>
                </div>

                {/* Profile details */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2">
                      Profile Information
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra maecenas accumsan lacus vel facilisis.
                    </p>
                    <p className="text-gray-600 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra maecenas accumsan lacus vel facilisis.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2">
                      Working Experience
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra maecenas accumsan lacus vel facilisis.
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra maecenas accumsan lacus vel facilisis.
                    </p>
                    <p className="text-gray-600 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra maecenas accumsan lacus vel facilisis.
                    </p>
                  </div>

                  <div className="flex justify-between mb-3">
                    <h2 className="font-semibold text-lg">Reviews</h2>
                    <Link href="#" className="text-sm text-blue-500">
                      See all →
                    </Link>
                  </div>

                  <div className="space-y-4 mb-4">
                    {influencerReviews.map((review) => (
                      <div key={review.id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={review.image}
                            alt={review.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{review.name}</p>
                            <p className="text-gray-500 text-xs">
                              {review.date}
                            </p>
                          </div>
                          <div className="flex text-yellow-400 text-sm">
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {review.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-md mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">Hospital</p>
                        <p className="text-xs text-gray-500">
                          Acme Medical Center
                        </p>
                        <p className="text-xs text-gray-500">
                          1234 W Gray St. D1
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Work Section */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="font-semibold text-lg">My Work</h2>
              </div>

              <Carousel images={influencerWorkImages} />
            </div>

            {/* My Gallery Section */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9C10.1046 9 11 8.10457 11 7C11 5.89543 10.1046 5 9 5C7.89543 5 7 5.89543 7 7C7 8.10457 7.89543 9 9 9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 15L17 11L5 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-semibold text-lg">My Gallery</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {influencerGalleryImages.map((src, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Gallery image ${index + 1}`}
                      width={280}
                      height={280}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add to campaign
              </Button>
            </div>

            {/* Hottest Deals Section */}
            <div className="mt-10 bg-white border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-semibold text-lg">Hottest Deals</h2>
              </div>

              <div className="relative">
                <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10">
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-4 overflow-x-auto pb-4 px-8 hide-scrollbar">
                  {/* Deal Card 1 */}
                  <div className="flex-shrink-0 w-full max-w-lg border rounded-lg overflow-hidden">
                    <div className="flex">
                      <div className="w-[220px] h-[160px] relative">
                        <Image
                          src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=220&h=160"
                          alt="Masoma Collection"
                          width={220}
                          height={160}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                Masoma Collection
                              </h3>
                              <svg
                                className="w-4 h-4 text-blue-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            </div>
                            <p className="text-xs text-gray-500">
                              In-Store Shopping
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-500 text-white text-xs py-1"
                          >
                            Review
                          </Button>
                        </div>

                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400 text-sm">
                            <StarRating rating={4.5} />
                          </div>
                          <span className="text-sm ml-2">2.3K</span>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                            Shopping
                          </span>
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                            Fashion
                          </span>
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                            Clothes
                          </span>
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                            Footwear
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                          Proident ut laboris exercitation eu sit occaecat
                          voluptate aliquip labore in. Lorem eiusmod qui id
                          consectetur id sit est exerew nofuncate finture
                          iussase handcare mantoreas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deal Card 2 */}
                  <div className="flex-shrink-0 w-full max-w-lg border rounded-lg overflow-hidden">
                    <div className="flex">
                      <div className="w-[220px] h-[160px] relative">
                        <Image
                          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=220&h=160"
                          alt="Masoma Collection"
                          width={220}
                          height={160}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                Masoma Collection
                              </h3>
                              <svg
                                className="w-4 h-4 text-blue-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            </div>
                            <p className="text-xs text-gray-500">
                              In-Store Shopping
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-500 text-white text-xs py-1"
                          >
                            Review
                          </Button>
                        </div>

                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400 text-sm">
                            <StarRating rating={4.5} />
                          </div>
                          <span className="text-sm ml-2">2.3K</span>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                            Shopping
                          </span>
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                            Fashion
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                          Proident ut laboris exercitation eu sit occaecat
                          voluptate aliquip labore in. Lorem eiusmod qui id
                          consectetur id sit est exerew nofuncate finture
                          iussase handcare mantoreas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDetailsPage;
