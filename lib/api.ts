// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}

/* -------------------------------------------
   GROCERIES API
------------------------------------------- */

export type Grocery = {
  id: number;
  name: string;
  category?: string | null;
  calories?: number | null;
  protein?: number | null;
};

export type GroceryCreate = Omit<Grocery, "id">;

export const GroceriesAPI = {
  list: () => api<Grocery[]>("/groceries/"),
  get: (id: number) => api<Grocery>(`/groceries/${id}`),
  create: (data: GroceryCreate) =>
    api<Grocery>("/groceries/", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: number) =>
    api<null>(`/groceries/${id}`, { method: "DELETE" }),
};

/* -------------------------------------------
   AI SUGGEST API
------------------------------------------- */

export type AISuggestRequest = {
  query: string;
  dietary_restrictions: string[];
  max_results: number;
};

export type AISuggestion = {
  name: string;
  description: string;
  ingredients: string[];
  calories?: number | null;
  protein?: number | null;
  estimated_cost?: number | null;
};

export type AISuggestResponse = {
  original_query: string;
  suggestions: AISuggestion[];
};

export const AiAPI = {
  suggest: (payload: AISuggestRequest) =>
    api<AISuggestResponse>("/ai/suggest", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};


export { BASE_URL };
