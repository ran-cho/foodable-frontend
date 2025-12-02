"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useAddComment, useToggleLike } from "@/lib/api";
import { PostDetail } from "@/types";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import Link from "next/link";


function formatSmartDate(date: Date) {
  if (isToday(date)) {
    return format(date, "h:mm a"); 
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, "h:mm a")}`;
  } else if (differenceInDays(new Date(), date) < 7) {
    return format(date, "EEE h:mm a"); 
  } else {
    return format(date, "MMM d, yyyy"); 
  }
}

async function fetchPost(id: number): Promise<PostDetail | null> {
  const res = await fetch(`http://127.0.0.1:8000/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default function PostPage() {
  const { id } = useParams();
  const postId = Number(id);
  const router = useRouter();

  const { data: post, isLoading, error, refetch } = useQuery<PostDetail | null>({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId,
  });

  const toggleLikeMutation = useToggleLike();
  const addCommentMutation = useAddComment();

  const [commentInput, setCommentInput] = useState("");

  const handleLike = async () => {
    if (!post) return;
    try {
      await toggleLikeMutation.mutateAsync(post.id);
      refetch();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleAddComment = async () => {
    if (!post || !commentInput.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        postId: post.id,
        data: { content: commentInput },
      });
      setCommentInput("");
      refetch();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  if (isLoading) return <p className="p-6">Loading post...</p>;
  if (!post) return <p className="p-6">Post not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        {/* Post Header */}
        <div className="flex items-start gap-3 mb-4">
          <Link href={`/users/${post.user.id}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold cursor-pointer">
              {post.user.name?.[0]?.toUpperCase() || post.user.email[0].toUpperCase()}
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
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

        {/* Post Actions */}
        <div className="flex items-center gap-6 pt-3 border-t border-gray-100 mb-4">
          <button
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition"
          >
            ❤️ {post.likes_count}
          </button>
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!commentInput.trim() || addCommentMutation.isPending}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-3 mt-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <Link
                  href={`/users/${comment.user.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {comment.user.name || comment.user.email}
                </Link>
                <p className="text-xs text-gray-500">
                  {formatSmartDate(new Date(comment.created_at))}
                </p>
              </div>
              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
