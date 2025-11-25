"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ThumbsUp, 
  MessageCircle, 
  MoreHorizontal,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Smile,
  ArrowDown
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface CommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productTitle: string;
  onCommentAdded?: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  open,
  onOpenChange,
  productId,
  productTitle,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments when modal opens
  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, productId]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/comments/${productId}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.comments);
      } else {
        setError("Failed to load comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Posting comment to:', `/api/comments/${productId}`);
      console.log('Comment content:', newComment.trim());
      
      const response = await fetch(`/api/comments/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        // Add new comment to the top of the list
        setComments([data.comment, ...comments]);
        setNewComment("");
        // Notify parent component that a comment was added
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        setError(data.error || "Failed to post comment");
        alert(`Error: ${data.error || "Failed to post comment"}`);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment. Please try again.");
      alert("Failed to post comment. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white rounded-2xl" showCloseButton={false}>
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">Product Comments</DialogTitle>
        
        {/* Add Comment Section - Top */}
        <div className="p-6 bg-gray-50 border-b">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmitComment}>
            <Textarea
              placeholder="Add comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[80px] bg-white border-gray-200 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment(e);
                }
              }}
            />
            
            {/* Formatting Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                  <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                  <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                  <Underline className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                  <ImageIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                  <Video className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                  <Smile className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-lg"
              >
                {isSubmitting ? "Posting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>

        {/* Comments Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Comments</h3>
              <span className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <span>Most recent</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          <ScrollArea className="max-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-500 text-sm">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {/* Avatar */}
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={comment.user.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm">
                        {getInitials(comment.user.name, comment.user.email)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.user.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 text-gray-500">
                        <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-xs font-medium">25</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">3</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Reply</span>
                        </button>
                        <button className="ml-auto hover:text-gray-700 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More Button */}
                {comments.length > 5 && (
                  <button className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium py-2">
                    Show more ↓
                  </button>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
