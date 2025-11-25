"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  ArrowLeft, 
  Camera,
  Video,
  X,
  CheckCircle2,
  LogIn,
  UserPlus,
  Upload,
  ImageIcon,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getStoreById } from "@/app/actions/store";
import { createStoreReview, getStoreReviews } from "@/actions/reviews";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api-client";

const WriteReviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [comment, setComment] = useState("");
  const [attachedImages, setAttachedImages] = useState<File[]>([]);
  const [attachedVideos, setAttachedVideos] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  
  // Reply functionality state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<{[key: string]: Array<{id: string, text: string, user: string, date: Date}>}>({});

  // Reply handlers
  const handleReplyClick = (reviewId: string) => {
    setReplyingTo(reviewId);
    setReplyText("");
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;

    // TODO: Add API call to save reply
    const newReply = {
      id: Date.now().toString(),
      text: replyText,
      user: user?.name || "Current User",
      date: new Date()
    };

    setReplies(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), newReply]
    }));

    setReplyText("");
    setReplyingTo(null);
    toast.success("Reply posted successfully!");
  };

  // Upload file to server
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      const data = await api.upload.uploadMedia(file);

      console.log('Upload successful:', data);
      return data.url;
    } catch (error) {
      console.error('File upload error:', error);
      toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Network error'}`);
      return null;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachedImages.length + files.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }

    const validImages = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      return true;
    });

    if (validImages.length > 0) {
      const newPreviewUrls: string[] = [];
      validImages.forEach(file => {
        const url = URL.createObjectURL(file);
        newPreviewUrls.push(url);
      });
      
      setAttachedImages(prev => [...prev, ...validImages]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

      toast.promise(
        Promise.all(validImages.map(file => uploadFile(file))),
        {
          loading: 'Uploading images...',
          success: (urls) => {
            const validUrls = urls.filter((url): url is string => url !== null);
            setUploadedImageUrls(prev => [...prev, ...validUrls]);
            return `${validUrls.length} image(s) uploaded successfully`;
          },
          error: 'Failed to upload some images',
        }
      );
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachedVideos.length + files.length > 2) {
      toast.error("You can only upload up to 2 videos");
      return;
    }

    const validVideos = files.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 50MB`);
        return false;
      }
      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a valid video file`);
        return false;
      }
      return true;
    });

    if (validVideos.length > 0) {
      const newPreviewUrls: string[] = [];
      validVideos.forEach(file => {
        const url = URL.createObjectURL(file);
        newPreviewUrls.push(url);
      });
      
      setAttachedVideos(prev => [...prev, ...validVideos]);
      setVideoPreviewUrls(prev => [...prev, ...newPreviewUrls]);

      toast.promise(
        Promise.all(validVideos.map(file => uploadFile(file))),
        {
          loading: 'Uploading videos...',
          success: (urls) => {
            const validUrls = urls.filter((url): url is string => url !== null);
            setUploadedVideoUrls(prev => [...prev, ...validUrls]);
            return `${validUrls.length} video(s) uploaded successfully`;
          },
          error: 'Failed to upload some videos',
        }
      );
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Remove video
  const removeVideo = (index: number) => {
    URL.revokeObjectURL(videoPreviewUrls[index]);
    setAttachedVideos(prev => prev.filter((_, i) => i !== index));
    setVideoPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setUploadedVideoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const { data: user, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const session = await authClient.getSession();
        console.log('Full session response:', session);
        console.log('Session data:', session?.data);
        console.log('Session user:', session?.data?.user);
        return session?.data?.user ?? null;
      } catch (error) {
        console.error('Session error:', error);
        return null;
      }
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
    
    console.log('Submit attempt - User:', user);
    
    if (!user) {
      console.log('No valid user found, showing login dialog');
      setShowLoginDialog(true);
      return;
    }

    console.log('User is authenticated:', user);

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewTitle.trim()) {
      toast.error("Please add a review title");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write your review content");
      return;
    }

    if (comment.trim().length < 85) {
      toast.error("Your review must be at least 85 characters long");
      return;
    }

    try {
      console.log('Submitting review:', { storeId, rating, reviewTitle, comment: comment.substring(0, 50) + '...' });
      
      const reviewData = {
        storeId,
        rating,
        comment: `**${reviewTitle.trim()}**\n\n${comment.trim()}`,
        images: uploadedImageUrls.length > 0 ? JSON.stringify(uploadedImageUrls) : undefined,
        videos: uploadedVideoUrls.length > 0 ? JSON.stringify(uploadedVideoUrls) : undefined,
      };
      
      console.log('Review data with media:', reviewData);
      
      await createStoreReview(reviewData);

      toast.success("Review submitted successfully!");
      setIsReviewSubmitted(true);
      refetchReviews();
      
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      videoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setRating(0);
      setReviewTitle("");
      setComment("");
      setAttachedImages([]);
      setAttachedVideos([]);
      setImagePreviewUrls([]);
      setVideoPreviewUrls([]);
      setUploadedImageUrls([]);
      setUploadedVideoUrls([]);

      setTimeout(() => {
        setIsReviewSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(`Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600">The store you're trying to review doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Login Required please
            </DialogTitle>
            <DialogDescription>
              You need to be logged in to submit a review. Please sign in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/auth/login" className="w-full" onClick={() => setShowLoginDialog(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full" onClick={() => setShowLoginDialog(false)}>
              <Button variant="outline" className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => setShowLoginDialog(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
      {isReviewSubmitted && (
        <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 max-w-md mx-auto">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm sm:text-base">Review submitted successfully! Thank you for your feedback.</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <Link href={`/business/${storeId}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2 flex-shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {store.logo ? (
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {store.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{store.name}</h1>
                  <p className="text-sm sm:text-base text-gray-600">Write a review</p>
                  {isLoadingSession && (
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                      Checking login status...
                    </p>
                  )}
                  {!isLoadingSession && user && (
                    <p className="text-xs sm:text-sm text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="truncate">Logged in as {user.name || user.email}</span>
                    </p>
                  )}
                  {!isLoadingSession && !user && (
                    <p className="text-xs sm:text-sm text-amber-600 flex items-center gap-1 mt-1">
                      <LogIn className="w-3 h-3" />
                      Please login to submit a review
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Link href="/review-guidelines" className="text-blue-600 text-xs sm:text-sm hover:underline self-start sm:self-auto">
              Read review guidelines →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Review Form */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Rating Section */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Select your rating</h2>
                  <div className="flex items-center gap-1 sm:gap-2 mb-2">
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
                          className={`w-6 h-6 sm:w-8 sm:h-8 ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Some keywords to include in your review
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">Service Quality</Badge>
                    <Badge variant="outline" className="text-xs">Product Prices</Badge>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Review Title</h3>
                  <Input
                    placeholder="Give your review a title..."
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="text-base sm:text-lg"
                    maxLength={100}
                  />
                </div>

                {/* Review Content */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Review</h3>
                  
                  {/* Media Upload Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                    <div className="w-full sm:w-auto">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="block">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer text-sm"
                          asChild
                        >
                          <span>
                            <Camera className="w-4 h-4" />
                            <span className="truncate">Images ({attachedImages.length}/5)</span>
                          </span>
                        </Button>
                      </label>
                    </div>
                    
                    <div className="w-full sm:w-auto">
                      <input
                        type="file"
                        id="video-upload"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <label htmlFor="video-upload" className="block">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer text-sm"
                          asChild
                        >
                          <span>
                            <Video className="w-4 h-4" />
                            <span className="truncate">Videos ({attachedVideos.length}/2)</span>
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Attached Images:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={url}
                              alt={`Preview ${index + 1}`}
                              width={120}
                              height={120}
                              className="w-full h-20 sm:h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Previews */}
                  {videoPreviewUrls.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Attached Videos:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {videoPreviewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <video
                              src={url}
                              controls
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Area */}
                  <Textarea
                    placeholder="Share details about your experience with this business. What did you like or dislike? What should others know before visiting?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] sm:min-h-[150px] resize-none text-sm sm:text-base"
                    maxLength={2000}
                  />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-3">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Min 85 characters required
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {comment.length}/2000
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
                  <Button variant="outline" size="sm" type="button" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!rating || !reviewTitle.trim() || !comment.trim() || comment.length < 85 || isSubmitting}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Posting..." : "Post review"}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Reviews Section */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              
              {/* Review Summary */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-bold">
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
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                star <= avgRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
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
                      <div key={ratingValue} className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm w-6 sm:w-8">{ratingValue}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 w-10 sm:w-12">
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
                  <Card key={review.id} className="p-4 sm:p-6 overflow-hidden">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name || "User"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {(review.user.name || "U").charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-sm sm:text-base font-medium text-gray-900 break-words">
                            {review.user.name || "Anonymous User"}
                          </span>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            Verified
                          </Badge>
                          <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm sm:text-base text-gray-700 prose prose-sm max-w-none break-words">
                          {review.comment?.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-2 last:mb-0 break-words">{paragraph}</p>
                          ))}
                        </div>
                      
                        {/* Display Review Media */}
                        {(review as any).images && (() => {
                          try {
                            const imageUrls = JSON.parse((review as any).images);
                            if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                              return (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 max-w-full">
                                  {imageUrls.map((url: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                      <Image
                                        src={url}
                                        alt={`Review image ${idx + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform"
                                      />
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                          } catch (e) {
                            console.error('Error parsing review images:', e);
                          }
                          return null;
                        })()}
                      
                        {(review as any).videos && (() => {
                          try {
                            const videoUrls = JSON.parse((review as any).videos);
                            if (Array.isArray(videoUrls) && videoUrls.length > 0) {
                              return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-w-full">
                                  {videoUrls.map((url: string, idx: number) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                                      <video
                                        src={url}
                                        controls
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                          } catch (e) {
                            console.error('Error parsing review videos:', e);
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </Card>
                ))}

                {reviews?.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-6xl mb-4">💬</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-sm sm:text-base text-gray-600">Be the first to review this business!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest Reviews Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 lg:sticky lg:top-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">▶</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Latest Reviews</h3>
              </div>
              
              <div className="space-y-4">
                {reviews?.slice(0, 10).map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    {/* Review Header */}
                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name || "User"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {(review.user.name || "U").charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs sm:text-sm text-gray-900">
                            {review.user.name || "Anonymous"}
                          </span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">✓</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: false 
                            })}
                          </span>
                        </div>
                        
                        {/* Star Rating */}
                        <div className="flex items-center gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? 'text-orange-400 fill-orange-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2 break-words">
                      {review.comment}
                    </p>

                    {/* Review Images - Larger Size */}
                    {(review as any).images && (() => {
                      try {
                        const imageUrls = JSON.parse((review as any).images);
                        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                          return (
                            <div className="mb-3 grid grid-cols-2 gap-2">
                              {imageUrls.slice(0, 4).map((url: string, idx: number) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                                  <Image
                                    src={url}
                                    alt={`Review image ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                              {imageUrls.length > 4 && (
                                <div className="relative aspect-video rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-gray-600">+{imageUrls.length - 4}</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                      } catch (e) {
                        console.error('Error parsing review images:', e);
                      }
                      return null;
                    })()}

                    {/* Reply Button and Count */}
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleReplyClick(review.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                      
                      {replies[review.id] && replies[review.id].length > 0 && (
                        <span className="flex items-center gap-1 text-blue-600 text-xs">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Reply ({replies[review.id].length})</span>
                        </span>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyingTo === review.id && (
                      <div className="mt-3 pl-3 border-l-2 border-blue-400">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                          />
                          {/* Emoji Toolbar */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-base">
                              <button type="button" className="hover:scale-110 transition-transform">👍</button>
                              <button type="button" className="hover:scale-110 transition-transform">❤️</button>
                              <button type="button" className="hover:scale-110 transition-transform">👏</button>
                              <button type="button" className="hover:scale-110 transition-transform">😂</button>
                              <button type="button" className="hover:scale-110 transition-transform">😍</button>
                              <button type="button" className="hover:scale-110 transition-transform">🔥</button>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                className="text-gray-600 h-7 text-xs px-2"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleReplySubmit(review.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs px-3"
                              >
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Display Replies */}
                    {replies[review.id] && replies[review.id].length > 0 && (
                      <div className="mt-3 space-y-2">
                        {replies[review.id].map((reply) => (
                          <div key={reply.id} className="pl-4 border-l-2 border-gray-200">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 flex-shrink-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {reply.user.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-xs">
                                    {reply.user}
                                  </span>
                                  {reply.user === store?.name && (
                                    <Badge className="bg-blue-500 text-white text-xs px-2 py-0 h-4">Author</Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.date).toLocaleTimeString('en-US', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: false 
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-700">{reply.text}</p>
                                
                                {/* Reply to reply button */}
                                <button 
                                  type="button"
                                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 mt-1 text-xs"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>Reply</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {reviews?.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <div className="text-3xl sm:text-4xl mb-2">💭</div>
                    <p className="text-xs sm:text-sm text-gray-500">No reviews yet</p>
                  </div>
                )}
              </div>

              {reviews && reviews.length > 5 && (
                <Link 
                  href={`/business/${storeId}/reviews`}
                  className="text-blue-600 text-xs sm:text-sm hover:underline mt-4 block text-center"
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