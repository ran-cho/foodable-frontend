import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Recipe } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://foodablebackend.onrender.com";

// ===== Token Management =====
const TOKEN_KEY = "foodable_token";

export const TokenManager = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
  },
  remove: () => {
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
  },
};

// ===== API Helper =====
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = TokenManager.get();
  const headers = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  } as Record<string, string>;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...init,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ===== Types =====
export type Grocery = {
  id: number;
  name: string;
  category?: string | null;
  calories?: number | null;
  protein?: number | null;
};

export type GroceryCreate = Omit<Grocery, "id">;
export type RecipeCreate = Omit<Recipe, "id">;

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

// ===== Auth API =====
export const AuthAPI = {
  register: (data: UserCreate) =>
    api<UserPublic>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: async (data: UserLogin): Promise<Token> => {
    const token = await api<Token>("/auth/login", { method: "POST", body: JSON.stringify(data) });
    TokenManager.set(token.access_token);
    return token;
  },

  logout: () => {
    TokenManager.remove();
  },

  getMe: () => api<UserPublic>("/auth/me"),
};

// ===== Community API =====
export const CommunityAPI = {
  listPosts: () => api<Post[]>("/posts"),
  getPost: (id: number) => api<PostDetail>(`/posts/${id}`),
  createPost: (data: PostCreate) => api<Post>("/posts", { method: "POST", body: JSON.stringify(data) }),
  toggleLike: (postId: number) => api<{ liked: boolean; likes_count: number }>(`/posts/${postId}/like`, { method: "PATCH" }),
  listComments: (postId: number) => api<Comment[]>(`/posts/${postId}/comments`),
  addComment: (postId: number, data: CommentCreate) => api<Comment>(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(data) }),
  getUserProfile: (userId: number) => api<UserProfile>(`/users/${userId}`),
};

// ===== Groceries API =====
export const GroceriesAPI = {
  list: () => api<Grocery[]>("/groceries/"),
  get: (id: number) => api<Grocery>(`/groceries/${id}`),
  create: (data: GroceryCreate) => api<Grocery>("/groceries/", { method: "POST", body: JSON.stringify(data) }),
};

// ===== Recipes API =====
export const RecipesAPI = {
  list: () => api<Recipe[]>("/recipes/"),
  get: (id: number) => api<Recipe>(`/recipes/${id}`),
  create: (data: RecipeCreate) => api<Recipe>("/recipes/", { method: "POST", body: JSON.stringify(data) }),
};

// ===== AI API =====
export type AISuggestionRequest = {
  query: string;
  dietary_restrictions?: string[];
  max_results?: number;
};

export type AISuggestedRecipe = {
  name: string;
  description: string;
  ingredients: string[];
  cost?: string;
  calories?: number;
  protein?: number;
  prepTime?: string;
  cookTime?: string;
};

export type AISuggestion = {
  name: string;
  description: string;
  ingredients: string[];
  calories?: number | null;
  protein?: number | null;
  estimated_cost?: number | null;
};

export const AIAPI = {
  getSuggestions: (data: AISuggestionRequest) =>
    api<AISuggestedRecipe[]>("/ai/suggest", { method: "POST", body: JSON.stringify(data) }),
};

export const AiAPI = {
  suggest: (payload: AISuggestionRequest) =>
    api<AISuggestion[]>("/ai/suggest", { method: "POST", body: JSON.stringify(payload) }),
};

// ===== React Query Hooks =====

// Auth hooks
export function useAuth() {
  return useQuery({ queryKey: ["auth", "me"], queryFn: AuthAPI.getMe, retry: false, staleTime: Infinity });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: AuthAPI.register, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }) });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: AuthAPI.login, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }) });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    AuthAPI.logout();
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.clear();
  };
}

// Community hooks
export function usePosts() {
  return useQuery({ queryKey: ["posts"], queryFn: CommunityAPI.listPosts });
}

export function usePost(id: number) {
  return useQuery({ queryKey: ["post", id], queryFn: () => CommunityAPI.getPost(id), enabled: !!id && id > 0 });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: CommunityAPI.createPost, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }) });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: CommunityAPI.toggleLike, onSuccess: (_, postId) => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
  }});
}

export function useComments(postId: number) {
  return useQuery({ queryKey: ["comments", postId], queryFn: () => CommunityAPI.listComments(postId), enabled: !!postId && postId > 0 });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: CommentCreate }) => CommunityAPI.addComment(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUserProfile(userId: number) {
  return useQuery({ queryKey: ["userProfile", userId], queryFn: () => CommunityAPI.getUserProfile(userId), enabled: !!userId && userId > 0 });
}

// Recipes hooks
export function useRecipes() {
  return useQuery({ queryKey: ["recipes"], queryFn: RecipesAPI.list });
}

export function useRecipe(id: number) {
  return useQuery({ queryKey: ["recipe", id], queryFn: () => RecipesAPI.get(id), enabled: !!id && id > 0 });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: RecipesAPI.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }) });
}

// AI hooks
export function useAISuggestions() {
  return useMutation({ mutationFn: AIAPI.getSuggestions });
}

export { BASE_URL };
