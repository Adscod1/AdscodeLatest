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
  ChevronLeft, 
  ChevronRight,
  Camera,
  Video,
  X,
  CheckCircle2,
  LogIn,
  UserPlus,
  Upload,
  ImageIcon,
  MessageCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api-client";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getRelativeTime } from "@/lib/utils/time";

const StarRating = ({ rating }: { rating: number }) => {
  const SoftStar = ({ filled }: { filled: boolean }) => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 2.5c.3 0 .6.2.7.5l2.1 4.3 4.7.7c.3 0 .6.3.7.6.1.3 0 .6-.2.8l-3.4 3.3.8 4.7c.1.3 0 .6-.2.8-.2.2-.5.3-.8.1L12 15.4l-4.2 2.2c-.3.2-.6.1-.8-.1-.2-.2-.3-.5-.2-.8l.8-4.7L4.2 8.7c-.2-.2-.3-.5-.2-.8.1-.3.4-.6.7-.6l4.7-.7L11.3 3c.1-.3.4-.5.7-.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={
            i < Math.floor(rating)
              ? "text-yellow-400"
              : i < rating
              ? "text-yellow-400 opacity-60"
              : "text-gray-300"
          }
        >
          <SoftStar filled={i < Math.floor(rating)} />
        </div>
      ))}
    </div>
  );
};

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

  // Vote state
  const [helpfulVotes, setHelpfulVotes] = useState<{[key: string]: {helpful: number, notHelpful: number}}>({});
  const [userVotes, setUserVotes] = useState<{[key: string]: 'helpful' | 'notHelpful' | null}>({});
  
  // Likes state
  const [likes, setLikes] = useState<{[key: string]: number}>({});
  const [userLikes, setUserLikes] = useState<{[key: string]: boolean}>({});
  
  // Dislikes state
  const [dislikes, setDislikes] = useState<{[key: string]: number}>({});
  const [userDislikes, setUserDislikes] = useState<{[key: string]: boolean}>({});

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

  const handleVote = (reviewId: string, voteType: 'helpful' | 'notHelpful') => {
    const currentVote = userVotes[reviewId];
    
    if (currentVote === voteType) {
      setUserVotes(prev => ({ ...prev, [reviewId]: null }));
      setHelpfulVotes(prev => ({
        ...prev,
        [reviewId]: {
          helpful: voteType === 'helpful' ? (prev[reviewId]?.helpful || 1) - 1 : (prev[reviewId]?.helpful || 0),
          notHelpful: voteType === 'notHelpful' ? (prev[reviewId]?.notHelpful || 1) - 1 : (prev[reviewId]?.notHelpful || 0)
        }
      }));
      return;
    }

    setUserVotes(prev => ({ ...prev, [reviewId]: voteType }));
    setHelpfulVotes(prev => {
      const current = prev[reviewId] || { helpful: 0, notHelpful: 0 };
      return {
        ...prev,
        [reviewId]: {
          helpful: voteType === 'helpful' ? current.helpful + 1 : currentVote === 'helpful' ? current.helpful - 1 : current.helpful,
          notHelpful: voteType === 'notHelpful' ? current.notHelpful + 1 : currentVote === 'notHelpful' ? current.notHelpful - 1 : current.notHelpful
        }
      };
    });
  };

  const handleLike = (reviewId: string) => {
    const isLiked = userLikes[reviewId];
    const isDisliked = userDislikes[reviewId];
    
    if (isDisliked) {
      setUserDislikes(prev => ({ ...prev, [reviewId]: false }));
      setDislikes(prev => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 1) - 1
      }));
    }
    
    setUserLikes(prev => ({ ...prev, [reviewId]: !isLiked }));
    setLikes(prev => ({
      ...prev,
      [reviewId]: isLiked ? (prev[reviewId] || 1) - 1 : (prev[reviewId] || 0) + 1
    }));
  };

  const handleDislike = (reviewId: string) => {
    const isDisliked = userDislikes[reviewId];
    const isLiked = userLikes[reviewId];
    
    if (isLiked) {
      setUserLikes(prev => ({ ...prev, [reviewId]: false }));
      setLikes(prev => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 1) - 1
      }));
    }
    
    setUserDislikes(prev => ({ ...prev, [reviewId]: !isDisliked }));
    setDislikes(prev => ({
      ...prev,
      [reviewId]: isDisliked ? (prev[reviewId] || 1) - 1 : (prev[reviewId] || 0) + 1
    }));
  };

  // Upload file to server
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      const data = await api.upload.uploadReviewMedia(file);

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
    queryFn: async () => {
      const response = await api.stores.getById(storeId);
      return response.store;
    },
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", storeId],
    queryFn: async () => {
      const response = await api.reviews.getByStore(storeId);
      return response.reviews;
    },
  });

  // Refetch reviews when rating changes
  useEffect(() => {
    if (rating > 0) {
      refetchReviews();
    }
  }, [rating, refetchReviews]);

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

    setIsSubmitting(true);

    try {
      console.log('Submitting review:', { storeId, rating, reviewTitle, comment: comment.substring(0, 50) + '...' });
      
      // Filter out any null values from upload arrays
      const validImageUrls = uploadedImageUrls.filter(url => url !== null && url !== undefined);
      const validVideoUrls = uploadedVideoUrls.filter(url => url !== null && url !== undefined);
      
      const reviewData: {
        storeId: string;
        rating: number;
        comment: string;
        images?: string;
        videos?: string;
      } = {
        storeId,
        rating,
        comment: `${reviewTitle.trim()}\n\n${comment.trim()}`,
      };
      
      // Only add images/videos if we have valid URLs
      if (validImageUrls.length > 0) {
        reviewData.images = JSON.stringify(validImageUrls);
      }
      
      if (validVideoUrls.length > 0) {
        reviewData.videos = JSON.stringify(validVideoUrls);
      }
      
      console.log('Review data with media:', reviewData);
      
      await api.reviews.create(reviewData);

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
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
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
    <div className="min-h-screen">
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

      <div className="max-w-8xl p-3 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50">
        {/* Header */}
        <div className="mb-4 px-2 sm:mb-6">
          <div className="max-w-8xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <Link href={`/business/${storeId}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 flex-shrink-0 -mt-2 hover:bg-transparent p-0">
                  <ChevronLeft className="w-5 h-5" />
                 
                </Button>
              </Link>
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded flex items-center justify-center flex-shrink-0">
                  {store.logo ? (
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {store.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{store.name}</h1>
                    <svg 
                      className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" 
                      viewBox="0,0,256,256"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g 
                        fill="#228be6" 
                        fillRule="nonzero" 
                        stroke="none" 
                        strokeWidth="1" 
                        strokeLinecap="butt" 
                        strokeLinejoin="miter" 
                        strokeMiterlimit="10" 
                        strokeDasharray="" 
                        strokeDashoffset="0" 
                        fontFamily="none" 
                        fontWeight="normal" 
                        fontSize="none" 
                        textAnchor="inherit" 
                        style={{mixBlendMode: 'normal'}}
                      >
                        <g transform="scale(8.53333,8.53333)">
                          <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.40 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                        </g>
                      </g>
                    </svg>
                    <span className="text-gray-500">@{store.user?.username?.replace(/^@/, '') || 'username'}</span>
                  </div>
                  {store.tagline && (
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{store.tagline}</p>
                  )}
                  {isLoadingSession && (
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                      Checking login status...
                    </p>
                  )}
                  {!isLoadingSession && !user && (
                    <p className="text-xs sm:text-sm text-amber-600 flex items-center gap-1 mt-1">
                      <LogIn className="w-3 h-3" />
                      Please login to submit a review
                    </p>
                  )}
                  {/* Followers Count */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {Math.floor(Math.random() * 500) + 50} followers
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 px-16  ">
          {/* Main Review Form */}
          <div className="lg:col-span-3 mt-8">
            <Card className="sm:p-6 lg:p-8 bg-white">
              <div className="flex justify-end mb-4">
                <Link href="/review-guidelines" className="text-blue-700 text-xs sm:text-sm hover:underline flex">
                  <span className="font-semibold">Read review guidelines</span> <span><ChevronRight className="w-5 h-5" /></span>
                </Link>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Rating Section */}
                <div>
                  <h2 className="text-2xl sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Select your rating</h2>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const ratingLabels = ['Not good', 'Could\'ve been better', 'Ok', 'Good', 'Great'];
                      const orangeIntensities = ['text-yellow-100', 'text-yellow-200', 'text-yellow-300', 'text-yellow-400', 'text-yellow-500'];
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-colors"
                        >
                          <svg
                            className={`w-8 h-8 sm:w-10 sm:h-10 ${
                              star <= (hoveredRating || rating)
                                ? orangeIntensities[star - 1]
                                : 'text-gray-300'
                            } transition-colors`}
                            viewBox="0 0 24 24"
                            fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M12 2.5c.3 0 .6.2.7.5l2.1 4.3 4.7.7c.3 0 .6.3.7.6.1.3 0 .6-.2.8l-3.4 3.3.8 4.7c.1.3 0 .6-.2.8-.2.2-.5.3-.8.1L12 15.4l-4.2 2.2c-.3.2-.6.1-.8-.1-.2-.2-.3-.5-.2-.8l.8-4.7L4.2 8.7c-.2-.2-.3-.5-.2-.8.1-.3.4-.6.7-.6l4.7-.7L11.3 3c.1-.3.4-.5.7-.5z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      );
                    })}
                    {(hoveredRating || rating) > 0 && (
                      <p className="text-sm sm:text-base font-medium text-gray-700 ml-2">
                        {['Not good', 'Could\'ve been better', 'Ok', 'Good', 'Great'][(hoveredRating || rating) - 1]}
                      </p>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">
                    Some keywords to include in your review
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <Badge variant="outline" className="text-xs border rounded-full px-4 py-2 border bg-gray-50">Quality</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Pricing</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Work Ethic</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Customer Care</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Ambience</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Timeliness</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Delivery</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Management</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Parking</Badge>
                    <Badge variant="outline" className="text-xs border rounded-full px- py-2 border bg-gray-50">Discount</Badge>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Review title</h3>
                  <Input
                    placeholder="Give your review a title..."
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="text-base sm:text-lg h-12"
                    maxLength={100}
                  />
                </div>

                {/* Review Content */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Tell us about your experience</h3>
                  
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
                              className="w-30 h-20 sm:h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 left-28 sm:-top-1 sm:-right-2 bg-red-500 text-white rounded-full w-3 h-3 sm:w-3 sm:h-3 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              <X className="w-6 h-6" />
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
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute -top-1 -left-24 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600"
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
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] sm:min-h-[150px] resize-none text-sm sm:text-base"
                    maxLength={2000}
                  />
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Reviews need to be atleast 85 characters.
                    </span>
                    <svg className="w-5 h-5 transform -rotate-90">
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 8}`}
                        strokeDashoffset={`${2 * Math.PI * 8 * (1 - Math.min(comment.length / 85, 1))}`}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 mt-4">
                    
                    <Button 
                      type="submit" 
                      disabled={!rating || !reviewTitle.trim() || !comment.trim() || comment.length < 85 || isSubmitting}
                      className="w-full sm:w-40 h-11 bg-blue-500 hover:bg-blue-600 font-semibold text-base rounded"
                    >
                      {isSubmitting ? "Posting..." : "Post review"}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>

            {/* Reviews Section */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              
              {/* Review Summary */}
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-white">
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
                        <StarRating 
                          rating={reviews && reviews.length > 0 
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                            : 0
                          } 
                        />
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
                    // Calculate current counts
                    const count = reviews?.filter(r => r.rating === ratingValue).length || 0;
                    
                    // Add the user's selected rating to the calculation
                    const adjustedCount = rating === ratingValue ? count + 1 : count;
                    const totalReviews = (reviews?.length || 0) + (rating > 0 ? 1 : 0);
                    const percentage = totalReviews > 0 ? (adjustedCount / totalReviews) * 100 : 0;
                    
                    return (
                      <div key={ratingValue} className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm w-6 sm:w-8">{ratingValue}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
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
              <Card className="p-4 sm:p-6 border border-gray-200">
                <div className="space-y-0">
                  {reviews?.slice(0, 3).map((review, index, array) => (
                    <div key={review.id} className={`py-4 ${index !== array.length - 1 ? 'border-b border-gray-200' : ''}`}>
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
                            <svg 
                              className="w-3.5 h-3.5 flex-shrink-0 " 
                              viewBox="0,0,256,256"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g 
                                fill="#2284c5ff" 
                                fillRule="nonzero" 
                                stroke="none" 
                                strokeWidth="1" 
                                strokeLinecap="butt" 
                                strokeLinejoin="miter" 
                                strokeMiterlimit="10" 
                                strokeDasharray="" 
                                strokeDashoffset="0" 
                                fontFamily="none" 
                                fontWeight="normal" 
                                fontSize="none" 
                                textAnchor="inherit" 
                                style={{mixBlendMode: 'normal'}}
                              >
                                <g transform="scale(8.53333,8.53333)">
                                  <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.40 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                                </g>
                              </g>
                            </svg>
                            <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mb-3">
                            <StarRating rating={review.rating} />
                          </div>
                          <div className="text-sm sm:text-base text-gray-700 prose prose-sm max-w-none break-words">
                            {(() => {
                              const lines = review.comment?.split('\n') || [];
                              const title = lines[0]?.replace(/^\*\*(.+?)\*\*$/, '$1') || lines[0];
                              const body = lines.slice(2).join('\n');
                              return (
                                <>
                                  {title && <p className="mb-2 font-bold break-words">{title}</p>}
                                  {body && body.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-2 last:mb-0 break-words">{paragraph}</p>
                                  ))}
                                </>
                              );
                            })()}
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

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-4 ml-3 text-xs sm:text-sm">
                            <button 
                              onClick={() => handleVote(review.id, 'helpful')}
                              className={`flex items-center gap-1 hover:text-yellow-600 transition-colors ${
                                userVotes[review.id] === 'helpful' ? 'text-yellow-600 font-semibold' : 'text-gray-500'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Helpful{helpfulVotes[review.id]?.helpful ? ` (${helpfulVotes[review.id].helpful})` : ''}</span>
                            </button>
                            <button 
                              onClick={() => handleVote(review.id, 'notHelpful')}
                              className={`flex items-center gap-1 hover:text-red-600 transition-colors ${
                                userVotes[review.id] === 'notHelpful' ? 'text-red-600 font-semibold' : 'text-gray-500'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                              </svg>
                              <span>Not helpful{helpfulVotes[review.id]?.notHelpful ? ` (${helpfulVotes[review.id].notHelpful})` : ''}</span>
                            </button>
                            <button
                              onClick={() => handleLike(review.id)}
                              className={`flex items-center gap-1 hover:text-pink-600 transition-colors ${
                                userLikes[review.id] ? 'text-pink-600 font-semibold' : 'text-gray-500'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill={userLikes[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>Likes{likes[review.id] ? ` (${likes[review.id]})` : ''}</span>
                            </button>
                            <button
                              onClick={() => handleDislike(review.id)}
                              className={`flex items-center gap-1 hover:text-purple-600 transition-colors ${
                                userDislikes[review.id] ? 'text-purple-600 font-semibold' : 'text-gray-500'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill={userDislikes[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Dislikes{dislikes[review.id] ? ` (${dislikes[review.id]})` : ''}</span>
                            </button>
                            <button
                              onClick={() => handleReplyClick(review.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Reply{replies[review.id] && replies[review.id].length > 0 ? ` (${replies[review.id].length})` : ''}</span>
                            </button>
                          </div>

                          {/* Reply Form */}
                          {replyingTo === review.id && (
                            <div className="mt-3 pl-3 border-l-2 border-blue-400">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write a reply..."
                                  className="w-full p-2 border border-gray-200 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                                      onClick={() => handleReplySubmit(review.id)}
                                      className="bg-blue-500 rounded hover:bg-blue-700 text-white h-7 text-xs px-3"
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
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                      <span className="text-xs sm:text-sm font-bold text-white">
                                        {reply.user.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                          {reply.user}
                                        </span>
                                        <svg 
                                          className="w-3.5 h-3.5 flex-shrink-0" 
                                          viewBox="0,0,256,256"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g 
                                            fill="#22c55E" 
                                            fillRule="nonzero" 
                                            stroke="none" 
                                            strokeWidth="1" 
                                            strokeLinecap="butt" 
                                            strokeLinejoin="miter" 
                                            strokeMiterlimit="10" 
                                            strokeDasharray="" 
                                            strokeDashoffset="0" 
                                            fontFamily="none" 
                                            fontWeight="normal" 
                                            fontSize="none" 
                                            textAnchor="inherit" 
                                            style={{mixBlendMode: 'normal'}}
                                          >
                                            <g transform="scale(8.53333,8.53333)">
                                              <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.40 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                                            </g>
                                          </g>
                                        </svg>
                                        <Badge className="bg-blue-500 text-white rounded-full text-xs p-4 px-2 py-0 h-4">Author</Badge>
                                        <span className="text-xs text-gray-500">
                                          {new Date(reply.date).toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-700">{reply.text}</p>
                                      
                                      {/* Reply action buttons */}
                                      <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm">
                                        <button 
                                          onClick={() => handleVote(reply.id, 'helpful')}
                                          className={`flex items-center gap-1 hover:text-yellow-600 transition-colors ${
                                            userVotes[reply.id] === 'helpful' ? 'text-yellow-600 font-semibold' : 'text-gray-500'
                                          }`}
                                        >
                                          <ThumbsUp className="w-3.5 h-3.5" />
                                          <span>Helpful{helpfulVotes[reply.id]?.helpful ? ` (${helpfulVotes[reply.id].helpful})` : ''}</span>
                                        </button>
                                        <button 
                                          onClick={() => handleVote(reply.id, 'notHelpful')}
                                          className={`flex items-center gap-1 hover:text-red-600 transition-colors ${
                                            userVotes[reply.id] === 'notHelpful' ? 'text-red-600 font-semibold' : 'text-gray-500'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                          </svg>
                                          <span>Not helpful{helpfulVotes[reply.id]?.notHelpful ? ` (${helpfulVotes[reply.id].notHelpful})` : ''}</span>
                                        </button>
                                        <button
                                          onClick={() => handleLike(reply.id)}
                                          className={`flex items-center gap-1 hover:text-pink-600 transition-colors ${
                                            userLikes[reply.id] ? 'text-pink-600 font-semibold' : 'text-gray-500'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5" fill={userLikes[reply.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                          </svg>
                                          <span>Likes{likes[reply.id] ? ` (${likes[reply.id]})` : ''}</span>
                                        </button>
                                        <button
                                          onClick={() => handleDislike(reply.id)}
                                          className={`flex items-center gap-1 hover:text-purple-600 transition-colors ${
                                            userDislikes[reply.id] ? 'text-purple-600 font-semibold' : 'text-gray-500'
                                          }`}
                                        >
                                          <svg className="w-3.5 h-3.5" fill={userDislikes[reply.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                          <span>Dislikes{dislikes[reply.id] ? ` (${dislikes[reply.id]})` : ''}</span>
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => handleReplyClick(reply.id)}
                                          className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5" />
                                          <span>Reply</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {reviews?.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M12 2.5c.3 0 .6.2.7.5l2.1 4.3 4.7.7c.3 0 .6.3.7.6.1.3 0 .6-.2.8l-3.4 3.3.8 4.7c.1.3 0 .6-.2.8-.2.2-.5.3-.8.1L12 15.4l-4.2 2.2c-.3.2-.6.1-.8-.1-.2-.2-.3-.5-.2-.8l.8-4.7L4.2 8.7c-.2-.2-.3-.5-.2-.8.1-.3.4-.6.7-.6l4.7-.7L11.3 3c.1-.3.4-.5.7-.5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-sm sm:text-base text-gray-600">Be the first to review<br />this business!</p>
                  </div>
                )}
            </div>
          </div>

          {/* Latest Reviews Sidebar */}
          <div className="lg:col-span-2 mt-8">
            <Card className="p-4 sm:p-6 lg:sticky lg:top-6 bg-white">
              <div className="flex items-center gap-2 mb-4">
              <div className="hover:bg-gray-100 p-1"> 
                <ChevronRight className="w-6 h-6" />
              </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Latest reviews</h3>
              </div>
              
              <div className="space-y-4">
                {reviews?.slice(0, 10).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    {/* Review Header */}
                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name || "User"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-lg  sm:text-sm font-bold text-white">
                            {(review.user.name || "U").charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className=" text-gray-900 text-xl font-bold">
                            {review.user.name || "Anonymous"}
                          </span>
                          <span className="text-gray-500 text-sm">@{review.user.username?.replace(/^@/, '') || 'user'}</span>
                          
                          <svg 
                            className="w-3.5 h-3.5 flex-shrink-0 " 
                            viewBox="0,0,256,256"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g 
                              fill="#2271c5ff" 
                              fillRule="nonzero" 
                              stroke="none" 
                              strokeWidth="1" 
                              strokeLinecap="butt" 
                              strokeLinejoin="miter" 
                              strokeMiterlimit="10" 
                              strokeDasharray="" 
                              strokeDashoffset="0" 
                              fontFamily="none" 
                              fontWeight="normal" 
                              fontSize="none" 
                              textAnchor="inherit" 
                              style={{mixBlendMode: 'normal'}}
                            >
                              <g transform="scale(8.53333,8.53333)">
                                <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.40 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                              </g>
                            </g>
                          </svg>
                         
                          <span className="text-gray-500 text-xs">
                            {getRelativeTime(review.createdAt)}
                          </span>
                        </div>
                        
                        
                        {/* Star Rating */}
                        <div className="flex items-center gap-0.5 mb-2">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2 break-words">
                      {(() => {
                        const lines = review.comment?.split('\n') || [];
                        const title = lines[0]?.replace(/^\*\*(.+?)\*\*$/, '$1') || lines[0];
                        const body = lines.slice(2).join('\n');
                        return (
                          <>
                            {title && <p className="font-bold mb-1">{title}</p>}
                            {body && <p>{body}</p>}
                          </>
                        );
                      })()}
                    </div>

                    {/* Review Images - Larger Size */}
                    {(review as any).images && (() => {
                      try {
                        const imageUrls = JSON.parse((review as any).images);
                        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                          return (
                            <div className="mb-3 grid grid-cols-2 gap-2">
                              {imageUrls.slice(0, 4).map((url: string, idx: number) => (
                                <div key={idx} className="relative w-60 h-40 rounded overflow-hidden border border-gray-100">
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
                    <div className="flex items-center gap-3 mt-2 ml-3 text-xs">
                      <button 
                        onClick={() => handleVote(review.id, 'helpful')}
                        className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                          userVotes[review.id] === 'helpful' ? 'text-green-600 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful{helpfulVotes[review.id]?.helpful ? ` (${helpfulVotes[review.id].helpful})` : ''}</span>
                      </button>
                      <button 
                        onClick={() => handleVote(review.id, 'notHelpful')}
                        className={`flex items-center gap-1 hover:text-red-600 transition-colors ${
                          userVotes[review.id] === 'notHelpful' ? 'text-red-600 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        <span>Not helpful{helpfulVotes[review.id]?.notHelpful ? ` (${helpfulVotes[review.id].notHelpful})` : ''}</span>
                      </button>
                      
                      {/* <button
                        onClick={() => handleLike(review.id)}
                        className={`flex items-center gap-1 hover:text-pink-600 transition-colors ${
                          userLikes[review.id] ? 'text-pink-600 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill={userLikes[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Likes{likes[review.id] ? ` (${likes[review.id]})` : ''}</span>
                      </button> */}
                      
                      {/* <button
                        onClick={() => handleDislike(review.id)}
                        className={`flex items-center gap-1 hover:text-purple-600 transition-colors ${
                          userDislikes[review.id] ? 'text-purple-600 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill={userDislikes[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Dislikes{dislikes[review.id] ? ` (${dislikes[review.id]})` : ''}</span>
                      </button> */}
                      
                      <button
                        onClick={() => handleReplyClick(review.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Reply{replies[review.id] && replies[review.id].length > 0 ? ` (${replies[review.id].length})` : ''}</span>
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === review.id && (
                      <div className="mt-3 pl-3 border-l-2 border-blue-400">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                                onClick={() => handleReplySubmit(review.id)}
                                className="bg-blue-500 rounded hover:bg-blue-700 text-white h-7 text-xs px-3"
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
                                  <svg 
                                    className="w-3.5 h-3.5 flex-shrink-0" 
                                    viewBox="0,0,256,256"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g 
                                      fill="#22c55E" 
                                      fillRule="nonzero" 
                                      stroke="none" 
                                      strokeWidth="1" 
                                      strokeLinecap="butt" 
                                      strokeLinejoin="miter" 
                                      strokeMiterlimit="10" 
                                      strokeDasharray="" 
                                      strokeDashoffset="0" 
                                      fontFamily="none" 
                                      fontWeight="normal" 
                                      fontSize="none" 
                                      textAnchor="inherit" 
                                      style={{mixBlendMode: 'normal'}}
                                    >
                                      <g transform="scale(8.53333,8.53333)">
                                        <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.40 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                                      </g>
                                    </g>
                                  </svg>
                                  <Badge className="bg-blue-500 text-white rounded-full text-xs p-4 px-2 py-0 h-4">Author</Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.date).toLocaleTimeString('en-US', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-700">{reply.text}</p>
                                
                                {/* Reply action buttons */}
                                <div className="flex items-center gap-3 mt-2 text-xs">
                                  <button 
                                    onClick={() => handleVote(reply.id, 'helpful')}
                                    className={`flex items-center gap-1 hover:text-yellow-600 transition-colors ${
                                      userVotes[reply.id] === 'helpful' ? 'text-yellow-600 font-semibold' : 'text-gray-500'
                                    }`}
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>Helpful{helpfulVotes[reply.id]?.helpful ? ` (${helpfulVotes[reply.id].helpful})` : ''}</span>
                                  </button>
                                  <button 
                                    onClick={() => handleVote(reply.id, 'notHelpful')}
                                    className={`flex items-center gap-1 hover:text-red-600 transition-colors ${
                                      userVotes[reply.id] === 'notHelpful' ? 'text-red-600 font-semibold' : 'text-gray-500'
                                    }`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                    </svg>
                                    <span>Not helpful{helpfulVotes[reply.id]?.notHelpful ? ` (${helpfulVotes[reply.id].notHelpful})` : ''}</span>
                                  </button>
                                  <button
                                    onClick={() => handleLike(reply.id)}
                                    className={`flex items-center gap-1 hover:text-pink-600 transition-colors ${
                                      userLikes[reply.id] ? 'text-pink-600 font-semibold' : 'text-gray-500'
                                    }`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill={userLikes[reply.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>Likes{likes[reply.id] ? ` (${likes[reply.id]})` : ''}</span>
                                  </button>
                                  <button
                                    onClick={() => handleDislike(reply.id)}
                                    className={`flex items-center gap-1 hover:text-purple-600 transition-colors ${
                                      userDislikes[reply.id] ? 'text-purple-600 font-semibold' : 'text-gray-500'
                                    }`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill={userDislikes[reply.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Dislikes{dislikes[reply.id] ? ` (${dislikes[reply.id]})` : ''}</span>
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => handleReplyClick(reply.id)}
                                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Reply</span>
                                  </button>
                                </div>
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
                    <MessageCircle className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 text-gray-300" />
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