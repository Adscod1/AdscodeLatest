"use client";

import { getStoreReviews } from "@/app/actions/reviews";
import { getStoreById } from "@/app/actions/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoreReview } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { promotions } from "@/data";

interface ReviewWithUser extends StoreReview {
  user: {
    name: string | null;
    emailVerified: boolean;
  };
}

// Portfolio images for My Work section
const portfolioImages = promotions.slice(0, 4).map((promo) => promo.image);

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-300 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: ReviewWithUser }) => {
  const initials = (review.user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {review.user.name || "Anonymous"}
          </div>
          <StarRating rating={review.rating} />
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
};



const ReviewsPage = () => {
  const params = useParams();
  const storeId = params.id as string;

  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", storeId],
    queryFn: () => getStoreReviews(storeId),
  });

  if (isLoadingStore || isLoadingReviews) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Store Not Found
          </h2>
        </div>
      </div>
    );
  }

  const averageRating = reviews?.length
    ? reviews.reduce(
        (acc: number, review: ReviewWithUser) => acc + review.rating,
        0
      ) / reviews.length
    : 0;

  // Mock stats - replace with real data
  const stats = {
    posts: 540,
    followers: "1.3M",
    following: "1000+",
    engagement: "98%",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Header Card */}
            <Card className="bg-white rounded-xl p-6">
              <div className="flex items-start gap-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        store.name
                      )}&background=random&size=96`}
                      alt={store.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-gray-900">
                      {store.name}
                    </h1>
                    <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                      ✓
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    @{store.name.toLowerCase().replace(/\s+/g, "")}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {store.category || "Fashion Stylist"}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-8 mb-4">
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.posts}</div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.followers}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.following}</div>
                      <div className="text-xs text-gray-500">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.engagement}</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      Fashion
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      Top Influencer
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      Active
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                      Follow
                    </Button>
                    <Button
                      variant="outline"
                      className="p-2 border-gray-300 rounded-lg"
                    >
                      <Instagram className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="p-2 border-gray-300 rounded-lg"
                    >
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="p-2 border-gray-300 rounded-lg"
                    >
                      <Facebook className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card className="bg-white rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Professional fashion stylist and content creator with over 7
                years of experience. Specializing in sustainable fashion and
                streetwear. Passionate about helping brands connect with
                millennial and Gen Z audiences.
              </p>
            </Card>

            {/* Reviews Section */}
            <Card className="bg-white rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Reviews</h2>
              <div className="space-y-1 divide-y">
                {reviews && reviews.length > 0 ? (
                  reviews
                    .slice(0, 2)
                    .map((review: ReviewWithUser) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No reviews yet
                  </div>
                )}
              </div>
            </Card>

            {/* My Work Section */}
            <Card className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">My Work</h2>
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {portfolioImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`Work ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-80 space-y-6">
            {/* Profile Information Card */}
            <Card className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-base mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                {/* Location */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Location</div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Los Angeles, CA</span>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Rating</div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Response Time */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Response Time
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Within 24 hours</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Working Experience Card */}
            <Card className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-base mb-4">Working Experience</h3>
              
              <div className="space-y-4">
                {/* Total Campaigns */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Total Campaigns
                  </div>
                  <div className="text-sm font-semibold">150+</div>
                </div>

                {/* Brands Worked With */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Brands Worked With
                  </div>
                  <div className="text-sm">Nike, Adidas, Zara, H&M</div>
                </div>

                {/* Average Engagement */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Average Engagement
                  </div>
                  <div className="text-sm font-semibold">{stats.engagement}</div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                Connect
              </Button>
            </Card>

            {/* Working Experience Card 2 (duplicate for layout) */}
            <Card className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-base mb-4">Working Experience</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Total Campaigns
                  </div>
                  <div className="text-sm font-semibold">150+</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Brands Worked With
                  </div>
                  <div className="text-sm">Nike, Adidas, Zara, H&M</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Average Engagement
                  </div>
                  <div className="text-sm font-semibold">{stats.engagement}</div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                Connect
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
