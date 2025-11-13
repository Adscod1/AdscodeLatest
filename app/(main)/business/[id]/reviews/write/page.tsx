"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { 
  Star, 
  ArrowLeft, 
  Camera, 
  CheckCircle2,
  LogIn,
  UserPlus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getStoreById } from "@/app/actions/store";
import { createStoreReview, getStoreReviews } from "@/actions/reviews";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then(mod => mod.default),
  { ssr: false }
);

const WriteReviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  // Check authentication status
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
  });

  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", storeId],
    queryFn: () => getStoreReviews(storeId),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!session?.user) {
      setShowLoginDialog(true);
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewTitle.trim()) {
      toast.error("Please add a review title");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await createStoreReview({
        storeId,
        rating,
        comment: `**${reviewTitle.trim()}**\n\n${comment.trim()}`,
      });

      toast.success("Review submitted successfully!");
      setIsReviewSubmitted(true);
      refetchReviews();
      
      // Reset form but stay on page
      setRating(0);
      setReviewTitle("");
      setComment("");

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsReviewSubmitted(false);
      }, 5000);
      
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStore) {
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
          <p className="text-gray-600">The store you're trying to review doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Login Required
            </DialogTitle>
            <DialogDescription>
              You need to be logged in to submit a review. Please sign in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full">
              <Button variant="outline" className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
      {isReviewSubmitted && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Review submitted successfully! Thank you for your feedback.</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
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
                <p className="text-gray-600">Write a review</p>
              </div>
            </div>
          </div>
          <Link href="/review-guidelines" className="text-blue-600 text-sm hover:underline">
            Read about our review guidelines →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Review Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Rating Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Select your rating</h2>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Some keywords to include in your review
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Service Quality</Badge>
                    <Badge variant="outline">Product Prices</Badge>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Title</h3>
                  <Input
                    placeholder="Give your review a title..."
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="text-lg"
                    maxLength={100}
                  />
                </div>

                {/* Comment Section with Markdown Editor */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Review</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <MDEditor
                      value={comment}
                      onChange={(val) => setComment(val || "")}
                      preview="edit"
                      hideToolbar={false}
                      height={300}
                      data-color-mode="light"
                      style={{
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Your review needs to have at least 85 characters +</span>
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>Add photos</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {comment.length}/2000
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" type="button">
                      Cancel
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!rating || !reviewTitle.trim() || !comment.trim() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Posting..." : !session?.user ? "Login to Post Review" : "Post review"}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Reviews Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              
              {/* Review Summary */}
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">
                        {reviews && reviews.length > 0 
                          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                          : "0.0"
                        }
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avgRating = reviews && reviews.length > 0 
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                            : 0;
                          return (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= avgRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      ({reviews?.length || 0} reviews)
                    </p>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((ratingValue) => {
                    const count = reviews?.filter(r => r.rating === ratingValue).length || 0;
                    const percentage = reviews && reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={ratingValue} className="flex items-center gap-3">
                        <span className="text-sm w-8">{ratingValue}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-12">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviews?.slice(0, 3).map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name || "User"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {(review.user.name || "U").charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {review.user.name || "Anonymous User"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-gray-700 prose prose-sm max-w-none">
                          {review.comment?.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-2 last:mb-0">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {reviews?.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600">Be the first to review this business!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest Reviews Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Reviews</h3>
              <div className="space-y-4">
                {reviews?.slice(0, 5).map((review) => (
                  <div key={review.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      {review.user.image ? (
                        <Image
                          src={review.user.image}
                          alt={review.user.name || "User"}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">
                          {(review.user.name || "U").charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium text-sm text-gray-900 truncate">
                          {review.user.name || "Anonymous"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}

                {reviews?.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💭</div>
                    <p className="text-sm text-gray-500">No reviews yet</p>
                  </div>
                )}
              </div>

              {reviews && reviews.length > 5 && (
                <Link 
                  href={`/business/${storeId}/reviews`}
                  className="text-blue-600 text-sm hover:underline mt-4 block"
                >
                  Show more discussion ({reviews.length - 5})
                </Link>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewPage;