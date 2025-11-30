"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Define Post type
type Post = {
  id: number;
  user: { id: number; name: string; avatar: string };
  type: "recipe" | "grocery" | "text";
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  recipeId?: number;
  recipeName?: string;
};

// Mock data - replace with backend API later
const mockPosts: Post[] = [
  {
    id: 1,
    user: { id: 1, name: "Sarah Chen", avatar: "👩‍🍳" },
    type: "recipe",
    content: "Just made the best avocado toast! Check out my recipe.",
    recipeId: 1,
    recipeName: "Avocado Toast Supreme",
    likes: 24,
    comments: 5,
    timestamp: "2 hours ago",
    liked: false,
  },
  {
    id: 2,
    user: { id: 2, name: "Mike Johnson", avatar: "👨‍🍳" },
    type: "grocery",
    content: "Sharing my weekly meal prep grocery list!",
    likes: 12,
    comments: 3,
    timestamp: "5 hours ago",
    liked: true,
  },
  {
    id: 3,
    user: { id: 3, name: "Emma Wilson", avatar: "👩" },
    type: "recipe",
    content: "Found a great low-calorie dinner option. 400 cal per serving!",
    recipeId: 2,
    recipeName: "Grilled Chicken Salad",
    likes: 35,
    comments: 8,
    timestamp: "1 day ago",
    liked: false,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    // TODO: Send to backend API
    const post: Post = {
      id: Date.now(),
      user: { id: 999, name: "You", avatar: "😊" },
      type: "text",
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      liked: false,
    };
    
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Community Feed</h1>
          <p className="text-gray-600 mt-1">Share and discover recipes</p>
        </div>
        <Button asChild>
          <Link href="/community/following">Following</Link>
        </Button>
      </div>

      {/* Create Post */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Share with the community</h2>
        <div className="space-y-4">
          <Input
            placeholder="What's cooking? Share a recipe, tip, or your grocery list..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePost()}
          />
          <div className="flex gap-2">
            <Button onClick={handlePost} disabled={!newPost.trim()}>
              Post
            </Button>
            <Button variant="outline">📷 Add Photo</Button>
            <Button variant="outline">🍽️ Share Recipe</Button>
          </div>
        </div>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <Link href={`/community/profile/${post.user.id}`} className="flex items-center gap-3 hover:opacity-80">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  {post.user.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.user.name}</p>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </Link>
              <Button variant="ghost" size="sm">•••</Button>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-4">{post.content}</p>

            {/* Recipe Link if applicable */}
            {post.type === "recipe" && post.recipeId && (
              <Link href={`/recipes/${post.recipeId}`}>
                <Card className="p-4 bg-green-50 hover:bg-green-100 transition cursor-pointer mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🍽️</span>
                    <div>
                      <p className="font-semibold text-gray-900">{post.recipeName}</p>
                      <p className="text-sm text-gray-600">View Recipe →</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 transition ${
                  post.liked ? "text-red-600" : "text-gray-600 hover:text-red-600"
                }`}
              >
                <span className="text-xl">{post.liked ? "❤️" : "🤍"}</span>
                <span className="font-medium">{post.likes}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                <span className="text-xl">💬</span>
                <span className="font-medium">{post.comments}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition ml-auto">
                <span className="text-xl">🔗</span>
                <span className="font-medium">Share</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline">Load More Posts</Button>
      </div>
    </div>
  );
}