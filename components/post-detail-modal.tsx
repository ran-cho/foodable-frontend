"use client";

import { useState } from "react";
import { usePost, useToggleLike, useAddComment } from "@/lib/api";
import { useAuthContext } from "@/lib/auth-context";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { useDeletePost } from "@/hooks/useDeletePost";
import { useDeleteComment } from "@/hooks/useDeleteComment";

type PostDetailModalProps = {
  postId: number;
  onClose: () => void;
};

function formatSmartDate(date: Date) {
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return `Yesterday ${format(date, "h:mm a")}`;
  if (differenceInDays(new Date(), date) < 7) return format(date, "EEE h:mm a");
  return format(date, "MMM d, yyyy");
}

export function PostDetailModal({ postId, onClose }: PostDetailModalProps) {
  const { user: currentUser } = useAuthContext();
  const { data: post, isLoading } = usePost(postId);
  const toggleLikeMutation = useToggleLike();
  const addCommentMutation = useAddComment();
  const deletePostMutation = useDeletePost();
  const deleteCommentMutation = useDeleteComment();

  const [commentContent, setCommentContent] = useState("");

  const handleLike = async () => {
    try {
      await toggleLikeMutation.mutateAsync(postId);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await addCommentMutation.mutateAsync({
        postId,
        data: { content: commentContent },
      });
      setCommentContent("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleDeletePost = () => {
    if (!post) return;
    if (confirm("Delete this post?")) {
      deletePostMutation.mutate(post.id, { onSuccess: onClose });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm("Delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Post Details</h2>
          <div className="flex items-center gap-2">
            {currentUser?.id === post?.user.id && (
              <button
                onClick={handleDeletePost}
                className="text-red-500 text-sm px-2 py-1 rounded hover:bg-red-50 transition"
              >
                Delete Post
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            </div>
          ) : post ? (
            <>
              {/* Post */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {post.user.name?.[0]?.toUpperCase() || post.user.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {post.user.name || post.user.email}
                      </p>
                      {post.type && post.type !== "text" && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {post.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formatSmartDate(new Date(post.created_at))}</p>
                  </div>
                </div>

                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={toggleLikeMutation.isPending}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition"
                >
                  ❤️ <span className="text-sm font-medium">{post.likes_count} likes</span>
                </button>
              </div>

              {/* Comments */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Comments ({post.comments.length})
                </h3>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!commentContent.trim() || addCommentMutation.isPending}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {comment.user.name?.[0]?.toUpperCase() || comment.user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm text-gray-900 mb-1">
                                {comment.user.name || comment.user.email}
                              </p>
                              <p className="text-sm text-gray-800">{comment.content}</p>
                            </div>

                            {currentUser?.id === comment.user.id && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-500 text-xs ml-2 hover:bg-red-50 px-1 py-0.5 rounded transition"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 ml-3">
                            {formatSmartDate(new Date(comment.created_at))}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Post not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
