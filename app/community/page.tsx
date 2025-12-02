"use client";

import { useState } from "react";
import Link from "next/link";
import {
  usePosts,
  useCreatePost,
  useToggleLike,
  useAddComment,
} from "@/lib/api";
import { useAuthContext } from "@/lib/auth-context";
import { formatSmartDate } from "@/lib/date";

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuthContext();
  const { data: posts, isLoading } = usePosts();
  const createPostMutation = useCreatePost();
  const toggleLikeMutation = useToggleLike();
  const addCommentMutation = useAddComment();

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState("text");
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {}
  );
  const [showComments, setShowComments] = useState<Record<number, boolean>>(
    {}
  );

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await createPostMutation.mutateAsync({
        content: newPostContent,
        type: newPostType,
      });
      setNewPostContent("");
      setNewPostType("text");
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await toggleLikeMutation.mutateAsync(postId);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleAddComment = async (postId: number) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      await addCommentMutation.mutateAsync({
        postId,
        data: { content },
      });
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <a href="/login" className="text-orange-600 hover:underline">
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
          <p className="text-gray-600 mt-1">
            Share recipes, tips, and connect with food lovers
          </p>
        </div>

        {/* Create Post */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <form onSubmit={handleCreatePost}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share something with the community..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <select
                value={newPostType}
                onChange={(e) => setNewPostType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="text">Text</option>
                <option value="recipe">Recipe</option>
                <option value="grocery">Grocery Tip</option>
              </select>

              <button
                type="submit"
                disabled={!newPostContent.trim() || createPostMutation.isPending}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPostMutation.isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-4">
                  <Link
                    href={`/users/${post.user.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold cursor-pointer">
                      {post.user.name?.[0]?.toUpperCase() ||
                        post.user.email[0].toUpperCase()}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/users/${post.user.id}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {post.user.name || post.user.email}
                      </Link>
                      {post.type && post.type !== "text" && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {post.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatSmartDate(new Date(post.created_at))}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <Link
                  href={`/community/posts/${post.id}`}
                  className="block cursor-pointer hover:underline"
                >
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </Link>

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={toggleLikeMutation.isPending}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition"
                  >
                    ❤️ {post.likes_count}
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowComments({
                        ...showComments,
                        [post.id]: !showComments[post.id],
                      });
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition"
                  >
                    💬 {post.comments_count}
                  </button>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({
                            ...commentInputs,
                            [post.id]: e.target.value,
                          })
                        }
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={
                          !commentInputs[post.id]?.trim() ||
                          addCommentMutation.isPending
                        }
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 text-center py-2">
                      Comments load when you click to view them
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}
