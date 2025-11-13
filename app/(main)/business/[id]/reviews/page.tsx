"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ArrowLeft, 
  Filter,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getStoreById } from "@/app/actions/store";
import { getStoreReviews } from "@/actions/reviews";
import { useState } from "react";

interface ReviewWithUser {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

const ReviewsPage = () => {
  const params = useParams();
  const storeId = params.id as string;
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", storeId],
    queryFn: () => getStoreReviews(storeId),
  });

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    ?.filter(review => filterRating ? review.rating === filterRating : true)
    ?.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    }) || [];

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (isLoadingStore || isLoadingReviews) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-gray-600">The store you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      <div className="mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={`/business/${storeId}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={store.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {store.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                <p className="text-gray-600">All Reviews ({reviews?.length || 0})</p>
              </div>
            </div>
          </div>
          <Link href={`/business/${storeId}/reviews/write`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Write Review
            </Button>
          </Link>
        </div>

        {/* Rating Summary */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-600">Overall rating</span>
                <div className="flex items-center mt-2">
                  <div className="flex items-center mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-6 h-6 ${
                          star <= Math.round(averageRating) 
                            ? 'fill-orange-400 text-orange-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="font-bold text-2xl">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-2">({reviews?.length || 0} Reviews)</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews?.filter(r => r.rating === rating).length || 0;
                const percentage = reviews && reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center text-sm">
                    <button
                      onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                      className={`w-12 text-left hover:text-blue-600 transition-colors ${
                        filterRating === rating ? 'text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {rating} Stars
                    </button>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Filter and Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filter:</span>
              <Button
                variant={filterRating === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRating(null)}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={filterRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                >
                  {rating}★
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map((review: ReviewWithUser) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name || "User"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {(review.user.name || "U").charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {review.user.name || "Anonymous User"}
                      </span>
                      <Badge variant="outline" className="text-xs">Verified</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-orange-400 fill-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                    
                    {/* Review Actions */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful
                      </button>
                      <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        Not helpful
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filterRating ? `No ${filterRating}-star reviews found` : "No reviews yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {filterRating 
                  ? "Try adjusting your filter to see more reviews." 
                  : "Be the first to share your experience!"
                }
              </p>
              {!filterRating && (
                <Link href={`/business/${storeId}/reviews/write`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Write First Review
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredAndSortedReviews.length > 10 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
