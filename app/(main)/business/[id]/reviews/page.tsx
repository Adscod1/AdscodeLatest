"use client";

import { createStoreReview, getStoreReviews } from "@/app/actions/reviews";
import { getStoreById } from "@/app/actions/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product, reviewTags } from "@/data";
import { StoreReview } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, Heart, Reply, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { promotions } from "@/data";

const promotedProducts = promotions.slice(0, 3).map((promo) => ({
  id: promo.id,
  name: promo.title,
  title: promo.title,
  description: promo.description,
  price: promo.price,
  image: promo.image,
  itemsSold: promo.itemsSold,
  rating: promo.rating,
  saleOff: false,
}));

interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
}

interface ReviewWithUser extends StoreReview {
  user: {
    name: string | null;
    emailVerified: boolean;
  };
}

const StarRating = ({
  rating,
  size = "small",
  onRatingChange,
}: {
  rating: number;
  size?: "small" | "medium" | "large";
  onRatingChange?: (rating: number) => void;
}) => {
  const getSize = () => {
    if (size === "small") return "text-sm";
    if (size === "medium") return "text-lg";
    return "text-2xl";
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onRatingChange?.(i + 1)}
          className={`${
            i < rating ? "text-yellow-400" : "text-gray-300"
          } ${getSize()} hover:scale-110 transition-transform`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: ReviewWithUser }) => {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    review.user.name || "User"
  )}&background=random`;

  return (
    <div className="flex gap-3 py-5 px-3 border-b border-gray-100">
      <div className="flex-shrink-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={avatarUrl}
            alt={review.user.name || "User"}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="font-medium">{review.user.name || "Anonymous"}</span>
          {review.user.emailVerified && (
            <span className="text-blue-500">
              <Check className="h-4 w-4" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={review.rating} />
          <span className="text-gray-400 text-xs">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-700">{review.comment}</p>

        <div className="flex items-center gap-4 mt-2">
          <button className="text-gray-500 text-xs flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>Like</span>
          </button>
          <button className="text-gray-500 text-xs flex items-center gap-1">
            <Reply className="h-3 w-3" />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const PromotedCard = ({ product }: { product: Product }) => {
  return (
    <div className="border rounded-lg overflow-hidden group">
      <div className="relative">
        <div className="h-40 bg-gray-100">
          <Image
            src={product.image}
            alt={product.title || product.name || "Product image"}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
          <Heart className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm">{product.title}</h3>
        <p className="text-gray-500 text-xs">{product.description}</p>
        <p className="text-blue-500 font-bold text-sm mt-1">{product.price}</p>
        <div className="flex items-center justify-between mt-1">
          <StarRating rating={4} />
          <span className="text-xs text-gray-500">
            {product.itemsSold} items sold
          </span>
        </div>
      </div>
    </div>
  );
};

const ReviewsPage = () => {
  const params = useParams();
  const storeId = params.id as string;
  const queryClient = useQueryClient();

  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", storeId],
    queryFn: () => getStoreReviews(storeId),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      title: "",
      content: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: ReviewFormData) =>
      createStoreReview({
        storeId,
        rating: data.rating,
        comment: data.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", storeId] });
      toast.success("Review posted successfully!");
      reset();
    },
    onError: () => {
      toast.error("Failed to post review. Please try again.");
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    if (data.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    createReviewMutation.mutate(data);
  };

  if (isLoadingStore || isLoadingReviews) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-full mb-8"></div>
            <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Store Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The store you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Business Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    store.name
                  )}&background=random`}
                  alt={store.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{store.name}</h1>
                </div>
                <p className="text-gray-500 text-sm">{store.category}</p>
                <div className="flex items-center">
                  <StarRating rating={averageRating} />
                  <span className="text-sm text-gray-500 ml-2">
                    ({reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <Button variant="link" className="text-blue-500">
                  Read about our review guidelines →
                </Button>
              </div>
            </div>

            {/* Review Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white border rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold mb-4">Select your rating</h2>

              {/* Star Selection */}
              <div className="mb-6">
                <StarRating
                  rating={watch("rating")}
                  size="large"
                  onRatingChange={(rating) => setValue("rating", rating)}
                />
              </div>

              {/* Keywords */}
              <div className="mb-6">
                <p className="text-sm mb-2">
                  Some keywords to include in your review
                </p>
                <div className="flex flex-wrap gap-2">
                  {reviewTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="rounded-sm"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Review Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Review title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-1"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="border rounded-md">
                  <Textarea
                    placeholder="Write something about the business or product you would like to review..."
                    className="border-0 focus-visible:ring-0 min-h-[100px]"
                    {...register("content", {
                      required: "Content is required",
                      minLength: {
                        value: 3,
                        message: "Review must be at least 65 characters long",
                      },
                    })}
                  />
                </div>
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Your review needs to have at least 65 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={createReviewMutation.isPending}
                  >
                    {createReviewMutation.isPending
                      ? "Posting..."
                      : "Post review"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Reviews Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Reviews</h2>
                <div className="text-sm text-gray-500">
                  {reviews?.length || 0} reviews
                </div>
              </div>

              {/* Overall Rating */}
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <h3 className="text-3xl font-bold">
                      {averageRating.toFixed(1)}
                      <span className="text-xl">/5</span>
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {reviews?.length || 0} reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {reviews && reviews.length > 0 ? (
                <div>
                  {reviews.map((review: ReviewWithUser) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Be the first to review this store!
                </div>
              )}
            </div>

            {/* Promoted Products */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Promoted</h2>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {promotedProducts.map((product) => (
                  <PromotedCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Latest Reviews */}
          <div className="w-full md:w-[350px] shrink-0">
            <div className="bg-white border rounded-lg overflow-hidden sticky top-4">
              <div className="p-5 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h2 className="text-lg font-bold">Latest Reviews</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto px-2">
                {reviews && reviews.length > 0 ? (
                  reviews
                    .slice(0, 5)
                    .map((review: ReviewWithUser) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
