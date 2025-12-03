export interface Recipe {
  id: number;
  name: string;
  ingredients?: string[];
  instructions?: string;
}

// Auth Types
export type UserPublic = {
  id: number;
  email: string;
  name?: string | null;
};

export type UserCreate = {
  email: string;
  password: string;
  name?: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};

// Community Types
export type Post = {
  id: number;
  content: string;
  type?: string | null;
  user: UserPublic;
  likes_count: number;
  comments_count: number;
  created_at: string;
};

export type PostCreate = {
  content: string;
  type?: string;
};

export type Comment = {
  id: number;
  content: string;
  user: UserPublic;
  created_at: string;
};

export type CommentCreate = {
  content: string;
};

export type PostDetail = Post & {
  comments: Comment[];
};

export type UserStats = {
  total_posts: number;
  total_comments: number;
  total_likes_received: number;
};

export type UserProfile = {
  user: UserPublic;
  posts: Post[];
  stats: UserStats;
};