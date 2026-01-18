"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ChevronLeft, 
  Filter,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api, { Review } from "@/lib/api-client";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getRelativeTime } from "@/lib/utils/time";

const ReviewsPage = () => {
  const params = useParams();
  const storeId = params.id as string;
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  
  // Reply functionality state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<{[key: string]: Array<{id: string, text: string, user: string, userImage: string | null, date: Date}>}>({});
  
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
      user: user?.name || "Anonymous User",
      userImage: user?.image || null,
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
    
    // If clicking the same vote type, remove the vote
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

    // Update vote
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
    
    // If already disliked, remove dislike first
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
    
    // If already liked, remove like first
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

  const { data: user } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const session = await authClient.getSession();
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

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", storeId],
    queryFn: async () => {
      const response = await api.reviews.getByStore(storeId);
      return response.reviews;
    },
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
    <div className="bg-white">
      <div className="mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4 px-2 sm:mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                      className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
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
                  {/* Followers Count */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {Math.floor(Math.random() * 500) + 50} followers
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Write Review Button */}
            <div className="mx-auto sm:ml-auto sm:mr-16">
              <Link href={`/business/${storeId}/reviews/write`}>
                <Button className="bg-blue-600 rounded hover:bg-blue-700 w-full sm:w-auto">
                  Write Review
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Container with Increased Padding */}
        <div className="px-4 sm:px-8 lg:px-12">
        {/* Rating Summary */}
        <Card className="p-6 mb-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4 px-2">
                <span className="text-lg text-semibold text-gray-600">Overall rating</span>
                <div className="flex items-center mt-2">
                  <div className="flex items-center mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-6 h-6 ${
                          star <= Math.round(averageRating) 
                            ? 'fill-yellow-400 text-yellow-400' 
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
                        className="h-full bg-yellow-400 rounded-full transition-all"
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
        <div className="flex items-center justify-between mb-6 px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-100" />
              <span className="text-sm font-medium">Filter:</span>
              
              <Button
                variant={filterRating === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRating(null)}
                className={filterRating === null ? "" : "border-gray-100 border rounded-full"}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={filterRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`flex items-center gap-1 ${filterRating === rating ? "" : "border-gray-100 rounded-full"}`}
                >
                  {rating}
                  <Star className="w-3.5 h-3.5 fill-gray-600 text-gray-600" />
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 border border-gray-200 rounded text-sm"
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
            filteredAndSortedReviews.map((review: Review) => (
              <Card key={review.id} className="p-6 ">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <span className="text-gray-500 text-sm">@{review.user.username?.replace(/^@/, '') || 'user'}</span>
                      <svg 
                        className="w-4 h-4 flex-shrink-0" 
                        viewBox="0,0,256,256"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g 
                          fill="#227ec5ff" 
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
                      <span className="text-gray-500 text-sm">
                        {getRelativeTime(review.createdAt)}
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
                    <div className="text-gray-700 leading-relaxed mb-4 break-all max-w-full">
                      {(() => {
                        const lines = review.comment?.split('\n') || [];
                        const title = lines[0]?.replace(/^\*\*(.+?)\*\*$/, '$1') || lines[0];
                        const body = lines.slice(2).join('\n');
                        return (
                          <>
                            {title && <p className="font-bold mb-2">{title}</p>}
                            {body && body.split('\n').map((paragraph, idx) => (
                              <p key={idx} className="mb-2 last:mb-0">{paragraph}</p>
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                              {imageUrls.map((url: string, idx: number) => (
                                <div key={idx} className="relative w-56 h-36 sm:w-64 sm:h-40 rounded-lg overflow-hidden border border-gray-200">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                              {videoUrls.map((url: string, idx: number) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 max-w-md mx-h-96">
                                  <video
                                    src={url}
                                    controls
                                    className="max-w-md max-h-96 object-cover"
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

                    {/* Review Actions */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button 
                        onClick={() => handleVote(review.id, 'helpful')}
                        className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                          userVotes[review.id] === 'helpful' ? 'text-green-600 font-semibold' : ''
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Helpful{helpfulVotes[review.id]?.helpful ? ` (${helpfulVotes[review.id].helpful})` : ''}
                      </button>
                      
                      <button 
                        onClick={() => handleVote(review.id, 'notHelpful')}
                        className={`flex items-center gap-1 hover:text-red-600 transition-colors ${
                          userVotes[review.id] === 'notHelpful' ? 'text-red-600 font-semibold' : ''
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Not helpful{helpfulVotes[review.id]?.notHelpful ? ` (${helpfulVotes[review.id].notHelpful})` : ''}
                      </button>
                      
                      {/* <button
                        onClick={() => handleLike(review.id)}
                        className={`flex items-center gap-1 hover:text-pink-600 transition-colors ${
                          userLikes[review.id] ? 'text-pink-600 font-semibold' : ''
                        }`}
                      >
                        <svg className="w-4 h-4" fill={userLikes[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Likes{likes[review.id] ? ` (${likes[review.id]})` : ''}
                      </button> */}
                      
                      {/* <button
                        onClick={() => handleDislike(review.id)}
                        className={`flex items-center gap-1 hover:text-purple-600 transition-colors ${
                          userDislikes[review.id] ? 'text-purple-600 font-semibold' : ''
                        }`}
                      >
                        <svg className="w-4 h-4" fill={userDislikes[review.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Dislikes{dislikes[review.id] ? ` (${dislikes[review.id]})` : ''}
                      </button> */}
                      
                      <button
                        onClick={() => handleReplyClick(review.id)}
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Reply{replies[review.id] && replies[review.id].length > 0 ? ` (${replies[review.id].length})` : ''}
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === review.id && (
                      <div className="mt-4 pl-4 border-l-2 border-blue-400">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                                className="h-8 text-sm px-3"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleReplySubmit(review.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-sm px-3"
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
                      <div className="mt-4 space-y-3">
                        {replies[review.id].map((reply, index) => (
                          <div key={reply.id} className={`${index > 0 ? 'pl-8 border-l border-gray-300' : 'pl-4 border-l-2 border-gray-200'}`}>
                            <div className="flex items-start gap-3">
                              <div className={`${index > 0 ? 'w-7 h-7 bg-gradient-to-br from-purple-400 to-purple-600' : 'w-8 h-8 bg-gradient-to-br from-green-400 to-green-600'} flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden`}>
                                {reply.userImage ? (
                                  <Image
                                    src={reply.userImage}
                                    alt={reply.user}
                                    width={index > 0 ? 28 : 32}
                                    height={index > 0 ? 28 : 32}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className={`${index > 0 ? 'text-xs' : 'text-sm'} font-bold text-white`}>
                                    {reply.user.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-semibold text-gray-900 ${index > 0 ? 'text-xs' : 'text-sm'}`}>
                                    {reply.user}
                                  </span>
                                  {index === 0 && <Badge className="bg-blue-500 text-white rounded-full text-xs px-2 py-0 h-4">Author</Badge>}
                                  <span className="text-xs text-gray-500">
                                    {getRelativeTime(reply.date)}
                                  </span>
                                </div>
                                <p className={`${index > 0 ? 'text-xs' : 'text-sm'} text-gray-700`}>{reply.text}</p>
                                
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
                                    <ThumbsDown className="w-3.5 h-3.5" />
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
                                    onClick={() => handleReplyClick(review.id)}
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
    </div>
  );
};

export default ReviewsPage;
